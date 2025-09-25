import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
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
      const today = new Date().toISOString().split("T")[0];

      const { data: mealsData, error } = await supabase
        .from("meals")
        .select(
          `
          *,
          meal_items (
            *,
            foods (*)
          )
        `
        )
        .eq("user_id", user.id)
        .eq("meal_date", today)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching meals:", error);
        toast({
          title: "Error loading meals",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMeals((mealsData || []) as Meal[]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("verified", true)
        .order("name");

      if (error) {
        console.error("Error fetching foods:", error);
        return;
      }

      setFoods(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ NEW: Fetch foods from OpenFoodFacts API
  const fetchApiFoods = async (query: string) => {
    try {
      if (!query) return [];

      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1`;

      const res = await fetch(url);

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      if (!data.products) return [];

      return data.products.map((p: any) => ({
        id: p.code,
        name: p.product_name || "Unnamed product",
        brand: p.brands || "",
        calories_per_100g: p.nutriments?.["energy-kcal_100g"] || 0,
        protein_per_100g: p.nutriments?.["proteins_100g"] || 0,
        carbs_per_100g: p.nutriments?.["carbohydrates_100g"] || 0,
        fat_per_100g: p.nutriments?.["fat_100g"] || 0,
        fiber_per_100g: p.nutriments?.["fiber_100g"] || 0,
        sugar_per_100g: p.nutriments?.["sugars_100g"] || 0,
        sodium_per_100g: p.nutriments?.["sodium_100g"] || 0,
        verified: false,
      }));
    } catch (error) {
      console.error("Error fetching API foods:", error);
      return [];
    }
  };

  const addMealItem = async (
    mealType: Meal["meal_type"],
    foodId: string,
    quantityGrams: number
  ) => {
    if (!user) return;

    setSaving(true);
    try {
      const food = foods.find((f) => f.id === foodId);
      if (!food) {
        throw new Error("Food not found");
      }

      const factor = quantityGrams / 100;
      const calories = food.calories_per_100g * factor;
      const protein = food.protein_per_100g * factor;
      const carbs = food.carbs_per_100g * factor;
      const fat = food.fat_per_100g * factor;

      const today = new Date().toISOString().split("T")[0];
      let meal = meals.find(
        (m) => m.meal_type === mealType && m.meal_date === today
      );

      if (!meal) {
        const { data: newMeal, error: mealError } = await supabase
          .from("meals")
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
          .maybeSingle();

        if (mealError) throw mealError;
        meal = newMeal as Meal;
      } else {
        const { error: updateError } = await supabase
          .from("meals")
          .update({
            total_calories: meal.total_calories + calories,
            total_protein: meal.total_protein + protein,
            total_carbs: meal.total_carbs + carbs,
            total_fat: meal.total_fat + fat,
          })
          .eq("id", meal.id);

        if (updateError) throw updateError;
      }

      const { error: itemError } = await supabase.from("meal_items").insert({
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
      console.error("Error adding meal item:", error);
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
        .from("meal_items")
        .delete()
        .eq("id", mealItemId);

      if (error) throw error;

      await fetchTodaysMeals();

      toast({
        title: "Food removed",
        description: "Food item removed from meal",
      });
    } catch (error: any) {
      console.error("Error removing meal item:", error);
      toast({
        title: "Error removing food",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // ✅ updated: merge local Supabase foods + API foods
  const searchFoods = async (query: string): Promise<Food[]> => {
    if (!query) return foods;

    const localMatches = foods.filter(
      (food) =>
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        (food.brand && food.brand.toLowerCase().includes(query.toLowerCase()))
    );

    const apiMatches = await fetchApiFoods(query);

    return [...localMatches, ...apiMatches];
  };

  const getTodaysNutrition = () => {
    const today = new Date().toISOString().split("T")[0];
    const todaysMeals = meals.filter((m) => m.meal_date === today);

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
