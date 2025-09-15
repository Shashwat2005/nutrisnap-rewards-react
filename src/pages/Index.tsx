import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { WaterTracker } from "@/components/WaterTracker";
import { FoodLogger } from "@/components/FoodLogger";
import { ProgressTracker } from "@/components/ProgressTracker";
import { CameraScanner } from "@/components/CameraScanner";
import { AchievementCenter } from "@/components/AchievementCenter";
import { PersonalProfile } from "@/components/PersonalProfile";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'water':
        return <WaterTracker />;
      case 'meals':
        return <FoodLogger />;
      case 'progress':
        return <ProgressTracker />;
      case 'camera':
        return <CameraScanner />;
      case 'profile':
        return <PersonalProfile />;
      case 'rewards':
        return <AchievementCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveComponent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
