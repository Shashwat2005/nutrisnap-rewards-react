import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { User, Heart, AlertTriangle, Target, Activity, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
  goal: string;
  diseases: string[];
  allergies: string[];
  dietaryPreferences: string[];
  medications: string;
}

export const PersonalProfile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
    diseases: [],
    allergies: [],
    dietaryPreferences: [],
    medications: "",
  });

  const [newDisease, setNewDisease] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  const commonDiseases = [
    "Diabetes Type 1", "Diabetes Type 2", "Hypertension", "Heart Disease",
    "Kidney Disease", "Liver Disease", "Thyroid Disorder", "PCOS", "Arthritis"
  ];

  const commonAllergies = [
    "Nuts", "Dairy", "Gluten", "Seafood", "Eggs", "Soy", "Shellfish", "Peanuts"
  ];

  const dietaryPreferences = [
    "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "Low Carb", "High Protein", "Low Sodium"
  ];

  const addItem = (item: string, field: 'diseases' | 'allergies') => {
    if (!item.trim()) return;
    
    setProfileData(prev => ({
      ...prev,
      [field]: [...prev[field], item.trim()]
    }));
    
    if (field === 'diseases') setNewDisease("");
    if (field === 'allergies') setNewAllergy("");
  };

  const removeItem = (index: number, field: 'diseases' | 'allergies' | 'dietaryPreferences') => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleDietaryPreference = (preference: string) => {
    setProfileData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handleSave = () => {
    // For now, just show a toast - API integration will come later
    toast({
      title: "Profile Saved!",
      description: "Your health profile has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <User className="h-12 w-12 mx-auto text-primary mb-2" />
          <h1 className="text-2xl font-bold text-foreground">Personal Health Profile</h1>
          <p className="text-muted-foreground">Help us personalize your nutrition journey</p>
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter your age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter your weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profileData.height}
                  onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter your height"
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
              <Select value={profileData.activityLevel} onValueChange={(value) => 
                setProfileData(prev => ({ ...prev, activityLevel: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                  <SelectItem value="light">Lightly Active (Light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very">Very Active (Hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extremely">Extremely Active (Very hard exercise & physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Primary Goal</Label>
              <Select value={profileData.goal} onValueChange={(value) => 
                setProfileData(prev => ({ ...prev, goal: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                  <SelectItem value="muscle">Build Muscle</SelectItem>
                  <SelectItem value="health">Improve Overall Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Health Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Conditions
            </CardTitle>
            <CardDescription>Help us understand your medical history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Diseases/Conditions</Label>
              <div className="flex gap-2">
                <Input
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  placeholder="Add a health condition"
                  onKeyPress={(e) => e.key === 'Enter' && addItem(newDisease, 'diseases')}
                />
                <Button 
                  onClick={() => addItem(newDisease, 'diseases')}
                  variant="outline"
                  size="sm"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonDiseases.map((disease) => (
                  <Badge
                    key={disease}
                    variant={profileData.diseases.includes(disease) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => addItem(disease, 'diseases')}
                  >
                    {disease}
                  </Badge>
                ))}
              </div>
              {profileData.diseases.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted/50 rounded-md">
                  {profileData.diseases.map((disease, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {disease}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem(index, 'diseases')}
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
                    variant={profileData.allergies.includes(allergy) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => addItem(allergy, 'allergies')}
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
              {profileData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted/50 rounded-md">
                  {profileData.allergies.map((allergy, index) => (
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
                    checked={profileData.dietaryPreferences.includes(preference)}
                    onCheckedChange={() => toggleDietaryPreference(preference)}
                  />
                  <Label htmlFor={preference} className="text-sm font-medium cursor-pointer">
                    {preference}
                  </Label>
                </div>
              ))}
            </div>
            {profileData.dietaryPreferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 p-2 bg-muted/50 rounded-md">
                {profileData.dietaryPreferences.map((preference, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {preference}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem(index, 'dietaryPreferences')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>List any medications you're currently taking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="medications">Medications</Label>
              <Textarea
                id="medications"
                value={profileData.medications}
                onChange={(e) => setProfileData(prev => ({ ...prev, medications: e.target.value }))}
                placeholder="List your current medications, supplements, or vitamins..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Your profile helps us provide personalized nutrition recommendations and meal plans.
              </p>
              <Button onClick={handleSave} className="w-full md:w-auto">
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};