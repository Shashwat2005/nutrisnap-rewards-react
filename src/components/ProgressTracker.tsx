import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Droplets, Scale, Activity, Heart, Brain, Moon, Plus } from 'lucide-react';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { useProfile } from '@/hooks/useProfile';

export const ProgressTracker = () => {
  const { todaysProgress, saving, addWater, updateWeight, logExercise, setMoodAndEnergy, updateProgress, getProgressPercentages } = useDailyProgress();
  const { profile } = useProfile();
  const [weightInput, setWeightInput] = useState('');
  const [exerciseInput, setExerciseInput] = useState('');
  const [moodRating, setMoodRating] = useState<number[]>([3]);
  const [energyRating, setEnergyRating] = useState<number[]>([3]);
  const [notes, setNotes] = useState('');

  if (!todaysProgress || !profile) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const progressPercentages = getProgressPercentages(profile);

  const handleWeightUpdate = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return;
    
    const success = await updateWeight(weight);
    if (success) {
      setWeightInput('');
    }
  };

  const handleExerciseLog = async () => {
    const minutes = parseInt(exerciseInput);
    if (isNaN(minutes) || minutes <= 0) return;
    
    const success = await logExercise(minutes);
    if (success) {
      setExerciseInput('');
    }
  };

  const handleMoodEnergyUpdate = async () => {
    await setMoodAndEnergy(moodRating[0], energyRating[0]);
  };

  const handleNotesUpdate = async () => {
    const success = await updateProgress({ notes });
    if (success) {
      setNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Daily Progress</h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{todaysProgress.water_consumed}</div>
                  <div className="text-sm text-muted-foreground">/ {profile.daily_water_target} glasses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{todaysProgress.exercise_minutes}</div>
                  <div className="text-sm text-muted-foreground">minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutrition Progress */}
        {progressPercentages && (
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span>{Math.round(todaysProgress.calories_consumed)} / {profile.daily_calorie_target}</span>
                </div>
                <Progress value={progressPercentages.calories} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Protein</span>
                  <span>{Math.round(todaysProgress.protein_consumed)}g / {profile.daily_protein_target}g</span>
                </div>
                <Progress value={progressPercentages.protein} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Water</span>
                  <span>{todaysProgress.water_consumed} / {profile.daily_water_target} glasses</span>
                </div>
                <Progress value={progressPercentages.water} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Water Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => addWater(1)} disabled={saving}>
                <Plus className="h-4 w-4 mr-1" />
                1 Glass
              </Button>
              <Button onClick={() => addWater(2)} disabled={saving} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                2 Glasses
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weight Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-500" />
              Weight Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Weight in kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleWeightUpdate} disabled={saving || !weightInput}>
                Update
              </Button>
            </div>
            {todaysProgress.current_weight_kg && (
              <div className="mt-2 text-sm text-muted-foreground">
                Current: {todaysProgress.current_weight_kg}kg
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise Logging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Exercise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Minutes exercised"
                value={exerciseInput}
                onChange={(e) => setExerciseInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleExerciseLog} disabled={saving || !exerciseInput}>
                Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mood & Energy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Mood & Energy Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Mood: {moodRating[0]}/5</span>
              </div>
              <Slider
                value={moodRating}
                onValueChange={setMoodRating}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Energy: {energyRating[0]}/5</span>
              </div>
              <Slider
                value={energyRating}
                onValueChange={setEnergyRating}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <Button onClick={handleMoodEnergyUpdate} disabled={saving} className="w-full">
              Update Check-in
            </Button>

            {todaysProgress.mood_rating && (
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Current Mood: {todaysProgress.mood_rating}/5</span>
                <span>Current Energy: {todaysProgress.energy_level}/5</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="How was your day? Any observations about your health, mood, or goals..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <Button onClick={handleNotesUpdate} disabled={saving || !notes.trim()}>
              Save Notes
            </Button>
            {todaysProgress.notes && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Today's notes:</div>
                <div className="text-sm">{todaysProgress.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};