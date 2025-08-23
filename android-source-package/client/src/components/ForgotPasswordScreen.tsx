import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send reset email");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Back button clicked - navigating to login");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Status Bar */}


      {/* Header with Back Button */}
      <div className="flex items-center justify-between px-6 pt-16 pb-8 relative">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-12 h-12 text-white hover:bg-gray-800 rounded-full transition-colors z-30 cursor-pointer"
          style={{ touchAction: 'manipulation' }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold pointer-events-none">
          Forgot Password
        </h1>
        <div className="w-12 h-12"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm leading-relaxed">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-4 px-6 rounded-2xl transition-colors"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-white text-xl font-semibold">Check Your Email</h2>
            
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              If an account with that email exists, we've sent password reset instructions to{" "}
              <span className="text-white">{email}</span>.
            </p>
            
            <p className="text-gray-400 text-xs">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Try Different Email
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  );
}