import { useEffect } from "react";

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
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  className="text-white animate-pulse"
                >
                  {/* Camera lens outer ring */}
                  <circle
                    cx="32"
                    cy="32"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="animate-fade-in"
                    style={{ animationDelay: '0.5s' }}
                  />
                  
                  {/* Camera lens inner ring */}
                  <circle
                    cx="32"
                    cy="32"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="rgba(255,255,255,0.1)"
                    className="animate-scale-in"
                    style={{ animationDelay: '0.8s' }}
                  />
                  
                  {/* Aperture blades forming camera shutter */}
                  <path
                    d="M32 24L36 28L32 32L28 28Z"
                    fill="currentColor"
                    className="animate-fade-in"
                    style={{ animationDelay: '1s' }}
                  />
                  <path
                    d="M40 32L36 36L32 32L36 28Z"
                    fill="rgba(255,255,255,0.7)"
                    className="animate-fade-in"
                    style={{ animationDelay: '1.2s' }}
                  />
                  <path
                    d="M32 40L28 36L32 32L36 36Z"
                    fill="rgba(255,255,255,0.7)"
                    className="animate-fade-in"
                    style={{ animationDelay: '1.4s' }}
                  />
                  <path
                    d="M24 32L28 28L32 32L28 36Z"
                    fill="rgba(255,255,255,0.7)"
                    className="animate-fade-in"
                    style={{ animationDelay: '1.6s' }}
                  />
                  
                  {/* Nutrition leaf elements around the lens */}
                  <path
                    d="M20 16C18 14 16 16 18 18C20 20 22 18 20 16Z"
                    fill="rgba(255,255,255,0.6)"
                    className="animate-fade-in"
                    style={{ animationDelay: '1.8s' }}
                  />
                  <path
                    d="M48 20C46 18 44 20 46 22C48 24 50 22 48 20Z"
                    fill="rgba(255,255,255,0.6)"
                    className="animate-fade-in"
                    style={{ animationDelay: '2s' }}
                  />
                  <path
                    d="M16 44C14 42 12 44 14 46C16 48 18 46 16 44Z"
                    fill="rgba(255,255,255,0.6)"
                    className="animate-fade-in"
                    style={{ animationDelay: '2.2s' }}
                  />
                  
                  {/* Center focus dot */}
                  <circle
                    cx="32"
                    cy="32"
                    r="2"
                    fill="white"
                    className="animate-scale-in"
                    style={{ animationDelay: '2.4s' }}
                  />
                </svg>
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