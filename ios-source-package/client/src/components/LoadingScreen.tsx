import { useEffect, useState } from "react";
import ZivoraLogo from "./ZivoraLogo";

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number; // Minimum time to show splash
}

export default function LoadingScreen({ onComplete, minDuration = 1000 }: LoadingScreenProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    // Simulate loading time and ensure minimum duration
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      
      setTimeout(() => {
        setIsReady(true);
        onComplete();
      }, remaining);
    }, 100);

    return () => clearTimeout(timer);
  }, [onComplete, minDuration]);

  return (
    <div className="fixed inset-0 z-50 min-h-screen flex flex-col items-center justify-center px-6 relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Zivora Logo */}
        <div className="mb-8 animate-pulse">
          <ZivoraLogo className="w-24 h-24" />
        </div>

        {/* App Name */}
        <h1 className="text-purple-400 font-bold text-4xl tracking-wider mb-4 animate-fade-in">
          ZIVORA
        </h1>

        {/* Loading indicator */}
        <div className="flex space-x-2 mt-8">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="pb-8">
        <p className="text-white text-sm text-center opacity-60">
          Loading your health companion...
        </p>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  );
}