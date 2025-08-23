import { useLocation } from "wouter";

interface TodaysMigraineRiskProps {
  riskScore?: {
    score: number;
    level: string;
    message: string;
  };
}

export default function TodaysMigraineRisk({ riskScore }: TodaysMigraineRiskProps) {
  const [location, navigate] = useLocation();
  
  const score = riskScore?.score || 32;
  const level = riskScore?.level || "Low Risk";
  const message = riskScore?.message || "Your brain is in a stable state today. Light triggers are manageable.";
  
  // Calculate circle progress
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeProgress = (score / 100) * circumference;
  
  // Determine colors based on risk level
  const getRiskColors = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high risk':
        return {
          primary: '#EF4444', // red-500
          secondary: 'rgba(239, 68, 68, 0.2)',
          gradient: 'from-red-500 to-red-600'
        };
      case 'medium risk':
        return {
          primary: '#F59E0B', // yellow-500
          secondary: 'rgba(245, 158, 11, 0.2)',
          gradient: 'from-yellow-500 to-orange-500'
        };
      default: // low risk
        return {
          primary: '#8B5CF6', // purple-500
          secondary: 'rgba(139, 92, 246, 0.2)',
          gradient: 'from-purple-500 to-purple-600'
        };
    }
  };
  
  const colors = getRiskColors(level);
  
  return (
    <div className="mx-6 mt-6 mb-6">
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30">
        <h3 className="text-white text-xl font-semibold mb-6">Today's Migraine Risk</h3>
        
        <div className="flex flex-col items-center">
          {/* Main Risk Circle Container */}
          <div className="relative mb-4">
            {/* Main purple circle - filled */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex flex-col items-center justify-center relative">
              <span className="text-3xl font-bold text-white mb-1">{score}</span>
              <span className="text-sm font-medium text-white">
                {level}
              </span>
            </div>
            
            {/* Safe Zone indicator - overlapping on bottom right */}
            {score <= 40 && (
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gray-700/80 backdrop-blur-sm rounded-full flex flex-col items-center justify-center border-2 border-gray-600/40">
                <span className="text-xs text-gray-300 font-medium leading-tight">Safe</span>
                <span className="text-xs text-gray-300 font-medium leading-tight">Zone</span>
              </div>
            )}
          </div>
          
          {/* Risk description */}
          <p className="text-center text-gray-300 text-sm mb-6 max-w-xs leading-relaxed">
            {message}
          </p>
          
          {/* View Risk Factors button */}
          <button 
            onClick={() => navigate("/risk-score")}
            className={`bg-gradient-to-r ${colors.gradient} hover:shadow-lg hover:shadow-purple-500/25 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 w-full max-w-xs`}
          >
            View Risk Factors
          </button>
        </div>
      </div>
    </div>
  );
}