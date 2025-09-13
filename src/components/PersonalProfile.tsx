import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { User, Heart, AlertTriangle, Target, Activity, X, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export const PersonalProfile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, saving, updateProfile } = useProfile();
  const [newAllergy, setNewAllergy] = useState("");
  const [newGoal, setNewGoal] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Error loading profile</p>
      </div>
    );
  }

  const handleInputChange = (field: keyof typeof profile, value: any) => {
    updateProfile({ [field]: value });
  };

  const addItem = (item: string, field: 'allergies' | 'health_goals') => {
    if (!item.trim()) return;
    
    const currentItems = profile[field] || [];
    if (!currentItems.includes(item.trim())) {
      updateProfile({
        [field]: [...currentItems, item.trim()]
      });
    }
    
    if (field === 'allergies') setNewAllergy("");
    if (field === 'health_goals') setNewGoal("");
  };

  const removeItem = (index: number, field: 'allergies' | 'health_goals' | 'dietary_preferences') => {
    const currentItems = profile[field] || [];
    updateProfile({
      [field]: currentItems.filter((_, i) => i !== index)
    });
  };

  const toggleDietaryPreference = (preference: string) => {
    const currentPrefs = profile.dietary_preferences || [];
    updateProfile({
      dietary_preferences: currentPrefs.includes(preference)
        ? currentPrefs.filter(p => p !== preference)
        : [...currentPrefs, preference]
    });
  };

  const commonAllergies = [
    "Nuts", "Dairy", "Gluten", "Seafood", "Eggs", "Soy", "Shellfish", "Peanuts"
  ];

  const dietaryPreferences = [
    "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "Low Carb", "High Protein", "Low Sodium"
  ];

  const healthGoals = [
    "Weight Loss", "Weight Gain", "Muscle Building", "Heart Health", "Blood Sugar Control", 
    "Digestive Health", "Energy Boost", "Better Sleep", "Stress Management"
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <User className="h-12 w-12 mx-auto text-primary mb-2" />
            <h1 className="text-2xl font-bold text-foreground">Personal Health Profile</h1>
            <p className="text-muted-foreground">Welcome, {profile.first_name || user?.email}!</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={profile.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={profile.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight_kg || ''}
                  onChange={(e) => handleInputChange('weight_kg', parseFloat(e.target.value) || null)}
                  placeholder="Enter your weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height_cm || ''}
                  onChange={(e) => handleInputChange('height_cm', parseInt(e.target.value) || null)}
                  placeholder="Enter your height"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={profile.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-of-birth">Date of Birth</Label>
                <Input
                  id="date-of-birth"
                  type="date"
                  value={profile.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity & Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Activity & Goals
            </CardTitle>
            <CardDescription>Your lifestyle and objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={profile.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (Hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extra_active">Extremely Active (Very hard exercise & physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Daily Targets */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calories Target</Label>
                <Input
                  id="calories"
                  type="number"
                  value={profile.daily_calorie_target || ''}
                  onChange={(e) => handleInputChange('daily_calorie_target', parseInt(e.target.value) || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Daily Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={profile.daily_protein_target || ''}
                  onChange={(e) => handleInputChange('daily_protein_target', parseInt(e.target.value) || null)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Goals
            </CardTitle>
            <CardDescription>What do you want to achieve?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Health Goals</Label>
              <div className="flex gap-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a health goal"
                  onKeyPress={(e) => e.key === 'Enter' && addItem(newGoal, 'health_goals')}
                />
                <Button 
                  onClick={() => addItem(newGoal, 'health_goals')}
                  variant="outline"
                  size="sm"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {healthGoals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={profile.health_goals?.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => addItem(goal, 'health_goals')}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
              {profile.health_goals && profile.health_goals.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted/50 rounded-md">
                  {profile.health_goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {goal}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(index, 'health_goals')}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Food Allergies & Intolerances
            </CardTitle>
            <CardDescription>Foods you need to avoid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Allergies</Label>
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add an allergy"
                  onKeyPress={(e) => e.key === 'Enter' && addItem(newAllergy, 'allergies')}
                />
                <Button 
                  onClick={() => addItem(newAllergy, 'allergies')}
                  variant="outline"
                  size="sm"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonAllergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant={profile.allergies?.includes(allergy) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => addItem(allergy, 'allergies')}
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
              {profile.allergies && profile.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted/50 rounded-md">
                  {profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(index, 'allergies')}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dietary Preferences
            </CardTitle>
            <CardDescription>Your preferred eating style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryPreferences.map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference}
                    checked={profile.dietary_preferences?.includes(preference) || false}
                    onCheckedChange={() => toggleDietaryPreference(preference)}
                  />
                  <Label htmlFor={preference} className="text-sm font-medium cursor-pointer">
                    {preference}
                  </Label>
                </div>
              ))}
            </div>
            {profile.dietary_preferences && profile.dietary_preferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 p-2 bg-muted/50 rounded-md">
                {profile.dietary_preferences.map((preference, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {preference}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem(index, 'dietary_preferences')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Your profile helps us provide personalized nutrition recommendations and meal plans.
              </p>
              <div className="flex justify-center">
                <Button disabled={saving} className="w-full md:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Profile Auto-Saved'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};