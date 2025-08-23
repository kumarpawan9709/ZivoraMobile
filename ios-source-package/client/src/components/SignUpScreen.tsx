import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function SignUpScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUpMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      console.log('Attempting registration with:', { ...userData, password: '[HIDDEN]' });
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      
      const responseData = await response.json();
      console.log('Registration response:', { ok: response.ok, status: response.status, data: responseData });
      
      if (!response.ok) {
        throw new Error(responseData.message || `Registration failed: ${response.status}`);
      }
      
      return responseData;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Account created",
        description: "Welcome to Zivora!"
      });
      navigate("/create-profile");
    },
    onError: (error: any) => {
      console.error('Sign up error:', error);
      let errorMessage = error.message || "An error occurred during registration";
      
      // Handle specific error cases
      if (errorMessage.includes("User already exists")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    signUpMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
  };

  const handleBack = () => {
    console.log("Back button clicked - navigating to /mobile-onboarding-3");
    navigate("/mobile-onboarding-3");
  };

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', WebkitOverflowScrolling: 'touch' }}>
      {/* Desktop/Mobile Responsive Container */}
      <div className="min-h-screen flex flex-col w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg xl:max-w-xl relative md:justify-center md:py-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>


      {/* Header with Back Button */}
      <div className="flex items-center px-6 pt-16 md:pt-4 pb-4">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 -ml-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* App Branding */}
      <div className="text-center px-6 pb-6">
        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">😊</span>
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Zivora</h1>
        <p className="text-gray-400 text-sm">Your personal migraine tracker</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mx-6 mb-6 bg-gray-800 rounded-2xl p-1">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex-1 py-3 text-center rounded-xl text-gray-400 font-medium hover:text-white transition-colors"
        >
          Login
        </button>
        <button
          type="button"
          className="flex-1 py-3 text-center rounded-xl bg-purple-500 text-white font-medium"
        >
          Sign Up
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8 md:px-8 lg:px-12 md:pb-16">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5" noValidate>
          {/* Full Name Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-4 md:py-5 lg:px-6 lg:py-6 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              className={`w-full bg-gray-800 text-white placeholder-gray-400 border rounded-xl px-4 py-4 md:py-5 lg:px-6 lg:py-6 focus:outline-none focus:ring-2 focus:border-transparent text-base ${
                formData.email && !validateEmail(formData.email) 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-purple-500'
              }`}
              autoComplete="email"
              required
            />
            {formData.email && !validateEmail(formData.email) && (
              <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-4 pr-12 md:py-5 lg:px-6 lg:py-6 lg:pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-4 pr-12 md:py-5 lg:px-6 lg:py-6 lg:pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={signUpMutation.isPending}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-4 px-6 md:py-5 lg:py-6 rounded-2xl transition-colors mt-4 text-base md:text-lg"
          >
            {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>

        {/* Home Indicator - Mobile Only */}
        <div className="md:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>
  );
}