import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Droplets, Utensils, Trophy, TrendingUp, Activity, Target, Gift, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import heroImage from "@/assets/nutrisnap-hero.jpg";

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  
  const dailyGoals = {
    calories: { current: 1650, target: profile?.daily_calorie_target || 2000 },
    water: { current: 6, target: profile?.daily_water_target || 8 },
    steps: { current: 8500, target: 10000 }
  };

  const progressPercentage = (current: number, target: number) => (current / target) * 100;

  return (
    <div className="min-h-screen bg-gradient-wellness">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden rounded-b-3xl">
        <img 
          src={heroImage} 
          alt="NutriSnap - Your nutrition companion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-80" />
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <div className="text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
            </h1>
            <p className="text-lg opacity-90">Your daily nutrition companion</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Daily Goals Overview */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today's Progress
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Calories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-nutrition-calories" />
                  <span className="font-medium">Calories</span>
                </div>
                <Badge variant="secondary">{dailyGoals.calories.current}/{dailyGoals.calories.target}</Badge>
              </div>
              <Progress value={progressPercentage(dailyGoals.calories.current, dailyGoals.calories.target)} className="h-2" />
            </div>

            {/* Water */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-nutrition-water" />
                  <span className="font-medium">Water</span>
                </div>
                <Badge variant="secondary">{dailyGoals.water.current}/{dailyGoals.water.target} glasses</Badge>
              </div>
              <Progress value={progressPercentage(dailyGoals.water.current, dailyGoals.water.target)} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">Steps</span>
                </div>
                <Badge variant="secondary">{dailyGoals.steps.current.toLocaleString()}/{dailyGoals.steps.target.toLocaleString()}</Badge>
              </div>
              <Progress value={progressPercentage(dailyGoals.steps.current, dailyGoals.steps.target)} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center shadow-card hover:shadow-glow transition-all cursor-pointer">
            <Utensils className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Track Meal</h3>
          </Card>
          
          <Card className="p-4 text-center shadow-card hover:shadow-glow transition-all cursor-pointer">
            <Droplets className="h-8 w-8 mx-auto mb-2 text-nutrition-water" />
            <h3 className="font-medium">Log Water</h3>
          </Card>
          
          <Card className="p-4 text-center shadow-card hover:shadow-glow transition-all cursor-pointer">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-accent" />
            <h3 className="font-medium">Trending</h3>
          </Card>
          
          <Card className="p-4 text-center shadow-card hover:shadow-glow transition-all cursor-pointer">
            <Gift className="h-8 w-8 mx-auto mb-2 text-nutrition-vitamins" />
            <h3 className="font-medium">Rewards</h3>
          </Card>
        </div>

        {/* Achievement Banner */}
        {progressPercentage(dailyGoals.water.current, dailyGoals.water.target) >= 75 && (
          <Card className="p-4 bg-gradient-secondary border-accent">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-accent" />
              <div>
                <h3 className="font-semibold text-secondary-foreground">Great Progress!</h3>
                <p className="text-sm text-secondary-foreground/80">You're almost at your water goal for today!</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};