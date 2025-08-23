import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Settings, Heart, Brain, Moon, Activity, CloudRain, Droplets, BarChart3, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import BottomNavigation from './BottomNavigation';

export default function RiskScoreScreen() {
  const [location, navigate] = useLocation();
  
  // Get authenticated user ID from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };
  
  const userId = getUserIdFromToken() || 2;

  // Fetch risk score data using authenticated API
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: [`/api/user/risk-score`],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/risk-score`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch risk score');
      return response.json();
    }
  });

  // Fetch health indicators data
  const { data: healthData } = useQuery({
    queryKey: [`/api/user/health-indicators/${userId}`],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/health-indicators/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch health indicators');
      return response.json();
    }
  });

  // Fetch environmental triggers data
  const { data: triggersData } = useQuery({
    queryKey: [`/api/user/environmental-triggers/${userId}`],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/environmental-triggers/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch environmental triggers');
      return response.json();
    }
  });

  if (riskLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading Risk Score...</p>
        </div>
      </div>
    );
  }

  const riskScore = riskData?.score || 32;
  const riskLevel = riskData?.level || "Low Risk";
  const riskZone = riskData?.message || "Safe Zone";

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1E293B]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Risk Score</h1>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Risk Score Card Section with Purple Gradient */}
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)' }}>
        {/* Risk Score Card */}
        <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-[#11101A] shadow-xl text-white">
          <h2 className="text-center text-sm font-semibold mb-4 tracking-wide">
            Today's Migraine Risk Score
          </h2>

          <div className="w-36 h-36 mx-auto mb-4">
            <CircularProgressbarWithChildren
              value={riskScore}
              strokeWidth={10}
              styles={buildStyles({
                pathColor: "url(#gradient)",
                trailColor: "#2E2E3A",
                strokeLinecap: "round",
              })}
            >
              <svg style={{ height: 0 }}>
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor="#A66CFF" />
                    <stop offset="100%" stopColor="#7F5AF0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <p className="text-3xl font-bold">{riskScore}</p>
                <p className="text-sm text-gray-300">{riskLevel}</p>
              </div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="flex justify-center mb-2">
            <span className="text-xs px-4 py-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md">
              {riskZone}
            </span>
          </div>

          <p className="text-center text-xs text-gray-400">
            Your brain is in a stable state today. Light triggers are manageable.
          </p>
        </div>
      </div>

      {/* Rest of content with normal dark background */}
      <div className="p-4 space-y-6">
        {/* Health Indicators */}
        <div>
          <h3 className="text-white font-semibold mb-4">Health Indicators</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1E293B] rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-lg font-semibold">{healthData?.heartRate?.value || "42ms"}</p>
              <p className="text-gray-400 text-xs">{healthData?.heartRate?.status || "Good"}</p>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-lg font-semibold">{healthData?.stressLevel?.value || "Low"}</p>
              <p className="text-gray-400 text-xs">{healthData?.stressLevel?.status || "Stable"}</p>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-4 text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-lg font-semibold">{healthData?.sleepQuality?.value || "7.2h"}</p>
              <p className="text-gray-400 text-xs">{healthData?.sleepQuality?.status || "Quality"}</p>
            </div>
          </div>
        </div>

        {/* Environmental Triggers */}
        <div>
          <h3 className="text-white font-semibold mb-4">Environmental Triggers</h3>
          <div className="space-y-3">
            {triggersData?.map((trigger: any, index: number) => {
              const getIcon = (name: string) => {
                if (name.toLowerCase().includes('pressure')) return Activity;
                if (name.toLowerCase().includes('weather')) return CloudRain;
                if (name.toLowerCase().includes('humidity')) return Droplets;
                return Activity;
              };
              
              const getIconColor = (status: string) => {
                if (status.toLowerCase() === 'stable') return 'bg-blue-500';
                if (status.toLowerCase() === 'low') return 'bg-orange-500';
                if (status.toLowerCase() === 'normal') return 'bg-teal-500';
                return 'bg-gray-500';
              };

              const getStatusColor = (status: string) => {
                if (status.toLowerCase() === 'stable') return 'text-blue-400';
                if (status.toLowerCase() === 'low') return 'text-green-400';
                if (status.toLowerCase() === 'normal') return 'text-gray-400';
                return 'text-gray-400';
              };

              const Icon = getIcon(trigger.name);

              return (
                <div key={index} className="bg-[#1E293B] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getIconColor(trigger.status)} rounded-full flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{trigger.name}</p>
                      <p className="text-gray-400 text-sm">{trigger.value}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(trigger.status)}`}>{trigger.status}</span>
                </div>
              );
            }) || [
              <div key="loading" className="bg-[#1E293B] rounded-xl p-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Loading environmental data...</span>
              </div>
            ]}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/insights')}
            className="w-full bg-[#1E293B] hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Detailed Insights
          </button>
          
          <button 
            onClick={() => navigate('/daily-log')}
            className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            📊 Log Today's Data
          </button>
          
          <button 
            onClick={() => navigate('/education')}
            className="w-full bg-[#1E293B] hover:bg-[#334155] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Educational Content
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}