import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { WaterTracker } from "@/components/WaterTracker";
import { RecipeList } from "@/components/RecipeList";
import { CameraScanner } from "@/components/CameraScanner";
import { RewardsSection } from "@/components/RewardsSection";
import { PersonalProfile } from "@/components/PersonalProfile";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'water':
        return <WaterTracker />;
      case 'meals':
        return <RecipeList />;
      case 'camera':
        return <CameraScanner />;
      case 'profile':
        return <PersonalProfile />;
      case 'rewards':
        return <RewardsSection />;
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
