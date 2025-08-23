import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Bell, Settings, Plus, Calendar, TrendingUp, History, Pill, Home, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from "./BottomNavigation";
import NotificationBadge from "./NotificationBadge";
import TodaysMigraineRisk from "./TodaysMigraineRisk";

export default function DashboardScreen() {
  const [location, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userData && token) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserId(parsedUser.id);
      console.log('Dashboard user ID set to:', parsedUser.id);
    } else {
      navigate("/get-started");
    }
  }, [navigate]);

  // Fetch user profile data
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user/profile', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/profile/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) return { name: "Sarah" }; // Fallback
      return response.json();
    },
    enabled: !!userId
  });

  // Fetch risk score data
  const { data: riskScore } = useQuery({
    queryKey: ['/api/user/risk-score', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/risk-score/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch risk score");
      return response.json();
    },
    enabled: !!userId
  });

  // Fetch recent activity data
  const { data: recentActivity } = useQuery({
    queryKey: ['/api/user/recent-activity', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/recent-activity/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch recent activity");
      return response.json();
    },
    enabled: !!userId
  });

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">


      {/* Header with profile */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {userProfile?.name?.charAt(0) || 'S'}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-medium">Good morning, {userProfile?.name || 'Sarah'}</h1>
            <p className="text-gray-400 text-sm">{getCurrentDate()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBadge userId={userId}>
            <Bell 
              className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors" 
              onClick={() => navigate("/notifications")}
            />
          </NotificationBadge>
          <Settings 
            className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors" 
            onClick={() => navigate("/settings")}
          />
        </div>
      </div>

      {/* Today's Migraine Risk Card */}
      <TodaysMigraineRisk riskScore={riskScore} />

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <h3 className="text-white text-lg font-medium mb-4">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => navigate("/log-symptoms")}
            className="flex-1 bg-gray-800 rounded-2xl p-4 flex flex-col items-center space-y-2 hover:bg-gray-700 transition-colors"
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-medium">Log Symptoms</span>
            <span className="text-gray-400 text-xs">Quick entry</span>
          </button>
          <button 
            onClick={() => navigate("/add-food")}
            className="flex-1 bg-gray-800 rounded-2xl p-4 flex flex-col items-center space-y-2 hover:bg-gray-700 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-white text-lg">🍽</span>
            </div>
            <span className="text-white font-medium">Add Food</span>
            <span className="text-gray-400 text-xs">Track intake</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mb-6">
        <h3 className="text-white text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.slice(0, 3).map((activity: any, index: number) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.description}</p>
                  <p className="text-gray-400 text-sm">{activity.type === 'Food' ? 'Dietary tracking' : activity.type === 'Sleep' ? 'Sleep monitoring' : 'Symptoms tracking'}</p>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))
          ) : (
            <>
              <div className="bg-gray-800 rounded-xl p-4 flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🍗</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Logged lunch</p>
                  <p className="text-gray-400 text-sm">Dietary tracking</p>
                </div>
                <span className="text-gray-400 text-sm">12:30</span>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">🛌</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Sleep data synced</p>
                  <p className="text-gray-400 text-sm">Sleep monitoring</p>
                </div>
                <span className="text-gray-400 text-sm">6:45</span>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">😣</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Mild headache</p>
                  <p className="text-gray-400 text-sm">Symptoms tracking</p>
                </div>
                <span className="text-gray-400 text-sm">14:15</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* My Space */}
      <div className="px-6 mb-24">
        <h3 className="text-white text-lg font-medium mb-4">My Space</h3>
        <div className="space-y-3">
          <button 
            onClick={() => navigate("/daily-log")}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Daily Log</p>
              <p className="text-gray-400 text-sm">Track daily triggers</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button 
            onClick={() => navigate("/insights")}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Insights</p>
              <p className="text-gray-400 text-sm">Predictions and patterns</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button 
            onClick={() => navigate("/history")}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <History className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">History & Trends</p>
              <p className="text-gray-400 text-sm">Past data & improvements</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button 
            onClick={() => navigate("/medications")}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Medications</p>
              <p className="text-gray-400 text-sm">Manage & track doses</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          
          <button 
            onClick={() => navigate("/settings")}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Settings</p>
              <p className="text-gray-400 text-sm">Account & preferences</p>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}