import { useEffect } from "react";
import { useLocation } from "wouter";
import { Brain } from "lucide-react";

export default function SplashScreen() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/mobile-onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden safe-area-container">
      {/* Main Content - Centered vertically and horizontally */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 safe-area-content">
        {/* Zivora Logo Container */}
        <div className="mb-8 flex items-center justify-center animate-fade-in">
          <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-logo">
            <Brain className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-white" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl tracking-wider mb-3 text-center select-none animate-fade-in text-shadow-lg">
          ZIVORA
        </h1>

        {/* Subtitle */}
        <p className="text-blue-200 text-lg sm:text-xl font-medium opacity-90 text-center max-w-sm animate-fade-in">
          Migraine Tracker
        </p>
        
        {/* Additional tagline */}
        <p className="text-purple-200 text-sm sm:text-base opacity-75 text-center max-w-xs mt-2 animate-fade-in">
          Take control of your health
        </p>
      </div>

      {/* Footer */}
      <footer className="pb-8 px-6 animate-fade-in">
        <p className="text-center text-sm text-white opacity-70 leading-relaxed">
          Welcome to your health companion
        </p>
      </footer>

      {/* Loading indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div 
            className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" 
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" 
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </main>
  );
}
