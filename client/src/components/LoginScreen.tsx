import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function LoginScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Login successful",
        description: "Welcome back to Zivora!"
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    loginMutation.mutate({ email, password });
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
      <div className="text-center px-6 pb-8">
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
          className="flex-1 py-3 text-center rounded-xl bg-purple-500 text-white font-medium"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="flex-1 py-3 text-center rounded-xl text-gray-400 font-medium hover:text-white transition-colors"
        >
          Sign Up
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8 md:px-8 lg:px-12 md:pb-16">
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-4 md:py-5 lg:px-6 lg:py-6 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-purple-400 text-sm hover:text-purple-300"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-4 px-6 md:py-5 lg:py-6 rounded-2xl transition-colors mt-6 text-base md:text-lg"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

        {/* Home Indicator - Mobile Only */}
        <div className="md:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
      </div>
    </div>
  );
}