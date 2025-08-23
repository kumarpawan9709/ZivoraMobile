import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, ChevronDown, Camera } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  avatar?: string;
}

export default function EditProfileScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    avatar: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userData && token) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.id);
    } else {
      navigate("/get-started");
    }
  }, [navigate]);

  // Fetch user profile data
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['/api/user/profile', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/profile/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!userId
  });

  // Update form data when profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        gender: userProfile.gender || "",
        emergencyContactName: userProfile.emergencyContact?.name || "",
        emergencyContactPhone: userProfile.emergencyContact?.phone || "",
        avatar: userProfile.avatar || ""
      });
    }
  }, [userProfile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: (data) => {
      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      navigate("/settings");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const profileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone
      },
      avatar: formData.avatar
    };

    updateProfileMutation.mutate(profileData);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F23] text-white">


      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4 pb-6">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 -ml-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-semibold">Edit Profile</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-600 border-4 border-[#7C3AED]">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {formData.name.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6D28D9] transition-colors">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-gray-400 text-sm mt-3">Tap to change photo</p>
      </div>

      {/* Form Fields */}
      <div className="px-6 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Date of Birth</label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors appearance-none"
            />
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Gender</label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Emergency Contact</label>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors"
              placeholder="Contact name"
            />
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              className="w-full bg-[#1A1F2E] text-white px-4 py-3 rounded-xl border border-[#2A3441] focus:outline-none focus:border-[#7C3AED] transition-colors"
              placeholder="Contact phone number"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-8 space-y-4">
        <button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
        
        <button
          onClick={() => navigate("/settings")}
          className="w-full text-gray-400 hover:text-white font-medium py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}