import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface DailyProgress {
  id?: string;
  user_id: string;
  date: string;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  water_consumed: number;
  current_weight_kg?: number;
  steps_taken: number;
  exercise_minutes: number;
  mood_rating?: number;
  energy_level?: number;
  sleep_hours?: number;
  notes?: string;
}

export const useDailyProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todaysProgress, setTodaysProgress] = useState<DailyProgress | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodaysProgress();
      fetchWeeklyProgress();
    }
  }, [user]);

  const fetchTodaysProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily progress:', error);
        toast({
          title: "Error loading progress",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setTodaysProgress(data);
      } else {
        // Create today's progress entry
        const newProgress = {
          user_id: user.id,
          date: today,
          calories_consumed: 0,
          protein_consumed: 0,
          carbs_consumed: 0,
          fat_consumed: 0,
          water_consumed: 0,
          steps_taken: 0,
          exercise_minutes: 0,
        };

        const { data: created, error: createError } = await supabase
          .from('daily_progress')
          .insert(newProgress)
          .select()
          .single();

        if (createError) {
          console.error('Error creating daily progress:', createError);
        } else {
          setTodaysProgress(created);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyProgress = async () => {
    if (!user) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching weekly progress:', error);
        return;
      }

      setWeeklyProgress(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProgress = async (updates: Partial<DailyProgress>) => {
    if (!user || !todaysProgress) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('daily_progress')
        .update(updates)
        .eq('id', todaysProgress.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error saving progress",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setTodaysProgress(data);
      await fetchWeeklyProgress();
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addWater = async (glasses: number = 1) => {
    if (!todaysProgress) return;
    
    const newAmount = todaysProgress.water_consumed + glasses;
    const success = await updateProgress({ water_consumed: newAmount });
    
    if (success) {
      toast({
        title: "Water logged!",
        description: `${glasses} glass${glasses > 1 ? 'es' : ''} added`,
      });
    }
    
    return success;
  };

  const updateWeight = async (weight: number) => {
    const success = await updateProgress({ current_weight_kg: weight });
    
    if (success) {
      toast({
        title: "Weight updated!",
        description: `Weight set to ${weight}kg`,
      });
    }
    
    return success;
  };

  const logExercise = async (minutes: number) => {
    if (!todaysProgress) return;
    
    const newTotal = todaysProgress.exercise_minutes + minutes;
    const success = await updateProgress({ exercise_minutes: newTotal });
    
    if (success) {
      toast({
        title: "Exercise logged!",
        description: `${minutes} minutes added`,
      });
    }
    
    return success;
  };

  const setMoodAndEnergy = async (mood?: number, energy?: number) => {
    const updates: Partial<DailyProgress> = {};
    if (mood !== undefined) updates.mood_rating = mood;
    if (energy !== undefined) updates.energy_level = energy;
    
    const success = await updateProgress(updates);
    
    if (success) {
      toast({
        title: "Mood & energy updated!",
        description: "Your daily check-in has been saved",
      });
    }
    
    return success;
  };

  // Calculate progress percentages based on user's targets
  const getProgressPercentages = (profile: any) => {
    if (!todaysProgress || !profile) return null;

    return {
      calories: Math.min((todaysProgress.calories_consumed / profile.daily_calorie_target) * 100, 100),
      protein: Math.min((todaysProgress.protein_consumed / profile.daily_protein_target) * 100, 100),
      water: Math.min((todaysProgress.water_consumed / profile.daily_water_target) * 100, 100),
    };
  };

  return {
    todaysProgress,
    weeklyProgress,
    loading,
    saving,
    updateProgress,
    addWater,
    updateWeight,
    logExercise,
    setMoodAndEnergy,
    getProgressPercentages,
    refetchProgress: fetchTodaysProgress,
  };
};