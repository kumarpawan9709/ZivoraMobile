import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CreateProfileScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    migraineFrequency: "",
    appleHealth: false,
    googleFit: false,
    sleepTracking: true
  });

  // Fetch existing profile if available
  const { data: profileData } = useQuery({
    queryKey: ['/api/profile-setup'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile-setup", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!localStorage.getItem("token")
  });

  // Pre-fill form with existing profile data
  useEffect(() => {
    if (profileData?.profile) {
      const profile = profileData.profile;
      setFormData({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        migraineFrequency: profile.migrineFrequency || "",
        appleHealth: profile.appleHealth || false,
        googleFit: profile.googleFit || false,
        sleepTracking: profile.sleepTracking !== undefined ? profile.sleepTracking : true
      });
    }
  }, [profileData]);

  const profileMutation = useMutation({
    mutationFn: async (profileData: typeof formData) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create profile");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile created",
        description: data.message || "Your profile has been set up successfully!"
      });
      
      // Navigate to dashboard as specified by the API
      if (data.redirect_to) {
        navigate(data.redirect_to);
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Profile creation failed",
        description: error.message || "An error occurred while creating your profile",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender || !formData.migraineFrequency) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    profileMutation.mutate(formData);
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleBack = () => {
    console.log("Back button clicked - navigating to /signup");
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Status Bar */}


      {/* Header with Back Button */}
      <div className="flex items-center px-6 pt-16 pb-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-white text-xl font-semibold -ml-10">
          Create Your Profile
        </h1>
      </div>

      {/* Subtitle */}
      <div className="px-6 pb-6">
        <p className="text-gray-400 text-center text-sm">
          Help us personalize your Zivora experience
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-white font-semibold mb-4">Personal Information</h2>
            
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Enter your age"
                className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Gender
              </label>
              <div className="flex space-x-3">
                {["Female", "Male", "Other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleInputChange("gender", gender)}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${
                      formData.gender === gender
                        ? "bg-purple-500 border-purple-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Migraine Frequency Section */}
          <div>
            <h2 className="text-white font-semibold mb-2">Migraine Frequency</h2>
            <p className="text-gray-400 text-sm mb-4">How often do you experience migraines?</p>
            
            <div className="space-y-3">
              {[
                "Daily",
                "Several times per week", 
                "Weekly",
                "Monthly",
                "Rarely"
              ].map((frequency) => (
                <button
                  key={frequency}
                  type="button"
                  onClick={() => handleInputChange("migraineFrequency", frequency)}
                  className={`w-full text-left py-3 px-4 rounded-xl border transition-colors flex items-center ${
                    formData.migraineFrequency === frequency
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    formData.migraineFrequency === frequency
                      ? "border-white bg-white"
                      : "border-gray-500"
                  }`}>
                    {formData.migraineFrequency === frequency && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full m-0.5"></div>
                    )}
                  </div>
                  {frequency}
                </button>
              ))}
            </div>
          </div>

          {/* Health Integration Section */}
          <div>
            <h2 className="text-white font-semibold mb-2">Health Integration</h2>
            <p className="text-gray-400 text-sm mb-4">Connect your health data for better insights</p>
            
            <div className="space-y-4">
              {/* Apple Health */}
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black text-xs font-bold">♥</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Apple Health</p>
                    <p className="text-gray-400 text-xs">Sleep, heart rate</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange("appleHealth", !formData.appleHealth)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.appleHealth ? "bg-purple-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.appleHealth ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </button>
              </div>

              {/* Google Fit */}
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Google Fit</p>
                    <p className="text-gray-400 text-xs">Activity, step tracking</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange("googleFit", !formData.googleFit)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.googleFit ? "bg-purple-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.googleFit ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </button>
              </div>

              {/* Sleep Tracking */}
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💤</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Sleep Tracking</p>
                    <p className="text-gray-400 text-xs">Manual sleep logging</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange("sleepTracking", !formData.sleepTracking)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.sleepTracking ? "bg-purple-500" : "bg-gray-600"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.sleepTracking ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            {/* Complete Profile Button */}
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-300 disabled:to-purple-400 text-white font-semibold py-4 px-6 rounded-2xl transition-colors"
            >
              {profileMutation.isPending ? "Creating Profile..." : "Complete Profile"}
            </button>

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-gray-400 hover:text-white text-center py-2 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>

        {/* Terms and Privacy */}
        <p className="text-gray-500 text-xs text-center mt-6 px-4 leading-relaxed">
          By signing up or logging in, I accept the Zivora{" "}
          <span className="text-purple-400 underline">Terms of Service</span> and{" "}
          <span className="text-purple-400 underline">Privacy Policy</span>
        </p>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  );
}