import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, Minus, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WaterTracker = () => {
  const [waterIntake, setWaterIntake] = useState(6);
  const dailyGoal = 8;
  const { toast } = useToast();

  const addWater = () => {
    if (waterIntake < 15) {
      setWaterIntake(prev => prev + 1);
      if (waterIntake + 1 === dailyGoal) {
        toast({
          title: "🎉 Daily Goal Achieved!",
          description: "Great job! You've reached your water intake goal for today.",
        });
      }
    }
  };

  const removeWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(prev => prev - 1);
    }
  };

  const progressPercentage = (waterIntake / dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-wellness p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Water Tracker</h1>
          <p className="text-muted-foreground">Stay hydrated throughout the day</p>
        </div>

        {/* Water Visual */}
        <Card className="p-8 text-center shadow-card">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
              <Droplets className="h-16 w-16 text-nutrition-water" />
            </div>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-nutrition-water rounded-full transition-all duration-500"
              style={{ height: `${progressPercentage}%` }}
            />
            <div className="absolute inset-0 rounded-full border-4 border-nutrition-water" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2">{waterIntake}/{dailyGoal}</h2>
          <p className="text-muted-foreground mb-4">glasses today</p>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={removeWater}
              disabled={waterIntake === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Button onClick={addWater} className="px-8">
              <Plus className="h-4 w-4 mr-2" />
              Add Glass
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={addWater}
              disabled={waterIntake >= 15}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Water History */}
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Today's Intake</h3>
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: dailyGoal }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-full border-2 flex items-center justify-center ${
                  index < waterIntake 
                    ? 'bg-nutrition-water border-nutrition-water' 
                    : 'border-muted'
                }`}
              >
                <Droplets className={`h-3 w-3 ${
                  index < waterIntake ? 'text-white' : 'text-muted-foreground'
                }`} />
              </div>
            ))}
          </div>
        </Card>

        {/* Reminder Settings */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Water Reminders</h3>
                <p className="text-sm text-muted-foreground">Get notified every 2 hours</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Setup
            </Button>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-gradient-secondary border-accent shadow-card">
          <h3 className="font-semibold text-secondary-foreground mb-2">💡 Hydration Tip</h3>
          <p className="text-sm text-secondary-foreground/80">
            Start your day with a glass of water to kickstart your metabolism and boost energy levels.
          </p>
        </Card>
      </div>
    </div>
  );
};