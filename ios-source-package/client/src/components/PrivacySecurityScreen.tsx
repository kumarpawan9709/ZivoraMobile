import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Eye, EyeOff, Shield, Trash2, Lock, Fingerprint, Smartphone } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SecuritySettings {
  biometricLogin: boolean;
  twoFactorAuth: boolean;
  userId: string;
}

export function PrivacySecurityScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch security settings
  const { data: securitySettings, isLoading } = useQuery<SecuritySettings>({
    queryKey: ["/api/user/security-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/security-settings");
      return response.json();
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      return await apiRequest("POST", "/api/user/change-password", { 
        currentPassword,
        newPassword 
      });
    },
    onSuccess: () => {
      toast({
        title: "Password changed successfully",
        description: "Your password has been updated",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  // Update security settings mutation
  const updateSecurityMutation = useMutation({
    mutationFn: async (settings: Partial<SecuritySettings>) => {
      return await apiRequest("PATCH", "/api/user/security-settings", settings);
    },
    onSuccess: () => {
      toast({
        title: "Security settings updated",
        description: "Your security preferences have been saved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/security-settings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/user/account");
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      });
      navigate("/login");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    },
  });

  const handleSaveChanges = () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast({
          title: "Password mismatch",
          description: "New password and confirmation don't match",
          variant: "destructive",
        });
        return;
      }

      if (newPassword.length < 8) {
        toast({
          title: "Password too short",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        return;
      }

      changePasswordMutation.mutate({ currentPassword, newPassword });
    } else if (!currentPassword && !newPassword && !confirmPassword) {
      // Just save other settings if no password change
      toast({
        title: "Settings saved",
        description: "Your security settings have been updated",
      });
    } else {
      toast({
        title: "Incomplete form",
        description: "Please fill in all password fields or leave them empty",
        variant: "destructive",
      });
    }
  };

  const handleBiometricToggle = (enabled: boolean) => {
    updateSecurityMutation.mutate({ biometricLogin: enabled });
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    updateSecurityMutation.mutate({ twoFactorAuth: enabled });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      deleteAccountMutation.mutate();
    }
  };

  const isFormValid = () => {
    const hasPasswordChange = currentPassword || newPassword || confirmPassword;
    if (hasPasswordChange) {
      return currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;
    }
    return true;
  };

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const passwordValidation = validatePassword(newPassword);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Privacy & Security</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Change Password Section */}
        <div className="space-y-4">
          <h2 className="text-white font-medium text-lg">Change Password</h2>
          
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">New Password</label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Password requirements:</label>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>Minimum 8 characters</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>At least one uppercase letter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>At least one lowercase letter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>At least one number</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>At least one special character</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h2 className="text-white font-medium text-lg">Security Settings</h2>
          
          {/* Biometric Login */}
          <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fingerprint className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <span className="text-white font-medium block">Biometric Login</span>
                <span className="text-gray-400 text-sm">Log in using fingerprint or face ID</span>
              </div>
            </div>
            <Switch
              checked={securitySettings?.biometricLogin || false}
              onCheckedChange={handleBiometricToggle}
              className="data-[state=checked]:bg-[#8B5CF6]"
            />
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <span className="text-white font-medium block">Two-Factor Authentication</span>
                <span className="text-gray-400 text-sm">Extra security for your account</span>
              </div>
            </div>
            <Switch
              checked={securitySettings?.twoFactorAuth || false}
              onCheckedChange={handleTwoFactorToggle}
              className="data-[state=checked]:bg-[#8B5CF6]"
            />
          </div>
        </div>

        {/* Account Management */}
        <div className="space-y-4">
          <h2 className="text-white font-medium text-lg">Account Management</h2>
          
          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-gray-800 rounded-xl p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <span className="text-white font-medium block">Delete Account</span>
                <span className="text-gray-400 text-sm">Permanently delete your account</span>
              </div>
            </div>
          </button>
        </div>

        {/* Save Changes Button */}
        <div className="pt-6">
          <Button
            onClick={handleSaveChanges}
            disabled={!isFormValid() || changePasswordMutation.isPending}
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-90 text-white py-4 rounded-xl font-medium text-lg transition-opacity"
          >
            {changePasswordMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PrivacySecurityScreen;