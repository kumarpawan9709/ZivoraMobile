import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function MobileOnboarding2Screen() {
  const [location, navigate] = useLocation();

  const handleSkip = () => {
    navigate("/get-started");
  };

  const handleNext = () => {
    navigate("/mobile-onboarding-3");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-y-auto" style={{ background: '#1a1a2e' }}>
      {/* Skip Button */}
      <div className="absolute top-12 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-white text-sm opacity-60 hover:opacity-100 bg-black bg-opacity-30 px-3 py-1 rounded-full"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-16 pb-32 min-h-screen">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 className="text-white text-2xl font-bold leading-tight mb-1">
              Migraines can look like
            </h1>
            <h1 className="text-purple-400 text-2xl font-bold">
              other problems.
            </h1>
          </div>

          {/* Face Illustration */}
          <div className="mb-8 flex items-center justify-center">
            <div className="w-80 h-64 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
              {/* Face SVG with migraine symptoms */}
              <svg 
                width="280" 
                height="200" 
                viewBox="0 0 280 200" 
                className="object-contain"
                style={{ maxWidth: '100%', height: 'auto' }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Face outline - more prominent */}
                <ellipse cx="140" cy="100" rx="85" ry="95" fill="#FBBF24" stroke="#D97706" strokeWidth="3"/>
                
                {/* Eyes - larger and more visible */}
                <circle cx="120" cy="80" r="10" fill="#000000"/>
                <circle cx="160" cy="80" r="10" fill="#000000"/>
                
                {/* Nose */}
                <path d="M140 90 L 148 108 L 132 108 Z" fill="#92400E"/>
                
                {/* Mouth - showing discomfort - more visible */}
                <path d="M118 120 Q 140 105 162 120" stroke="#78350F" strokeWidth="4" fill="none"/>
                
                {/* Left side - red pain area - more prominent */}
                <circle cx="85" cy="70" r="30" fill="#DC2626" opacity="0.8"/>
                <text x="60" y="45" fill="#DC2626" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">PAIN</text>
                
                {/* Right side - blue confusion area - more prominent */}
                <circle cx="195" cy="90" r="25" fill="#2563EB" opacity="0.8"/>
                <text x="175" y="130" fill="#2563EB" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">FOG</text>
                
                {/* Top - pressure lines - more visible */}
                <path d="M105 35 Q 140 20 175 35" stroke="#EC4899" strokeWidth="5" fill="none"/>
                <path d="M110 30 Q 140 15 170 30" stroke="#EC4899" strokeWidth="4" fill="none"/>
                
                {/* Bottom - nausea indicator - more prominent */}
                <circle cx="140" cy="165" r="20" fill="#16A34A" opacity="0.8"/>
                <text x="115" y="195" fill="#16A34A" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">NAUSEA</text>
                
                {/* Ear area - tinnitus - more prominent */}
                <circle cx="55" cy="100" r="16" fill="#EAB308"/>
                <circle cx="225" cy="100" r="16" fill="#EAB308"/>
              </svg>
            </div>
          </div>

          {/* Symptoms List */}
          <div className="text-center mb-6">
            <p className="text-purple-400 text-sm font-medium mb-2">
              Tingling, vertigo, sinus issues, jaw pressure, tinnitus, and nausea
            </p>
            <p className="text-white text-sm leading-relaxed px-4">
              can all point to a migraine-prone brain. These signs are often ignored, but your brain may be asking for rest.
            </p>
          </div>

          {/* Symptom Icons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">👂</span>
            </div>
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🌀</span>
            </div>
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🫁</span>
            </div>
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🧠</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-8">
            <p className="text-white text-sm font-medium">
              Learn your Migraine Risk Score
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

      {/* Next Button */}
      <div className="absolute right-6" style={{ bottom: 'max(env(safe-area-inset-bottom, 0px), 2rem)' }}>
        <button
          onClick={handleNext}
          className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
      </div>


    </div>
  );
};