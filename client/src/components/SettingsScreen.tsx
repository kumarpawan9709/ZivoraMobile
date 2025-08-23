import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Bell,
  Settings,
  ChevronRight,
  Home,
  Calendar,
  BarChart3,
  MessageCircle,
  User,
  Shield,
  Download,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserSettings {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  devices: {
    appleHealth: boolean;
    fitbit: boolean;
    sleepNumber: boolean;
    ouraRing: boolean;
  };
  notifications: {
    highRiskDay: boolean;
    dailyLog: boolean;
    educational: boolean;
    weather: boolean;
    times: {
      morning: string;
      evening: string;
      dailyLog: string;
    };
  };
}

export default function SettingsScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [localNotifications, setLocalNotifications] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userData && token) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserId(parsedUser.id);
    } else {
      navigate("/get-started");
    }
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/user/settings"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      return response.json();
    },
    enabled: !!userId,
  }) as { data: UserSettings | undefined; isLoading: boolean; error: any };

  // Update local notifications when settings data changes
  useEffect(() => {
    if (settings?.notifications && !localNotifications) {
      setLocalNotifications(settings.notifications);
    }
  }, [settings, localNotifications]);

  const deviceMutation = useMutation({
    mutationFn: async ({
      device,
      connected,
    }: {
      device: string;
      connected: boolean;
    }) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ device, connected }),
      });

      if (!response.ok) {
        throw new Error("Failed to update device");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
    },
  });

  const notificationMutation = useMutation({
    mutationFn: async (notifications: any) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notifications),
      });

      if (!response.ok) {
        throw new Error("Failed to update notifications");
      }

      return response.json();
    },
    onMutate: async (newNotifications) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/user/settings"] });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData(["/api/user/settings"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["/api/user/settings"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: newNotifications,
        };
      });

      // Return a context object with the snapshotted value
      return { previousSettings };
    },
    onError: (err, newNotifications, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["/api/user/settings"],
        context?.previousSettings,
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
    },
  });

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleDeviceToggle = (device: string, connected: boolean) => {
    deviceMutation.mutate({ device, connected: !connected });
  };

  const handleNotificationToggle = (key: string, currentValue: boolean) => {
    if (!notificationMutation.isPending) {
      const newValue = !currentValue;
      const currentNotifications =
        localNotifications || safeSettings.notifications;
      const updatedNotifications = {
        ...currentNotifications,
        [key]: newValue,
      };

      // Update local state immediately for instant UI feedback
      setLocalNotifications(updatedNotifications);

      // Send to server
      notificationMutation.mutate(updatedNotifications);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F23] flex flex-col items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Unable to load settings</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Provide fallback data if settings are missing
  const safeSettings = settings || {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: null,
    devices: {
      appleHealth: false,
      fitbit: false,
      sleepNumber: false,
      ouraRing: false,
    },
    notifications: {
      highRiskDay: true,
      dailyLog: true,
      educational: true,
      weather: true,
      times: {
        morning: "08:00",
        evening: "20:00",
        dailyLog: "21:00",
      },
    },
  };

  const safeNotifications = localNotifications || safeSettings.notifications;

  return (
    <div className="min-h-screen bg-[#0F0F23] flex flex-col relative overflow-hidden">


      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-16 pb-6">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 -ml-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-semibold">Settings</h1>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 pb-8">
        {/* Profile Section */}
        <div className="mx-4 bg-[#1A1F2E] rounded-2xl p-6 border border-[#2A3441]/30">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-600 rounded-full overflow-hidden">
              <img
                src={
                  safeSettings.avatar ||
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">
                {safeSettings.name}
              </h3>
              <p className="text-gray-400 text-sm">{safeSettings.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/edit-profile")}
            className="w-full mt-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium py-3 rounded-xl transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Device Integrations */}
        <div className="px-4">
          <h3 className="text-white font-semibold mb-4">Device Integrations</h3>
          <div className="space-y-3">
            <div className="bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between border border-[#2A3441]/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Apple Health</p>
                  <p className="text-gray-400 text-sm">
                    Heart rate, sleep, activity
                  </p>
                </div>
              </div>
              {safeSettings.devices.appleHealth ? (
                <span className="bg-[#4ADE80] text-white text-xs px-3 py-1 rounded-full font-medium">
                  Connected
                </span>
              ) : (
                <button
                  onClick={() =>
                    handleDeviceToggle(
                      "appleHealth",
                      safeSettings.devices.appleHealth,
                    )
                  }
                  className="bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  Connected
                </button>
              )}
            </div>

            <div className="bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between border border-[#2A3441]/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00B4D8] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" fill="white" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Fitbit</p>
                  <p className="text-gray-400 text-sm">
                    HRV, stress, sleep tracking
                  </p>
                </div>
              </div>
              {safeSettings.devices.fitbit ? (
                <span className="bg-[#4ADE80] text-white text-xs px-3 py-1 rounded-full font-medium">
                  Connected
                </span>
              ) : (
                <button
                  onClick={() =>
                    handleDeviceToggle("fitbit", safeSettings.devices.fitbit)
                  }
                  className="bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  Connect
                </button>
              )}
            </div>

            <div className="bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between border border-[#2A3441]/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#4C9EF1] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="4" y="12" width="16" height="4" rx="2" />
                    <rect x="6" y="6" width="12" height="2" rx="1" />
                    <rect x="8" y="16" width="8" height="2" rx="1" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Sleep Number</p>
                  <p className="text-gray-400 text-sm">
                    Sleep quality, restfulness
                  </p>
                </div>
              </div>
              {safeSettings.devices.sleepNumber ? (
                <span className="bg-[#4ADE80] text-white text-xs px-3 py-1 rounded-full font-medium">
                  Connected
                </span>
              ) : (
                <button
                  onClick={() =>
                    handleDeviceToggle(
                      "sleepNumber",
                      safeSettings.devices.sleepNumber,
                    )
                  }
                  className="bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  Connect
                </button>
              )}
            </div>

            <div className="bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between border border-[#2A3441]/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#A855F7] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Oura Ring</p>
                  <p className="text-gray-400 text-sm">
                    Sleep, HRV, body temperature
                  </p>
                </div>
              </div>
              {safeSettings.devices.ouraRing ? (
                <span className="bg-[#4ADE80] text-white text-xs px-3 py-1 rounded-full font-medium">
                  Connected
                </span>
              ) : (
                <button
                  onClick={() =>
                    handleDeviceToggle(
                      "ouraRing",
                      safeSettings.devices.ouraRing,
                    )
                  }
                  className="bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="px-4">
          <h3 className="text-white font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-start justify-between py-2">
              <div className="flex-1 pr-4">
                <p className="text-white font-medium mb-1">
                  High-Risk Day Alerts
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  Get notified when your migraine risk is elevated
                </p>
                <p className="text-gray-400 text-xs">
                  Morning: {safeNotifications.times.morning} • Evening:{" "}
                  {safeNotifications.times.evening}
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    "highRiskDay",
                    safeNotifications.highRiskDay,
                  )
                }
                disabled={notificationMutation.isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                  safeNotifications.highRiskDay
                    ? "bg-[#7C3AED]"
                    : "bg-[#374151]"
                } ${notificationMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    safeNotifications.highRiskDay
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between py-2">
              <div className="flex-1 pr-4">
                <p className="text-white font-medium mb-1">
                  Daily Log Reminders
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  Remind me to log symptoms and triggers
                </p>
                <p className="text-gray-400 text-xs">
                  Every day at {safeNotifications.times.dailyLog}
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    "dailyLog",
                    safeNotifications.dailyLog,
                  )
                }
                disabled={notificationMutation.isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                  safeNotifications.dailyLog ? "bg-[#7C3AED]" : "bg-[#374151]"
                } ${notificationMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    safeNotifications.dailyLog
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between py-2">
              <div className="flex-1 pr-4">
                <p className="text-white font-medium mb-1">
                  Educational Updates
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  New articles and migraine insights
                </p>
                <p className="text-gray-400 text-xs">Weekly on Mondays</p>
              </div>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    "educational",
                    safeNotifications.educational,
                  )
                }
                disabled={notificationMutation.isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                  safeNotifications.educational
                    ? "bg-[#7C3AED]"
                    : "bg-[#374151]"
                } ${notificationMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    safeNotifications.educational
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between py-2">
              <div className="flex-1 pr-4">
                <p className="text-white font-medium mb-1">
                  Weather Change Alerts
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  Barometric pressure and storm warnings
                </p>
                <p className="text-gray-400 text-xs">
                  When pressure drops {">"} 3 hPa
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotificationToggle("weather", safeNotifications.weather)
                }
                disabled={notificationMutation.isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                  safeNotifications.weather ? "bg-[#7C3AED]" : "bg-[#374151]"
                } ${notificationMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    safeNotifications.weather
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="px-4">
          <h3 className="text-white font-semibold mb-4">Account</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/account/personal-info")}
              className="w-full bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between hover:bg-[#1F2937] transition-colors border border-[#2A3441]/30"
            >
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-[#7C3AED]" />
                <span className="text-white font-medium">
                  Personal Information
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/privacy-security")}
              className="w-full bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between hover:bg-[#1F2937] transition-colors border border-[#2A3441]/30"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-[#00B4D8]" />
                <span className="text-white font-medium">
                  Privacy & Security
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/export-data")}
              className="w-full bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between hover:bg-[#1F2937] transition-colors border border-[#2A3441]/30"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-[#4ADE80]" />
                <span className="text-white font-medium">Export Data</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/help")}
              className="w-full bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between hover:bg-[#1F2937] transition-colors border border-[#2A3441]/30"
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-[#A855F7]" />
                <span className="text-white font-medium">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/terms")}
              className="w-full bg-[#1A1F2E] rounded-xl p-4 flex items-center justify-between hover:bg-[#1F2937] transition-colors border border-[#2A3441]/30"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-white font-medium">
                  Terms & Privacy Policy
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="px-4 text-center">
          <div className="text-white font-semibold text-lg mb-2">Zivora</div>
          <div className="text-gray-400 text-sm mb-1">Version 1.2.4</div>
          <div className="text-gray-400 text-xs mb-6">
            © 2025 Zivora Health
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("firebaseUser");
              navigate("/get-started");
            }}
            className="bg-[#1A1F2E] border border-[#2A3441]/30 rounded-xl py-3 px-6 text-white font-medium text-base hover:bg-[#1F2937] transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-white rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50 z-20">
        <div className="flex items-center justify-around py-2 px-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/daily-log')}
            className="flex flex-col items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Daily Log</span>
          </button>
          
          <button
            onClick={() => navigate('/insights')}
            className="flex flex-col items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Insights</span>
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="flex flex-col items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">History</span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center py-2 px-3 text-purple-400"
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
