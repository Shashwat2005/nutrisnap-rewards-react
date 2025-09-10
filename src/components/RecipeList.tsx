import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Clock, Users, Heart, TrendingUp } from "lucide-react";

export const RecipeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const recipes = [
    {
      id: 1,
      name: "Quinoa Buddha Bowl",
      calories: 450,
      protein: 18,
      carbs: 52,
      vitamins: "A, C, K",
      time: "25 min",
      servings: 2,
      image: "🥗",
      trending: true,
      allergyFree: ["gluten-free", "vegan"],
      tags: ["protein", "vitamins"]
    },
    {
      id: 2,
      name: "Grilled Salmon & Vegetables",
      calories: 380,
      protein: 32,
      carbs: 15,
      vitamins: "D, B12, Omega-3",
      time: "30 min",
      servings: 1,
      image: "🐟",
      trending: false,
      allergyFree: ["dairy-free"],
      tags: ["protein"]
    },
    {
      id: 3,
      name: "Green Smoothie Bowl",
      calories: 320,
      protein: 12,
      carbs: 45,
      vitamins: "C, K, Folate",
      time: "10 min",
      servings: 1,
      image: "🥬",
      trending: true,
      allergyFree: ["vegan", "gluten-free"],
      tags: ["vitamins", "carbs"]
    },
    {
      id: 4,
      name: "Chicken & Sweet Potato",
      calories: 520,
      protein: 28,
      carbs: 35,
      vitamins: "A, B6",
      time: "40 min",
      servings: 2,
      image: "🍗",
      trending: false,
      allergyFree: ["dairy-free"],
      tags: ["protein", "carbs"]
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || recipe.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const trendingRecipes = recipes.filter(recipe => recipe.trending);

  return (
    <div className="min-h-screen bg-gradient-wellness p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Recipes & Meals</h1>
          <p className="text-muted-foreground">Discover healthy meals tailored for you</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" onClick={() => setActiveFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="protein" onClick={() => setActiveFilter("protein")}>Protein</TabsTrigger>
            <TabsTrigger value="carbs" onClick={() => setActiveFilter("carbs")}>Carbs</TabsTrigger>
            <TabsTrigger value="vitamins" onClick={() => setActiveFilter("vitamins")}>Vitamins</TabsTrigger>
            <TabsTrigger value="trending" onClick={() => setActiveFilter("trending")}>Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </TabsContent>

          <TabsContent value="protein" className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </TabsContent>

          <TabsContent value="carbs" className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </TabsContent>

          <TabsContent value="vitamins" className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card className="p-4 bg-gradient-secondary border-accent shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-secondary-foreground">Trending Now</h3>
              </div>
              <p className="text-sm text-secondary-foreground/80 mb-4">
                Popular recipes trending on social media this week
              </p>
            </Card>
            
            {trendingRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe }: { recipe: any }) => (
  <Card className="p-4 shadow-card hover:shadow-glow transition-all cursor-pointer">
    <div className="flex gap-4">
      <div className="text-4xl">{recipe.image}</div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{recipe.name}</h3>
          {recipe.trending && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {recipe.calories} cal
          </Badge>
          <Badge variant="outline" className="text-xs">
            {recipe.protein}g protein
          </Badge>
          <Badge variant="outline" className="text-xs">
            {recipe.carbs}g carbs
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.time}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.allergyFree.map((allergy: string) => (
            <Badge key={allergy} variant="secondary" className="text-xs bg-primary/10 text-primary">
              {allergy}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Vitamins: {recipe.vitamins}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-3 w-3" />
            </Button>
            <Button size="sm">View Recipe</Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
);