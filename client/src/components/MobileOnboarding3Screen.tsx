import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip);

export default function MobileOnboarding3Screen() {
  const [location, navigate] = useLocation();
  const [isChecked, setIsChecked] = useState(false);

  const handleSkip = () => {
    console.log("Skip pressed");
    navigate("/mobile-home");
  };

  const handleCheckboxToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    console.log("Checkbox toggled:", newValue);
  };

  const handleNext = () => {
    if (!isChecked) {
      console.log("Please accept the disclaimer to continue");
      return;
    }
    console.log("Next pressed");
    navigate("/get-started");
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
            Know when your brain is
          </h1>
          <h1 className="text-purple-500 text-2xl font-bold leading-tight">
            vulnerable.
          </h1>
        </div>

        {/* Risk Gauge */}
        <div className="mb-8 flex flex-col items-center">
          {/* Gauge Container */}
          <div className="relative max-w-xs w-48 h-32 mb-4">
            <Doughnut
              data={{
                datasets: [{
                  data: [33.33, 33.33, 33.34], // Equal segments for 0-40, 41-70, 71-100
                  backgroundColor: ['#00D26A', '#F5A623', '#FF4C4C'],
                  borderWidth: 0,
                  borderRadius: 8,
                  circumference: 180, // Semi-circle
                  rotation: 270, // Start from top
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  tooltip: { enabled: false },
                  legend: { display: false }
                },
                elements: {
                  arc: {
                    borderRadius: 8,
                  }
                }
              }}
            />
            
            {/* Center Eye Indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Risk Score Label */}
          <p className="text-white font-bold text-lg mb-4">Risk Score</p>

          {/* Score Range Labels */}
          <div className="flex items-center justify-center space-x-6 text-center">
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 bg-green-500 rounded-full mb-1">
                <p className="text-white text-xs font-semibold">0–40</p>
              </div>
              <p className="text-green-500 text-xs">Safe</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 bg-orange-500 rounded-full mb-1">
                <p className="text-white text-xs font-semibold">41–70</p>
              </div>
              <p className="text-orange-500 text-xs">Caution</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 bg-red-500 rounded-full mb-1">
                <p className="text-white text-xs font-semibold">71–100</p>
              </div>
              <p className="text-red-500 text-xs">Sensitive</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gray-900 rounded-xl p-5 w-full max-w-sm mb-8">
          <p className="text-white text-sm leading-relaxed text-center">
            <span className="text-purple-400 font-semibold">Zivora</span> analyzes your body, sleep, habits, 
            and environment to generate a daily Migraine Risk Score — helping you 
            manage triggers like food, stress, and noise.
          </p>
        </div>

        {/* Checkbox Section - Custom Design */}
        <div className="w-full max-w-sm mb-8">
          <div 
            onClick={handleCheckboxToggle}
            className="flex items-start space-x-3 cursor-pointer group select-none"
          >
            {/* Custom Checkbox */}
            <div 
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 shrink-0 touch-manipulation ${
                isChecked 
                  ? 'bg-purple-500 border-purple-500 scale-110' 
                  : 'bg-transparent border-gray-500 group-hover:border-purple-400'
              }`}
            >
              {isChecked && (
                <Check className="w-3 h-3 text-white stroke-[3]" />
              )}
            </div>
            
            <span className="text-white text-xs leading-relaxed group-hover:text-gray-200 transition-colors">
              I understand Zivora isn't for diagnosis or treatment, but helps interpret migraine patterns after a healthcare provider's diagnosis.
            </span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
      </div>

      {/* Next Button */}
      <div className="absolute right-6" style={{ bottom: 'max(env(safe-area-inset-bottom, 0px), 2rem)' }}>
        <button
          onClick={handleNext}
          disabled={!isChecked}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${
            isChecked 
              ? "bg-purple-500 hover:bg-purple-600 cursor-pointer hover:scale-105 shadow-purple-500/30" 
              : "bg-gray-600 opacity-50 cursor-not-allowed scale-95"
          }`}
        >
          <ArrowRight className={`w-6 h-6 text-white transition-transform duration-200 ${
            isChecked ? 'translate-x-0' : '-translate-x-1'
          }`} />
        </button>
        
        {/* Helper Text */}
        {!isChecked && (
          <div className="absolute -top-12 right-0 bg-gray-800 px-3 py-1 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-300 whitespace-nowrap">
              Accept disclaimer to continue
            </p>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>


    </div>
  );
}