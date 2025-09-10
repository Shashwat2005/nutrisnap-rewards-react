import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Trophy, Star, ShoppingBag, Coffee, Utensils } from "lucide-react";

export const RewardsSection = () => {
  const currentPoints = 850;
  const nextRewardAt = 1000;
  const progressToNext = (currentPoints / nextRewardAt) * 100;

  const achievements = [
    { id: 1, title: "Hydration Hero", description: "Reached water goal 7 days in a row", earned: true, points: 100 },
    { id: 2, title: "Calorie Tracker", description: "Logged meals for 30 days", earned: true, points: 200 },
    { id: 3, title: "Step Master", description: "Hit 10,000 steps daily for a week", earned: false, points: 150 },
    { id: 4, title: "Recipe Explorer", description: "Tried 10 new healthy recipes", earned: false, points: 175 },
  ];

  const availableRewards = [
    { 
      id: 1, 
      store: "Starbucks", 
      offer: "Free Coffee", 
      points: 500, 
      icon: Coffee,
      description: "Any size drink",
      available: true 
    },
    { 
      id: 2, 
      store: "Whole Foods", 
      offer: "$10 Off", 
      points: 750, 
      icon: ShoppingBag,
      description: "On groceries $50+",
      available: true 
    },
    { 
      id: 3, 
      store: "Sweetgreen", 
      offer: "Free Salad", 
      points: 1000, 
      icon: Utensils,
      description: "Any signature salad",
      available: false 
    },
    { 
      id: 4, 
      store: "Target", 
      offer: "$15 Off", 
      points: 1200, 
      icon: ShoppingBag,
      description: "Health & wellness items",
      available: false 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-wellness p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Rewards</h1>
          <p className="text-muted-foreground">Earn points for healthy habits</p>
        </div>

        {/* Points Overview */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow">
          <div className="text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h2 className="text-3xl font-bold mb-2">{currentPoints.toLocaleString()}</h2>
            <p className="text-primary-foreground/80 mb-4">Total Points Earned</p>
            
            <div className="bg-primary-foreground/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Next Reward:</span>
                <span className="text-sm font-semibold">{nextRewardAt - currentPoints} points to go</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Available Rewards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Rewards</h3>
          <div className="grid gap-4">
            {availableRewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <Card key={reward.id} className={`p-4 shadow-card ${
                  !reward.available ? 'opacity-60' : 'hover:shadow-glow transition-all'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{reward.store}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {reward.points} pts
                        </Badge>
                      </div>
                      <p className="font-medium text-primary">{reward.offer}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    
                    <Button 
                      variant={reward.available ? "default" : "outline"}
                      disabled={!reward.available || currentPoints < reward.points}
                      size="sm"
                    >
                      {reward.available && currentPoints >= reward.points ? "Redeem" : "Locked"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`p-4 shadow-card ${
                achievement.earned ? 'bg-gradient-secondary border-accent' : ''
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.earned ? (
                      <Trophy className="h-5 w-5" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.earned ? 'text-secondary-foreground' : ''
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned 
                        ? 'text-secondary-foreground/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  
                  <Badge variant={achievement.earned ? "default" : "outline"} className="text-xs">
                    +{achievement.points} pts
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <Card className="p-4 bg-gradient-secondary border-accent shadow-card">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-accent" />
            <div>
              <h3 className="font-semibold text-secondary-foreground">Daily Challenge</h3>
              <p className="text-sm text-secondary-foreground/80">
                Log 3 meals today and earn 50 bonus points!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};