import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Utensils } from 'lucide-react';
import { useMeals, type Meal } from '@/hooks/useMeals';

export const FoodLogger = () => {
  const { meals, foods, loading, saving, addMealItem, removeMealItem, searchFoods, getTodaysNutrition } = useMeals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<Meal['meal_type']>('breakfast');
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('100');

  const searchResults = searchFoods(searchQuery);
  const todaysNutrition = getTodaysNutrition();

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
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Utensils className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Food Logger</h1>
        </div>

        {/* Today's Nutrition Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(todaysNutrition.calories)}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(todaysNutrition.protein)}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(todaysNutrition.carbs)}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(todaysNutrition.fat)}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Food Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Food</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedMealType} onValueChange={(value: Meal['meal_type']) => setSelectedMealType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {searchQuery && (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFood === food.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedFood(food.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{food.name}</div>
                        {food.brand && <div className="text-sm text-muted-foreground">{food.brand}</div>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {food.calories_per_100g} cal/100g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedFood && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Quantity (grams)"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddFood} disabled={saving}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meals by Type */}
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
          const mealItems = getMealsByType(mealType);
          const mealTotal = mealItems.reduce((sum, meal) => ({
            calories: sum.calories + meal.total_calories,
            protein: sum.protein + meal.total_protein,
            carbs: sum.carbs + meal.total_carbs,
            fat: sum.fat + meal.total_fat,
          }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

          return (
            <Card key={mealType}>
              <CardHeader>
                <CardTitle className="capitalize flex justify-between items-center">
                  <span>{mealType}</span>
                  <Badge variant="secondary">
                    {Math.round(mealTotal.calories)} cal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mealItems.length > 0 ? (
                  <div className="space-y-3">
                    {mealItems.map((meal) => (
                      meal.meal_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{item.food?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity_grams}g • {Math.round(item.calories)} cal
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMealItem(item.id!)}
                            disabled={saving}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No foods logged for {mealType}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};