import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Sparkles, ChefHat, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CameraScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        ingredients: ["Tomatoes", "Onions", "Garlic", "Olive Oil", "Basil"],
        suggestedRecipes: [
          {
            name: "Classic Marinara Sauce",
            time: "30 min",
            difficulty: "Easy",
            calories: 120,
            image: "🍝"
          },
          {
            name: "Caprese Salad",
            time: "10 min", 
            difficulty: "Easy",
            calories: 200,
            image: "🥗"
          },
          {
            name: "Bruschetta",
            time: "15 min",
            difficulty: "Easy", 
            calories: 180,
            image: "🍞"
          }
        ]
      });
      toast({
        title: "Ingredients Detected!",
        description: "Found 5 ingredients. Here are some recipe suggestions.",
      });
    }, 2000);
  };

  const handleUpload = () => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files && input.files[0]) {
        handleScan();
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-wellness p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Ingredient Scanner</h1>
          <p className="text-muted-foreground">Snap a photo to get recipe suggestions</p>
        </div>

        {!scanResult ? (
          <>
            {/* Camera Interface */}
            <Card className="p-8 text-center shadow-card">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                {isScanning ? (
                  <div className="animate-spin">
                    <Sparkles className="h-16 w-16 text-primary-foreground" />
                  </div>
                ) : (
                  <Camera className="h-16 w-16 text-primary-foreground" />
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-2">
                {isScanning ? "Analyzing Ingredients..." : "Ready to Scan"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isScanning 
                  ? "AI is identifying your ingredients" 
                  : "Take a photo of your ingredients"
                }
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleScan} 
                  disabled={isScanning}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  {isScanning ? "Scanning..." : "Take Photo"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleUpload}
                  disabled={isScanning}
                  className="w-full"
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-gradient-secondary border-accent shadow-card">
              <h3 className="font-semibold text-secondary-foreground mb-2">📸 Scanning Tips</h3>
              <ul className="text-sm text-secondary-foreground/80 space-y-1">
                <li>• Make sure ingredients are clearly visible</li>
                <li>• Good lighting improves accuracy</li>
                <li>• Separate ingredients for best results</li>
              </ul>
            </Card>
          </>
        ) : (
          <>
            {/* Scan Results */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Detected Ingredients
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {scanResult.ingredients.map((ingredient: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setScanResult(null)}
                className="w-full"
              >
                Scan Again
              </Button>
            </Card>

            {/* Recipe Suggestions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Recipe Suggestions
              </h3>
              
              <div className="space-y-3">
                {scanResult.suggestedRecipes.map((recipe: any, index: number) => (
                  <Card key={index} className="p-4 shadow-card hover:shadow-glow transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{recipe.image}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{recipe.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recipe.time}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {recipe.calories} cal
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recipe.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">
                        View Recipe
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setScanResult(null)}>
                Scan Again
              </Button>
              <Button>
                Save Recipes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};