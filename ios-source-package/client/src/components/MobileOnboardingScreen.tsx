import { useLocation } from "wouter";

export default function MobileOnboardingScreen() {
  const [location, navigate] = useLocation();

  const handleSkip = () => {
    navigate("/get-started");
  };

  const handleNext = () => {
    navigate("/mobile-onboarding-2");
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
              Migraine is more than
            </h1>
            <h1 className="text-purple-400 text-2xl font-bold">
              a headache.
            </h1>
          </div>

          {/* Brain Illustration */}
          <div className="mb-8 flex items-center justify-center">
            <div className="w-80 h-64 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
              {/* Brain SVG - minimal version for fast loading */}
              <svg 
                width="280" 
                height="200" 
                viewBox="0 0 280 200" 
                className="object-contain"
                style={{ maxWidth: '100%', height: 'auto' }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Main brain outline */}
                <path d="M140 40 C 90 40, 50 70, 50 110 C 50 130, 55 145, 65 155 C 70 165, 80 170, 95 175 C 110 180, 130 182, 140 182 C 150 182, 170 180, 185 175 C 200 170, 210 165, 215 155 C 225 145, 230 130, 230 110 C 230 70, 190 40, 140 40 Z" 
                      fill="#FF69B4" stroke="#FFFFFF" strokeWidth="3"/>
                
                {/* BRAIN text */}
                <text x="140" y="120" textAnchor="middle" fill="#00FF7F" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">BRAIN</text>
                
                {/* Lightning bolts */}
                <path d="M 110 75 L 125 95 L 118 95 L 130 120" stroke="#FFFF00" strokeWidth="3" fill="none"/>
                <path d="M 170 75 L 155 95 L 162 95 L 150 120" stroke="#FFFF00" strokeWidth="3" fill="none"/>
              </svg>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-gray-900 rounded-xl p-5 w-full max-w-sm mb-6">
            <p className="text-white text-sm leading-relaxed text-center">
              Migraine is a <span className="text-blue-400">brain state</span> that affects your senses, mood, and body —causing symptoms like dizziness, fatigue, nausea, and brain fog.
            </p>
          </div>

          {/* Tip */}
          <div className="flex items-start justify-center mb-8 space-x-2 px-4">
            <div className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0">💡</div>
            <p className="text-white text-sm text-center">
              Many people don't even realize they're having a migraine.
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

      {/* Next Button */}
      <div className="absolute right-6" style={{ bottom: 'max(env(safe-area-inset-bottom, 0px), 2rem)' }}>
        <button
          onClick={handleNext}
          className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
        >
          <span className="text-white text-2xl">→</span>
        </button>
      </div>
    </div>
  );
}