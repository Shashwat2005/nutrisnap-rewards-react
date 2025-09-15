import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Flame, Star, Award } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { format } from 'date-fns';

export const AchievementCenter = () => {
  const { achievements, streaks, loading, getTotalPoints } = useAchievements();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalPoints = getTotalPoints();

  const getStreakIcon = (streakType: string) => {
    switch (streakType) {
      case 'water_goal': return <Flame className="h-4 w-4 text-blue-500" />;
      case 'calorie_goal': return <Target className="h-4 w-4 text-green-500" />;
      case 'protein_goal': return <Trophy className="h-4 w-4 text-purple-500" />;
      case 'daily_logging': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'exercise_goal': return <Award className="h-4 w-4 text-red-500" />;
      default: return <Flame className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStreakTitle = (streakType: string) => {
    switch (streakType) {
      case 'water_goal': return 'Water Goal';
      case 'calorie_goal': return 'Calorie Goal';
      case 'protein_goal': return 'Protein Goal';
      case 'daily_logging': return 'Daily Logging';
      case 'exercise_goal': return 'Exercise Goal';
      default: return streakType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Achievements</h1>
        </div>

        {/* Points Summary */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{totalPoints}</div>
              <div className="text-muted-foreground">Total Points Earned</div>
              <Badge variant="secondary" className="mt-2">
                {achievements.length} Achievement{achievements.length !== 1 ? 's' : ''} Unlocked
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current Streaks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Current Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {streaks.length > 0 ? (
              <div className="grid gap-3">
                {streaks.map((streak) => (
                  <div key={streak.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStreakIcon(streak.streak_type)}
                      <div>
                        <div className="font-medium">{getStreakTitle(streak.streak_type)}</div>
                        <div className="text-sm text-muted-foreground">
                          Best: {streak.longest_streak} days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{streak.current_streak}</div>
                      <div className="text-xs text-muted-foreground">days</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Start completing your daily goals to build streaks!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 10).map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement.achievement_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Unlocked {format(new Date(achievement.unlocked_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      +{achievement.points}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium mb-2">No achievements yet</div>
                <div className="text-sm">
                  Start logging your meals and completing daily goals to unlock achievements!
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Streak Master</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Maintain consistent daily habits (3, 7, 14, 30+ day streaks)
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Goal Crusher</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Hit your daily nutrition and fitness targets
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Consistency Champion</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Log meals and track progress regularly
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};