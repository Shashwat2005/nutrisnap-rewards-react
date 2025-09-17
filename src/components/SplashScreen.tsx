import { useEffect } from "react";
import nutriSnapLogo from "@/assets/nutrisnap-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary-glow to-accent animate-fade-in">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="animate-scale-in">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* Outer ring animation */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
              
              {/* NutriSnap Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={nutriSnapLogo} 
                  alt="NutriSnap Logo"
                  className="w-16 h-16 animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 
            className="text-4xl font-bold text-white animate-fade-in"
            style={{ animationDelay: '1s' }}
          >
            NutriSnap
          </h1>
          <p 
            className="text-lg text-white/80 animate-fade-in"
            style={{ animationDelay: '1.5s' }}
          >
            Your Personal Nutrition Companion
          </p>
        </div>

        {/* Loading dots */}
        <div 
          className="flex justify-center space-x-2 animate-fade-in"
          style={{ animationDelay: '2s' }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div 
            className="w-2 h-2 bg-white rounded-full animate-pulse" 
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div 
            className="w-2 h-2 bg-white rounded-full animate-pulse" 
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default SplashScreen;