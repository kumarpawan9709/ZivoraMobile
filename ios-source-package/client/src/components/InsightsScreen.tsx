import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Activity, Bed, Eye, Clock, Ban, Moon, Monitor } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import BottomNavigation from './BottomNavigation';
import heartPulseIcon from '@assets/image_1750515064439.png';
import bedIcon from '@assets/Bed_1750515050979.png';

interface TriggerRisk {
  trigger: string;
  percentage: number;
  note: string;
}

interface AnalysisConfidence {
  confidencePercent: number;
  daysTracked: number;
}

interface StressSleepData {
  stressLevel: string;
  avgSleepHours: number;
  insightNote: string;
}

interface RiskPrediction {
  title: string;
  risk: string;
  percentage: number;
  note: string;
}

interface Recommendation {
  title: string;
  note: string;
}

export default function InsightsScreen() {
  const [location, navigate] = useLocation();

  // Get current user ID from localStorage token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (error) {
        console.error("Error parsing token:", error);
        return null;
      }
    }
    return null;
  };

  const userId = getCurrentUserId();

  // API Queries
  const { data: analysisConfidence, isLoading: isLoadingConfidence } = useQuery<AnalysisConfidence>({
    queryKey: ['analysis-confidence', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/analysis-confidence/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch analysis confidence");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: triggerRisks, isLoading: isLoadingTriggers } = useQuery<TriggerRisk[]>({
    queryKey: ['triggers', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/triggers/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch triggers");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: stressSleepData, isLoading: isLoadingStressSleep } = useQuery<StressSleepData>({
    queryKey: ['stress-sleep', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/stress-sleep/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch stress sleep data");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: riskPredictions, isLoading: isLoadingPredictions } = useQuery<RiskPrediction[]>({
    queryKey: ['risk-predictions', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/risk-prediction/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch risk predictions");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<Recommendation[]>({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/recommendations/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      return response.json();
    },
    enabled: !!userId,
  });

  // Helper function to get color classes based on percentage
  const getColorClassesByPercentage = (percentage: number) => {
    if (percentage >= 70) {
      return { dot: 'bg-red-500', bar: 'bg-red-500' };
    } else if (percentage >= 60) {
      return { dot: 'bg-orange-500', bar: 'bg-orange-500' };
    } else if (percentage >= 50) {
      return { dot: 'bg-yellow-500', bar: 'bg-yellow-500' };
    } else {
      return { dot: 'bg-blue-500', bar: 'bg-blue-500' };
    }
  };

  // Helper function to get risk badge classes
  const getRiskBadgeClasses = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Helper function to get progress bar color by risk
  const getProgressBarColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          dot: 'bg-red-500',
          bar: 'bg-red-500'
        };
      case 'orange':
        return {
          dot: 'bg-orange-500',
          bar: 'bg-orange-500'
        };
      case 'yellow':
        return {
          dot: 'bg-yellow-500',
          bar: 'bg-yellow-500'
        };
      case 'blue':
        return {
          dot: 'bg-blue-500',
          bar: 'bg-blue-500'
        };
      case 'green':
        return {
          dot: 'bg-green-500',
          bar: 'bg-green-500'
        };
      default:
        return {
          dot: 'bg-gray-500',
          bar: 'bg-gray-500'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">
          Insights & Predictions
        </h1>
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Your Migraine Insights Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Your Migraine Insights</h2>
          <p className="text-gray-400 text-sm mb-4">Machine learning analysis based on your data patterns</p>
          
          {/* Analysis Confidence Card */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-300 text-sm">Analysis Confidence</span>
            </div>
            <div className="text-center">
              {isLoadingConfidence ? (
                <div className="text-4xl font-bold text-gray-400 mb-1">--</div>
              ) : (
                <div className="text-4xl font-bold text-white mb-1">{analysisConfidence?.confidencePercent || 50}%</div>
              )}
              <div className="text-gray-400 text-sm">
                Based on {analysisConfidence?.daysTracked || 0} days of data
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Trigger Risks */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Personalized Trigger Risks</h3>
          <div className="space-y-3">
            {isLoadingTriggers ? (
              <div className="text-gray-400 text-center py-4">Loading trigger analysis...</div>
            ) : (
              triggerRisks?.map((trigger, index) => {
                const colors = getColorClassesByPercentage(trigger.percentage);
                return (
                  <div key={index} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                        <span className="text-white font-medium">{trigger.trigger}</span>
                      </div>
                      <span className="text-white font-semibold">{trigger.percentage}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors.bar}`}
                          style={{ width: `${trigger.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-xs">{trigger.note}</p>
                  </div>
                );
              }) || []
            )}
          </div>
        </div>

        {/* Stress & Sleep Patterns */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stress & Sleep Patterns</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src={heartPulseIcon} 
                  alt="Heart Pulse Icon" 
                  className="w-7 h-7"
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(47%) sepia(77%) saturate(4934%) hue-rotate(267deg) brightness(101%) contrast(101%)'
                  }}
                />
              </div>
              <div className="text-center">
                {isLoadingStressSleep ? (
                  <span className="text-gray-400 font-medium text-base">--</span>
                ) : (
                  <span className="text-white font-medium text-base">{stressSleepData?.stressLevel || "Medium"}</span>
                )}
                <p className="text-gray-400 text-xs mt-1">Stress Impact</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src={bedIcon} 
                  alt="Bed Icon" 
                  className="w-7 h-7"
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(47%) sepia(77%) saturate(2934%) hue-rotate(207deg) brightness(101%) contrast(101%)'
                  }}
                />
              </div>
              <div className="text-center">
                {isLoadingStressSleep ? (
                  <span className="text-gray-400 font-medium text-base">--</span>
                ) : (
                  <span className="text-white font-medium text-base">{stressSleepData?.avgSleepHours || 7.0}hrs</span>
                )}
                <p className="text-gray-400 text-xs mt-1">Avg Sleep</p>
              </div>
            </div>
          </div>
          
          {/* Key Insight */}
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mt-5">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-black text-xs font-bold">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2 text-base">Key Insight</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stressSleepData?.insightNote || "Your migraine risk increases by 43% when you get less than 7 hours of sleep combined with high stress days."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Predictions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-5">Risk Predictions</h3>
          <div className="space-y-3">
            {isLoadingPredictions ? (
              <div className="text-gray-400 text-center py-4">Loading predictions...</div>
            ) : (
              riskPredictions?.map((prediction, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium text-base">{prediction.title}</span>
                    <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${getRiskBadgeClasses(prediction.risk)}`}>
                      {prediction.risk} Risk
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressBarColor(prediction.risk)}`}
                        style={{ width: `${prediction.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm">{prediction.note}</p>
                </div>
              )) || []
            )}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-5">Personalized Recommendations</h3>
          <div className="space-y-3">
            {isLoadingRecommendations ? (
              <div className="text-gray-400 text-center py-4">Loading recommendations...</div>
            ) : (
              recommendations?.map((recommendation, index) => {
                // Get icon based on recommendation type
                const getRecommendationIcon = (title: string) => {
                  if (title.toLowerCase().includes('chocolate') || title.toLowerCase().includes('avoid')) {
                    return <Ban className="w-4 h-4 text-white" />;
                  } else if (title.toLowerCase().includes('sleep')) {
                    return <Clock className="w-4 h-4 text-white" />;
                  } else if (title.toLowerCase().includes('screen')) {
                    return <Monitor className="w-4 h-4 text-white" />;
                  } else {
                    return <Activity className="w-4 h-4 text-white" />;
                  }
                };

                // Get background color based on recommendation type
                const getRecommendationColor = (title: string) => {
                  if (title.toLowerCase().includes('chocolate') || title.toLowerCase().includes('avoid')) {
                    return 'bg-red-600';
                  } else if (title.toLowerCase().includes('sleep')) {
                    return 'bg-green-600';
                  } else if (title.toLowerCase().includes('screen')) {
                    return 'bg-orange-600';
                  } else {
                    return 'bg-blue-600';
                  }
                };

                return (
                  <div key={index} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 ${getRecommendationColor(recommendation.title)} rounded-full flex-shrink-0 mt-0.5`}>
                        {getRecommendationIcon(recommendation.title)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2 text-base">{recommendation.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{recommendation.note}</p>
                      </div>
                    </div>
                  </div>
                );
              }) || []
            )}
          </div>
          
          <button 
            onClick={() => navigate('/analysis-report')}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl mt-8 transition-all duration-200 text-base"
          >
            View Analysis
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}