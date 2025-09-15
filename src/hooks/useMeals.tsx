import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Food {
  id: string;
  name: string;
  brand?: string;
  serving_size?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  verified: boolean;
}

export interface MealItem {
  id?: string;
  meal_id: string;
  food_id: string;
  quantity_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  food?: Food;
}

export interface Meal {
  id?: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_items?: MealItem[];
}

export const useMeals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodaysMeals();
      fetchFoods();
    }
  }, [user]);

  const fetchTodaysMeals = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: mealsData, error } = await supabase
        .from('meals')
        .select(`
          *,
          meal_items (
            *,
            foods (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('meal_date', today)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching meals:', error);
        toast({
          title: "Error loading meals",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMeals((mealsData || []) as Meal[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('verified', true)
        .order('name');

      if (error) {
        console.error('Error fetching foods:', error);
        return;
      }

      setFoods(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addMealItem = async (
    mealType: Meal['meal_type'],
    foodId: string,
    quantityGrams: number
  ) => {
    if (!user) return;

    setSaving(true);
    try {
      // Get food data
      const food = foods.find(f => f.id === foodId);
      if (!food) {
        throw new Error('Food not found');
      }

      // Calculate nutrition values
      const factor = quantityGrams / 100;
      const calories = food.calories_per_100g * factor;
      const protein = food.protein_per_100g * factor;
      const carbs = food.carbs_per_100g * factor;
      const fat = food.fat_per_100g * factor;

      // Find or create meal for today
      const today = new Date().toISOString().split('T')[0];
      let meal = meals.find(m => m.meal_type === mealType && m.meal_date === today);

      if (!meal) {
        // Create new meal
        const { data: newMeal, error: mealError } = await supabase
          .from('meals')
          .insert({
            user_id: user.id,
            meal_type: mealType,
            meal_date: today,
            total_calories: calories,
            total_protein: protein,
            total_carbs: carbs,
            total_fat: fat,
          })
          .select()
          .single();

        if (mealError) throw mealError;
        meal = newMeal as Meal;
      } else {
        // Update existing meal totals
        const { error: updateError } = await supabase
          .from('meals')
          .update({
            total_calories: meal.total_calories + calories,
            total_protein: meal.total_protein + protein,
            total_carbs: meal.total_carbs + carbs,
            total_fat: meal.total_fat + fat,
          })
          .eq('id', meal.id);

        if (updateError) throw updateError;
      }

      // Add meal item
      const { error: itemError } = await supabase
        .from('meal_items')
        .insert({
          meal_id: meal.id,
          food_id: foodId,
          quantity_grams: quantityGrams,
          calories,
          protein,
          carbs,
          fat,
        });

      if (itemError) throw itemError;

      await fetchTodaysMeals();
      
      toast({
        title: "Food added!",
        description: `${food.name} added to ${mealType}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error adding meal item:', error);
      toast({
        title: "Error adding food",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeMealItem = async (mealItemId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('meal_items')
        .delete()
        .eq('id', mealItemId);

      if (error) throw error;

      await fetchTodaysMeals();
      
      toast({
        title: "Food removed",
        description: "Food item removed from meal",
      });
    } catch (error: any) {
      console.error('Error removing meal item:', error);
      toast({
        title: "Error removing food",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const searchFoods = (query: string): Food[] => {
    if (!query) return foods;
    
    const lowercaseQuery = query.toLowerCase();
    return foods.filter(food => 
      food.name.toLowerCase().includes(lowercaseQuery) ||
      (food.brand && food.brand.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getTodaysNutrition = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(m => m.meal_date === today);
    
    return todaysMeals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.total_calories,
        protein: total.protein + meal.total_protein,
        carbs: total.carbs + meal.total_carbs,
        fat: total.fat + meal.total_fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return {
    meals,
    foods,
    loading,
    saving,
    addMealItem,
    removeMealItem,
    searchFoods,
    getTodaysNutrition,
    refetchMeals: fetchTodaysMeals,
  };
};