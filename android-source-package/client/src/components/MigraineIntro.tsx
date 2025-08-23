import { useLocation } from "wouter";
import { ChevronRight, Lightbulb } from "lucide-react";

export default function MigraineIntro() {
  const [location, navigate] = useLocation();

  const handleSkip = () => {
    navigate("/login");
  };

  const handleNext = () => {
    navigate("/symptom-info");
  };

  return (
    <main className="min-h-screen bg-zivora-dark flex flex-col relative overflow-hidden">
      {/* Skip Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSkip}
          className="text-zivora-gray text-sm hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12 pt-16">
        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-[22px] leading-tight mb-1">
            Migraine is more than
          </h1>
          <h1 className="text-zivora-purple font-bold text-[22px] leading-tight">
            a headache.
          </h1>
        </div>

        {/* Brain Illustration */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Brain SVG Illustration */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Brain main shape */}
              <path
                d="M150 50C120 50 95 75 95 105C95 120 100 134 109 145C105 150 103 156 103 163C103 180 117 194 134 194C140 194 146 192 151 189C156 192 162 194 168 194C185 194 199 180 199 163C199 156 197 150 193 145C202 134 207 120 207 105C207 75 182 50 150 50Z"
                fill="#A25BFF"
                opacity="0.9"
              />
              
              {/* Brain details */}
              <path
                d="M130 80C125 80 121 84 121 89C121 94 125 98 130 98C135 98 139 94 139 89C139 84 135 80 130 80Z"
                fill="#8B5CF6"
              />
              <path
                d="M170 80C165 80 161 84 161 89C161 94 165 98 170 98C175 98 179 94 179 89C179 84 175 80 170 80Z"
                fill="#8B5CF6"
              />
              
              {/* Lightning bolts around brain */}
              <path
                d="M80 120L75 110L85 115L80 105L90 115L85 125Z"
                fill="#FFD700"
              />
              <path
                d="M220 120L215 110L225 115L220 105L230 115L225 125Z"
                fill="#FFD700"
              />
              <path
                d="M150 40L145 30L155 35L150 25L160 35L155 45Z"
                fill="#FFD700"
              />
              
              {/* Eyes around brain */}
              <circle cx="60" cy="160" r="12" fill="#FF6B6B" />
              <circle cx="60" cy="160" r="6" fill="#FFF" />
              <circle cx="240" cy="160" r="12" fill="#FF6B6B" />
              <circle cx="240" cy="160" r="6" fill="#FFF" />
              
              {/* Ears */}
              <ellipse cx="40" cy="140" rx="8" ry="15" fill="#4ECDC4" />
              <ellipse cx="260" cy="140" rx="8" ry="15" fill="#4ECDC4" />
              
              {/* Pain indicators */}
              <circle cx="100" cy="70" r="3" fill="#FF4757" />
              <circle cx="200" cy="70" r="3" fill="#FF4757" />
              <circle cx="120" cy="60" r="2" fill="#FF4757" />
              <circle cx="180" cy="60" r="2" fill="#FF4757" />
            </svg>
          </div>
        </div>

        {/* Info Text Box */}
        <div className="bg-[#1A1A2E] rounded-lg p-4 mt-6 w-full max-w-sm">
          <p className="text-white text-base leading-relaxed text-center">
            Migraine is a brain state that affects your senses, mood, and body — causing symptoms like dizziness, fatigue, nausea, and brain fog.
          </p>
        </div>

        {/* Bottom Tip */}
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <p className="text-zivora-gray text-sm text-center">
            Many people don't even realize they're having a migraine.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-zivora-purple rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Next Button - Floating Action Button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={handleNext}
          className="w-14 h-14 bg-zivora-purple rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </main>
  );
}