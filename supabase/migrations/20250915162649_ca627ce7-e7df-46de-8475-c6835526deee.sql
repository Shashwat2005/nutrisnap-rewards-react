-- Create foods database for nutrition information
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  serving_size TEXT,
  calories_per_100g NUMERIC NOT NULL,
  protein_per_100g NUMERIC DEFAULT 0,
  carbs_per_100g NUMERIC DEFAULT 0,
  fat_per_100g NUMERIC DEFAULT 0,
  fiber_per_100g NUMERIC DEFAULT 0,
  sugar_per_100g NUMERIC DEFAULT 0,
  sodium_per_100g NUMERIC DEFAULT 0,
  barcode TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create meals table for food logging
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_calories NUMERIC DEFAULT 0,
  total_protein NUMERIC DEFAULT 0,
  total_carbs NUMERIC DEFAULT 0,
  total_fat NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_items for individual food items in meals
CREATE TABLE public.meal_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.foods(id),
  quantity_grams NUMERIC NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fat NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_progress table for tracking metrics
CREATE TABLE public.daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories_consumed NUMERIC DEFAULT 0,
  protein_consumed NUMERIC DEFAULT 0,
  carbs_consumed NUMERIC DEFAULT 0,
  fat_consumed NUMERIC DEFAULT 0,
  water_consumed NUMERIC DEFAULT 0,
  current_weight_kg NUMERIC,
  steps_taken INTEGER DEFAULT 0,
  exercise_minutes INTEGER DEFAULT 0,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  sleep_hours NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create streaks table for tracking consistency
CREATE TABLE public.streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('calorie_goal', 'water_goal', 'protein_goal', 'daily_logging', 'exercise_goal')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  milestone_value NUMERIC
);

-- Enable RLS on all tables
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for foods (public read, authenticated write)
CREATE POLICY "Anyone can view foods" ON public.foods FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add foods" ON public.foods FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own foods" ON public.foods FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for meals
CREATE POLICY "Users can view their own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for meal_items
CREATE POLICY "Users can view their meal items" ON public.meal_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can create meal items for their meals" ON public.meal_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can update their meal items" ON public.meal_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can delete their meal items" ON public.meal_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);

-- RLS Policies for daily_progress
CREATE POLICY "Users can view their own progress" ON public.daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON public.daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.daily_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON public.daily_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for streaks
CREATE POLICY "Users can view their own streaks" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own streaks" ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own streaks" ON public.streaks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_progress_updated_at
  BEFORE UPDATE ON public.daily_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some common foods for the database
INSERT INTO public.foods (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, verified) VALUES
('Apple', 52, 0.3, 14, 0.2, true),
('Banana', 89, 1.1, 23, 0.3, true),
('Chicken Breast (cooked)', 165, 31, 0, 3.6, true),
('Brown Rice (cooked)', 123, 2.6, 23, 0.9, true),
('Broccoli', 34, 2.8, 7, 0.4, true),
('Salmon (cooked)', 206, 22, 0, 12, true),
('Eggs (whole)', 155, 13, 1.1, 11, true),
('Oats', 389, 16.9, 66, 6.9, true),
('Greek Yogurt', 59, 10, 3.6, 0.4, true),
('Avocado', 160, 2, 9, 15, true);