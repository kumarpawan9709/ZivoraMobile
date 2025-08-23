import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Save, X, User, Mail, Phone, Calendar, MapPin, Camera } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiRequest } from '@/lib/queryClient';

interface PersonalInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  profileImage?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export default function PersonalInfoScreen() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    profileImage: '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

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

  // Fetch personal info
  const { data: personalInfo, isLoading } = useQuery<PersonalInfo>({
    queryKey: ['personal-info', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/personal-info/${userId}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch personal info");
      }
      return response.json();
    },
    enabled: !!userId,
  });

  // Set form data when personal info is loaded
  useEffect(() => {
    if (personalInfo) {
      setFormData(personalInfo);
    }
  }, [personalInfo]);

  // Update personal info mutation
  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: Partial<PersonalInfo>) => {
      return apiRequest('/api/user/personal-info', 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['personal-info'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update personal information",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updatePersonalInfoMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (personalInfo) {
      setFormData(personalInfo);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 sticky top-0 z-10">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Personal Information</h1>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {isEditing ? <X className="w-5 h-5 text-white" /> : <Edit className="w-5 h-5 text-white" />}
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Photo Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.profileImage} alt="Profile" />
                <AvatarFallback className="bg-purple-500 text-white text-xl">
                  {getInitials(formData.name || 'U')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-gray-300">Gender</Label>
              <select
                id="gender"
                value={formData.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 border-gray-600 text-white mt-1 px-3 py-2 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-gray-300">Address</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Enter your address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emergencyContact" className="text-gray-300">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact || ''}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Enter emergency contact name"
              />
            </div>

            <div>
              <Label htmlFor="emergencyPhone" className="text-gray-300">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone || ''}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                placeholder="Enter emergency contact phone"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {isEditing && (
          <div className="flex space-x-3 pb-6">
            <Button
              onClick={handleSave}
              disabled={updatePersonalInfoMutation.isPending}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {updatePersonalInfoMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}