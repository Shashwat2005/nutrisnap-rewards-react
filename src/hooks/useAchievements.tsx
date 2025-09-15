import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id?: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  points: number;
  unlocked_at: string;
  milestone_value?: number;
}

export interface Streak {
  id?: string;
  user_id: string;
  streak_type: 'calorie_goal' | 'water_goal' | 'protein_goal' | 'daily_logging' | 'exercise_goal';
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchStreaks();
    }
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStreaks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching streaks:', error);
        return;
      }

      setStreaks((data || []) as Streak[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (
    achievementType: string,
    achievementName: string,
    description: string,
    points: number,
    milestoneValue?: number
  ) => {
    if (!user) return;

    try {
      // Check if achievement already exists
      const existingAchievement = achievements.find(
        a => a.achievement_type === achievementType && a.milestone_value === milestoneValue
      );

      if (existingAchievement) return;

      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_type: achievementType,
          achievement_name: achievementName,
          description,
          points,
          milestone_value: milestoneValue,
        })
        .select()
        .single();

      if (error) throw error;

      setAchievements(prev => [data, ...prev]);
      
      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievementName} - ${points} points`,
      });

      return true;
    } catch (error: any) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  };

  const updateStreak = async (
    streakType: Streak['streak_type'],
    achieved: boolean
  ) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const existingStreak = streaks.find(s => s.streak_type === streakType);

      if (!existingStreak) {
        // Create new streak
        const newStreak = {
          user_id: user.id,
          streak_type: streakType,
          current_streak: achieved ? 1 : 0,
          longest_streak: achieved ? 1 : 0,
          last_activity_date: achieved ? today : undefined,
        };

        const { data, error } = await supabase
          .from('streaks')
          .insert(newStreak)
          .select()
          .single();

        if (error) throw error;
        setStreaks(prev => [...prev, data as Streak]);
      } else {
        // Update existing streak
        let newCurrentStreak = existingStreak.current_streak;
        let newLongestStreak = existingStreak.longest_streak;

        if (achieved) {
          // Check if this is a consecutive day
          const lastDate = existingStreak.last_activity_date ? new Date(existingStreak.last_activity_date) : null;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate && lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            newCurrentStreak += 1;
          } else if (lastDate && lastDate.toISOString().split('T')[0] === today) {
            // Already logged today, no change
            return;
          } else {
            newCurrentStreak = 1; // Reset streak
          }

          newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
        } else {
          newCurrentStreak = 0; // Break streak
        }

        const { error } = await supabase
          .from('streaks')
          .update({
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_activity_date: achieved ? today : existingStreak.last_activity_date,
          })
          .eq('id', existingStreak.id);

        if (error) throw error;

        // Update local state
        setStreaks(prev => prev.map(s => 
          s.id === existingStreak.id 
            ? { ...s, current_streak: newCurrentStreak, longest_streak: newLongestStreak }
            : s
        ));

        // Check for streak achievements
        if (achieved && newCurrentStreak > 0) {
          await checkStreakAchievements(streakType, newCurrentStreak);
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const checkStreakAchievements = async (streakType: string, streakCount: number) => {
    const milestones = [3, 7, 14, 30, 60, 100];
    
    for (const milestone of milestones) {
      if (streakCount === milestone) {
        await unlockAchievement(
          'streak',
          `${milestone}-Day ${streakType.replace('_', ' ')} Streak`,
          `Maintained a ${milestone}-day streak in ${streakType.replace('_', ' ')}`,
          milestone * 10,
          milestone
        );
      }
    }
  };

  const checkGoalAchievements = async (
    goalType: string,
    currentValue: number,
    targetValue: number
  ) => {
    if (currentValue >= targetValue) {
      const percentage = Math.round((currentValue / targetValue) * 100);
      
      if (percentage >= 100) {
        await unlockAchievement(
          'daily_goal',
          `${goalType} Goal Achieved`,
          `Hit your daily ${goalType} target`,
          50
        );
      }
    }
  };

  const getTotalPoints = (): number => {
    return achievements.reduce((total, achievement) => total + achievement.points, 0);
  };

  const getStreakByType = (type: Streak['streak_type']): Streak | undefined => {
    return streaks.find(s => s.streak_type === type);
  };

  return {
    achievements,
    streaks,
    loading,
    unlockAchievement,
    updateStreak,
    checkGoalAchievements,
    getTotalPoints,
    getStreakByType,
    refetchData: () => {
      fetchAchievements();
      fetchStreaks();
    },
  };
};