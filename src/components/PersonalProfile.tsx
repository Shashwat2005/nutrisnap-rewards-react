import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Heart, AlertTriangle, Target, Activity, X, LogOut, Loader2, Camera, Upload, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const PersonalProfile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, saving, updateProfile } = useProfile();
  const { toast } = useToast();
  const [newAllergy, setNewAllergy] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar first
      await supabase.storage.from('avatars').remove([fileName]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      // Update profile with new avatar URL
      await updateProfile({ avatar_url: data.publicUrl });
      
      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
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
    <div className="min-h-screen bg-gradient-subtle p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Avatar */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
          <Card className="relative bg-card/80 backdrop-blur-sm border-0 shadow-elegant rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-glow ring-2 ring-primary/10">
                    <AvatarImage 
                      src={profile?.avatar_url || undefined} 
                      alt="Profile picture"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                      {profile?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    {uploadingAvatar ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      Personal Health Profile
                    </h1>
                  </div>
                  <p className="text-xl text-muted-foreground">
                    Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'there'}! 👋
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Customize your health journey and achieve your wellness goals
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Basic Information */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/10 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-[0.02]"></div>
          <CardHeader className="relative bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="h-5 w-5 text-primary" />
              </div>
              Basic Information
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">Tell us about yourself to personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="first-name" className="text-sm font-semibold text-foreground">First Name</Label>
                <Input
                  id="first-name"
                  value={profile.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-background/50 border-muted-foreground/20 focus:border-primary/50 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="last-name" className="text-sm font-semibold text-foreground">Last Name</Label>
                <Input
                  id="last-name"
                  value={profile.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter your last name"
                  className="bg-background/50 border-muted-foreground/20 focus:border-primary/50 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="weight" className="text-sm font-semibold text-foreground">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight_kg || ''}
                  onChange={(e) => handleInputChange('weight_kg', parseFloat(e.target.value) || null)}
                  placeholder="Enter your weight"
                  className="bg-background/50 border-muted-foreground/20 focus:border-primary/50 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="height" className="text-sm font-semibold text-foreground">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height_cm || ''}
                  onChange={(e) => handleInputChange('height_cm', parseInt(e.target.value) || null)}
                  placeholder="Enter your height"
                  className="bg-background/50 border-muted-foreground/20 focus:border-primary/50 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="gender" className="text-sm font-semibold text-foreground">Gender</Label>
                <Select value={profile.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="bg-background/50 border-muted-foreground/20 focus:border-primary/50 rounded-xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-muted-foreground/20 rounded-xl">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="date-of-birth" className="text-sm font-semibold text-foreground">Date of Birth</Label>
                <Input
                  id="date-of-birth"
                  type="date"
                  value={profile.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="bg-background/50 border-muted-foreground/20 focus:border-primary/50 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity & Goals */}
        <Card className="bg-card/60 backdrop-blur-sm border-secondary/20 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
          <CardHeader className="relative bg-gradient-to-r from-secondary/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-secondary/15 rounded-xl">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              Activity & Goals
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">Your lifestyle and objectives</CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="activity" className="text-sm font-semibold text-foreground">Activity Level</Label>
              <Select value={profile.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                <SelectTrigger className="bg-background/50 border-muted-foreground/20 focus:border-secondary/50 rounded-xl">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent className="bg-background border-muted-foreground/20 rounded-xl">
                  <SelectItem value="sedentary">🪑 Sedentary (Little to no exercise)</SelectItem>
                  <SelectItem value="lightly_active">🚶 Lightly Active (Light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderately_active">🏃 Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very_active">💪 Very Active (Hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extra_active">🏋️ Extremely Active (Very hard exercise & physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Daily Targets */}
            <div className="bg-gradient-to-r from-nutrition-calories/10 to-nutrition-protein/10 p-4 rounded-2xl border border-muted-foreground/10">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-secondary" />
                Daily Nutrition Targets
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="calories" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    🔥 Daily Calories Target
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    value={profile.daily_calorie_target || ''}
                    onChange={(e) => handleInputChange('daily_calorie_target', parseInt(e.target.value) || null)}
                    className="bg-background/70 border-nutrition-calories/30 focus:border-nutrition-calories rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="protein" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    🥩 Daily Protein (g)
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    value={profile.daily_protein_target || ''}
                    onChange={(e) => handleInputChange('daily_protein_target', parseInt(e.target.value) || null)}
                    className="bg-background/70 border-nutrition-protein/30 focus:border-nutrition-protein rounded-xl"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card className="bg-card/60 backdrop-blur-sm border-accent/20 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
          <CardHeader className="relative bg-gradient-to-r from-accent/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-accent/15 rounded-xl">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              Health Goals
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">What do you want to achieve on your wellness journey?</CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">Health Goals</Label>
              <div className="flex gap-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a custom health goal..."
                  onKeyPress={(e) => e.key === 'Enter' && addItem(newGoal, 'health_goals')}
                  className="bg-background/50 border-muted-foreground/20 focus:border-accent/50 rounded-xl"
                />
                <Button 
                  onClick={() => addItem(newGoal, 'health_goals')}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-accent/30 hover:bg-accent/10"
                >
                  <Target className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {healthGoals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={profile.health_goals?.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-2 rounded-xl text-sm hover:scale-105 transition-all duration-200 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40"
                    onClick={() => addItem(goal, 'health_goals')}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
              {profile.health_goals && profile.health_goals.length > 0 && (
                <div className="bg-gradient-to-r from-accent/5 to-transparent p-4 rounded-2xl border border-accent/10">
                  <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Your Active Goals
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {profile.health_goals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border-accent/20 hover:bg-accent/15">
                        {goal}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                          onClick={() => removeItem(index, 'health_goals')}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card className="bg-card/60 backdrop-blur-sm border-destructive/20 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"></div>
          <CardHeader className="relative bg-gradient-to-r from-destructive/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              Food Allergies & Intolerances
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">Foods you need to avoid for your safety</CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">Food Allergies & Intolerances</Label>
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add a food allergy or intolerance..."
                  onKeyPress={(e) => e.key === 'Enter' && addItem(newAllergy, 'allergies')}
                  className="bg-background/50 border-muted-foreground/20 focus:border-destructive/50 rounded-xl"
                />
                <Button 
                  onClick={() => addItem(newAllergy, 'allergies')}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-destructive/30 hover:bg-destructive/10"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {commonAllergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant={profile.allergies?.includes(allergy) ? "destructive" : "outline"}
                    className="cursor-pointer px-3 py-2 rounded-xl text-sm hover:scale-105 transition-all duration-200 bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20 hover:border-destructive/40"
                    onClick={() => addItem(allergy, 'allergies')}
                  >
                    ⚠️ {allergy}
                  </Badge>
                ))}
              </div>
              {profile.allergies && profile.allergies.length > 0 && (
                <div className="bg-gradient-to-r from-destructive/5 to-transparent p-4 rounded-2xl border border-destructive/10">
                  <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Your Active Allergies
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 border-destructive/20 hover:bg-destructive/15">
                        ⚠️ {allergy}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-white transition-colors" 
                          onClick={() => removeItem(index, 'allergies')}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card className="bg-card/60 backdrop-blur-sm border-nutrition-water/20 shadow-elegant rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-nutrition-water/5 to-transparent"></div>
          <CardHeader className="relative bg-gradient-to-r from-nutrition-water/5 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-nutrition-water/15 rounded-xl">
                <Activity className="h-5 w-5 text-nutrition-water" />
              </div>
              Dietary Preferences
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">Your preferred eating style and approach</CardDescription>
          </CardHeader>
          <CardContent className="relative p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dietaryPreferences.map((preference) => (
                <div key={preference} className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-nutrition-water/5 to-transparent border border-nutrition-water/10 hover:border-nutrition-water/20 transition-all duration-200">
                  <Checkbox
                    id={preference}
                    checked={profile.dietary_preferences?.includes(preference) || false}
                    onCheckedChange={() => toggleDietaryPreference(preference)}
                    className="data-[state=checked]:bg-nutrition-water data-[state=checked]:border-nutrition-water"
                  />
                  <Label htmlFor={preference} className="text-sm font-medium cursor-pointer text-foreground">
                    {preference}
                  </Label>
                </div>
              ))}
            </div>
            {profile.dietary_preferences && profile.dietary_preferences.length > 0 && (
              <div className="bg-gradient-to-r from-nutrition-water/5 to-transparent p-4 rounded-2xl border border-nutrition-water/10 mt-6">
                <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-nutrition-water" />
                  Your Dietary Style
                </h5>
                <div className="flex flex-wrap gap-2">
                  {profile.dietary_preferences.map((preference, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nutrition-water/10 border-nutrition-water/20 hover:bg-nutrition-water/15">
                      🥗 {preference}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                        onClick={() => removeItem(index, 'dietary_preferences')}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Status */}
        <Card className="bg-gradient-primary/5 border-primary/20 shadow-glow rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          <CardContent className="relative p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                  Profile Status
                </h3>
              </div>
              <p className="text-sm text-muted-foreground/80">
                Your profile automatically saves as you make changes. This helps us provide personalized nutrition recommendations and meal plans tailored just for you! 🌟
              </p>
              <div className="flex justify-center">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="font-medium text-primary">Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="font-medium text-primary">Profile synced & ready!</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};