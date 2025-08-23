import { useEffect } from "react";
import { useLocation } from "wouter";
import { Brain } from "lucide-react";

export default function MobileSplashScreen() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Hide Capacitor splash screen immediately if present
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      import('@capacitor/splash-screen').then(({ SplashScreen }) => {
        SplashScreen.hide();
      }).catch(() => {
        // Capacitor not available, continue normally
      });
    }

    const timer = setTimeout(() => {
      navigate("/mobile-onboarding");
    }, 1500); // Reduced from 2000ms

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>


      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Zivora Logo */}
        <div className="mb-8">
          <img
            src="/img/zivora-logo-icon.png"
            alt="Zivora Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* App Name */}
        <h1 className="text-purple-500 font-bold text-4xl tracking-wider mb-4">
          ZIVORA
        </h1>
      </div>

      {/* Bottom Text */}
      <div className="pb-8">
        <p className="text-white text-sm text-center opacity-60">
          Welcome to <span className="text-purple-500">Zivora</span> mobile app
        </p>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  );
}
