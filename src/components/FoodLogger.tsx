import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Search, Plus, Minus, Utensils, Coffee, Sun, Moon, Cookie, Zap, Leaf, Timer, Apple } from 'lucide-react';
import { useMeals, type Meal } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';

export const FoodLogger = () => {
  const { meals, foods, loading, saving, addMealItem, removeMealItem, searchFoods, getTodaysNutrition } = useMeals();
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<Meal['meal_type']>('breakfast');
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('100');

 const [searchResults, setSearchResults] = useState<Food[]>([]);

useEffect(() => {
  let active = true;
  const runSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchFoods(searchQuery);
      if (active) setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  runSearch();
  return () => { active = false };
}, [searchQuery]);
  const todaysNutrition = getTodaysNutrition();

  const getMealIcon = (mealType: Meal['meal_type']) => {
    const icons = {
      breakfast: Coffee,
      lunch: Sun,
      dinner: Moon,
      snack: Cookie,
    };
    return icons[mealType];
  };

  const getMealColor = (mealType: Meal['meal_type']) => {
    const colors = {
      breakfast: 'nutrition-calories',
      lunch: 'nutrition-protein', 
      dinner: 'nutrition-water',
      snack: 'accent',
    };
    return colors[mealType];
  };

  const getProgressPercentage = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const handleAddFood = async () => {
    if (!selectedFood || !quantity) return;

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return;

    const success = await addMealItem(selectedMealType, selectedFood, quantityNum);
    if (success) {
      setSelectedFood('');
      setQuantity('100');
      setSearchQuery('');
    }
  };

  const getMealsByType = (mealType: Meal['meal_type']) => {
    return meals.filter(m => m.meal_type === mealType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-nutrition-calories/20 border-t-nutrition-calories"></div>
          <p className="text-muted-foreground">Loading your meal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
          <Card className="relative bg-card/80 backdrop-blur-sm border-0 shadow-elegant rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-nutrition-calories/5 via-nutrition-protein/5 to-nutrition-water/5"></div>
            <CardContent className="relative p-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Food Logger
                  </h1>
                  <p className="text-muted-foreground">Track your meals and reach your nutrition goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Nutrition Summary */}
        <Card className="bg-card/60 backdrop-blur-sm border-nutrition-calories/20 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-nutrition-calories/5 to-transparent"></div>
          <CardHeader className="relative bg-gradient-to-r from-nutrition-calories/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-nutrition-calories/15 rounded-xl">
                <Zap className="h-5 w-5 text-nutrition-calories" />
              </div>
              Today's Nutrition Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="relative p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Calories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">🔥 Calories</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(todaysNutrition.calories)}/{profile?.daily_calorie_target || 2000}
                  </span>
                </div>
                <div className="text-2xl font-bold text-nutrition-calories">
                  {Math.round(todaysNutrition.calories)}
                </div>
                <Progress 
                  value={getProgressPercentage(todaysNutrition.calories, profile?.daily_calorie_target || 2000)} 
                  className="h-2 bg-nutrition-calories/10"
                />
              </div>

              {/* Protein */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">🥩 Protein</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(todaysNutrition.protein)}g/{profile?.daily_protein_target || 150}g
                  </span>
                </div>
                <div className="text-2xl font-bold text-nutrition-protein">
                  {Math.round(todaysNutrition.protein)}g
                </div>
                <Progress 
                  value={getProgressPercentage(todaysNutrition.protein, profile?.daily_protein_target || 150)} 
                  className="h-2 bg-nutrition-protein/10"
                />
              </div>

              {/* Carbs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">🌾 Carbs</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(todaysNutrition.carbs)}g/{profile?.daily_carb_target || 250}g
                  </span>
                </div>
                <div className="text-2xl font-bold text-nutrition-carbs">
                  {Math.round(todaysNutrition.carbs)}g
                </div>
                <Progress 
                  value={getProgressPercentage(todaysNutrition.carbs, profile?.daily_carb_target || 250)} 
                  className="h-2 bg-nutrition-carbs/10"
                />
              </div>

              {/* Fat */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">🥑 Fat</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(todaysNutrition.fat)}g/{profile?.daily_fat_target || 67}g
                  </span>
                </div>
                <div className="text-2xl font-bold text-nutrition-fat">
                  {Math.round(todaysNutrition.fat)}g
                </div>
                <Progress 
                  value={getProgressPercentage(todaysNutrition.fat, profile?.daily_fat_target || 67)} 
                  className="h-2 bg-nutrition-fat/10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Food Form */}
        <Card className="bg-card/60 backdrop-blur-sm border-secondary/20 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
          <CardHeader className="relative bg-gradient-to-r from-secondary/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-secondary/15 rounded-xl">
                <Plus className="h-5 w-5 text-secondary" />
              </div>
              Add Food to Your Meal
            </CardTitle>
          </CardHeader>
          <CardContent className="relative p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <Input
                  placeholder="Search for foods (e.g., apple, chicken breast)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-background/50 border-muted-foreground/20 focus:border-secondary/50 rounded-xl h-12"
                />
              </div>
              <Select value={selectedMealType} onValueChange={(value: Meal['meal_type']) => setSelectedMealType(value)}>
                <SelectTrigger className="w-full md:w-40 bg-background/50 border-muted-foreground/20 focus:border-secondary/50 rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-muted-foreground/20 rounded-xl">
                  <SelectItem value="breakfast">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4" />
                      Breakfast
                    </div>
                  </SelectItem>
                  <SelectItem value="lunch">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Lunch
                    </div>
                  </SelectItem>
                  <SelectItem value="dinner">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dinner
                    </div>
                  </SelectItem>
                  <SelectItem value="snack">
                    <div className="flex items-center gap-2">
                      <Cookie className="h-4 w-4" />
                      Snack
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {searchQuery && (
              <div className="bg-gradient-to-r from-secondary/5 to-transparent p-4 rounded-2xl border border-secondary/10">
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {searchResults.length > 0 ? (
                    searchResults.map((food) => (
                      <div
                        key={food.id}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          selectedFood === food.id 
                            ? 'bg-secondary/10 border-2 border-secondary/30 shadow-md' 
                            : 'bg-background/70 border border-muted-foreground/10 hover:bg-secondary/5'
                        }`}
                        onClick={() => setSelectedFood(food.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-secondary" />
                              {food.name}
                            </div>
                            {food.brand && (
                              <div className="text-sm text-muted-foreground mt-1">{food.brand}</div>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>🔥 {food.calories_per_100g} cal</span>
                              <span>🥩 {food.protein_per_100g}g protein</span>
                              <span>🌾 {food.carbs_per_100g}g carbs</span>
                              <span>🥑 {food.fat_per_100g}g fat</span>
                            </div>
                          </div>
                          {food.verified && (
                            <Badge variant="secondary" className="ml-2 bg-secondary/10 text-secondary border-secondary/20">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Apple className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      No foods found. Try a different search term.
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedFood && (
              <div className="bg-gradient-to-r from-accent/5 to-transparent p-4 rounded-2xl border border-accent/10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-semibold text-foreground mb-2 block">
                      Quantity (grams)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter amount in grams"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-background/70 border-muted-foreground/20 focus:border-accent/50 rounded-xl"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAddFood} 
                      disabled={saving}
                      className="w-full md:w-auto bg-gradient-primary hover:bg-gradient-primary/80 text-white rounded-xl px-6 py-3 shadow-glow"
                    >
                      {saving ? (
                        <>
                          <Timer className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Meal
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meals by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
            const mealItems = getMealsByType(mealType);
            const mealTotal = mealItems.reduce((sum, meal) => ({
              calories: sum.calories + meal.total_calories,
              protein: sum.protein + meal.total_protein,
              carbs: sum.carbs + meal.total_carbs,
              fat: sum.fat + meal.total_fat,
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            const MealIcon = getMealIcon(mealType);
            const mealColorClass = {
              breakfast: 'nutrition-calories',
              lunch: 'nutrition-protein', 
              dinner: 'nutrition-water',
              snack: 'accent',
            }[mealType];

            return (
              <Card key={mealType} className={`bg-card/60 backdrop-blur-sm ${
                mealType === 'breakfast' ? 'border-nutrition-calories/20' :
                mealType === 'lunch' ? 'border-nutrition-protein/20' :
                mealType === 'dinner' ? 'border-nutrition-water/20' :
                'border-accent/20'
              } shadow-elegant rounded-2xl overflow-hidden`}>
                <div className={`absolute inset-0 ${
                  mealType === 'breakfast' ? 'bg-gradient-to-br from-nutrition-calories/5' :
                  mealType === 'lunch' ? 'bg-gradient-to-br from-nutrition-protein/5' :
                  mealType === 'dinner' ? 'bg-gradient-to-br from-nutrition-water/5' :
                  'bg-gradient-to-br from-accent/5'
                } to-transparent`}></div>
                <CardHeader className={`relative ${
                  mealType === 'breakfast' ? 'bg-gradient-to-r from-nutrition-calories/5' :
                  mealType === 'lunch' ? 'bg-gradient-to-r from-nutrition-protein/5' :
                  mealType === 'dinner' ? 'bg-gradient-to-r from-nutrition-water/5' :
                  'bg-gradient-to-r from-accent/5'
                } to-transparent`}>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        mealType === 'breakfast' ? 'bg-nutrition-calories/15' :
                        mealType === 'lunch' ? 'bg-nutrition-protein/15' :
                        mealType === 'dinner' ? 'bg-nutrition-water/15' :
                        'bg-accent/15'
                      }`}>
                        <MealIcon className={`h-5 w-5 ${
                          mealType === 'breakfast' ? 'text-nutrition-calories' :
                          mealType === 'lunch' ? 'text-nutrition-protein' :
                          mealType === 'dinner' ? 'text-nutrition-water' :
                          'text-accent'
                        }`} />
                      </div>
                      <span className="capitalize text-xl">{mealType}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`px-3 py-1 rounded-xl ${
                        mealType === 'breakfast' ? 'bg-nutrition-calories/10 text-nutrition-calories border-nutrition-calories/20' :
                        mealType === 'lunch' ? 'bg-nutrition-protein/10 text-nutrition-protein border-nutrition-protein/20' :
                        mealType === 'dinner' ? 'bg-nutrition-water/10 text-nutrition-water border-nutrition-water/20' :
                        'bg-accent/10 text-accent border-accent/20'
                      }`}
                    >
                      🔥 {Math.round(mealTotal.calories)} cal
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative p-6">
                  {mealItems.length > 0 ? (
                    <div className="space-y-4">
                      {mealItems.map((meal) => (
                        meal.meal_items?.map((item) => (
                          <div key={item.id} className="group">
                            <div className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-200 ${
                              mealType === 'breakfast' ? 'bg-gradient-to-r from-nutrition-calories/5 to-transparent border-nutrition-calories/10 hover:border-nutrition-calories/20' :
                              mealType === 'lunch' ? 'bg-gradient-to-r from-nutrition-protein/5 to-transparent border-nutrition-protein/10 hover:border-nutrition-protein/20' :
                              mealType === 'dinner' ? 'bg-gradient-to-r from-nutrition-water/5 to-transparent border-nutrition-water/10 hover:border-nutrition-water/20' :
                              'bg-gradient-to-r from-accent/5 to-transparent border-accent/10 hover:border-accent/20'
                            }`}>
                              <div className="flex-1">
                                <div className="font-semibold text-foreground flex items-center gap-2">
                                  <Leaf className={`h-4 w-4 ${
                                    mealType === 'breakfast' ? 'text-nutrition-calories' :
                                    mealType === 'lunch' ? 'text-nutrition-protein' :
                                    mealType === 'dinner' ? 'text-nutrition-water' :
                                    'text-accent'
                                  }`} />
                                  {item.food?.name}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    ⚖️ {item.quantity_grams}g
                                  </span>
                                  <span className="flex items-center gap-1">
                                    🔥 {Math.round(item.calories)} cal
                                  </span>
                                  <span className="flex items-center gap-1">
                                    🥩 {Math.round(item.protein)}g protein
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMealItem(item.id!)}
                                disabled={saving}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-xl"
                              >
                                {saving ? (
                                  <Timer className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))
                      ))}
                      
                      {/* Meal Summary */}
                      <div className={`p-4 rounded-xl border mt-4 ${
                        mealType === 'breakfast' ? 'bg-gradient-to-r from-nutrition-calories/10 to-transparent border-nutrition-calories/20' :
                        mealType === 'lunch' ? 'bg-gradient-to-r from-nutrition-protein/10 to-transparent border-nutrition-protein/20' :
                        mealType === 'dinner' ? 'bg-gradient-to-r from-nutrition-water/10 to-transparent border-nutrition-water/20' :
                        'bg-gradient-to-r from-accent/10 to-transparent border-accent/20'
                      }`}>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className={`text-lg font-bold ${
                              mealType === 'breakfast' ? 'text-nutrition-calories' :
                              mealType === 'lunch' ? 'text-nutrition-protein' :
                              mealType === 'dinner' ? 'text-nutrition-water' :
                              'text-accent'
                            }`}>
                              {Math.round(mealTotal.protein)}g
                            </div>
                            <div className="text-xs text-muted-foreground">Protein</div>
                          </div>
                          <div>
                            <div className={`text-lg font-bold ${
                              mealType === 'breakfast' ? 'text-nutrition-calories' :
                              mealType === 'lunch' ? 'text-nutrition-protein' :
                              mealType === 'dinner' ? 'text-nutrition-water' :
                              'text-accent'
                            }`}>
                              {Math.round(mealTotal.carbs)}g
                            </div>
                            <div className="text-xs text-muted-foreground">Carbs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className={`p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center ${
                        mealType === 'breakfast' ? 'bg-nutrition-calories/5' :
                        mealType === 'lunch' ? 'bg-nutrition-protein/5' :
                        mealType === 'dinner' ? 'bg-nutrition-water/5' :
                        'bg-accent/5'
                      }`}>
                        <MealIcon className={`h-8 w-8 ${
                          mealType === 'breakfast' ? 'text-nutrition-calories/40' :
                          mealType === 'lunch' ? 'text-nutrition-protein/40' :
                          mealType === 'dinner' ? 'text-nutrition-water/40' :
                          'text-accent/40'
                        }`} />
                      </div>
                      <div className="text-muted-foreground mb-2">No foods logged for {mealType}</div>
                      <p className="text-xs text-muted-foreground/60">
                        Add some foods to start tracking your nutrition
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
