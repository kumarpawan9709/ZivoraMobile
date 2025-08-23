import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Check, Brain, CloudRain, Utensils, BedDouble, Dumbbell, Monitor } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface SymptomLog {
  userId: number;
  symptoms: string[];
  intensity: number;
  occurredAt: string;
  triggers: string[];
}

export default function LogSymptomsScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number>(5);
  const [timeOption, setTimeOption] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showCustomTime, setShowCustomTime] = useState(false);

  // Available options
  const symptoms = [
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'nausea', label: 'Nausea', icon: '🤢' },
    { id: 'light-sensitivity', label: 'Light Sensitivity', icon: '💡' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'sound-sensitivity', label: 'Sound Sensitivity', icon: '🔊' },
    { id: 'brain-fog', label: 'Brain Fog', icon: '🧠' }
  ];

  const triggers = [
    { id: 'stress', label: 'Stress', icon: Brain },
    { id: 'weather', label: 'Weather', icon: CloudRain },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'poor-sleep', label: 'Poor Sleep', icon: BedDouble },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
    { id: 'screen-time', label: 'Screen Time', icon: Monitor }
  ];

  // Get current user ID
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

  // Toggle symptom selection
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Toggle trigger selection
  const toggleTrigger = (triggerId: string) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(t => t !== triggerId)
        : [...prev, triggerId]
    );
  };

  // Handle time option selection
  const handleTimeOptionChange = (option: string) => {
    setTimeOption(option);
    if (option === 'custom') {
      setShowCustomTime(true);
    } else {
      setShowCustomTime(false);
      setCustomTime('');
    }
  };

  // Calculate occurrence time
  const getOccurrenceTime = () => {
    const now = new Date();
    
    switch (timeOption) {
      case 'just-now':
        return now;
      case 'earlier-today':
        // Set to 2 hours ago
        const earlierToday = new Date(now.getTime() - (2 * 60 * 60 * 1000));
        return earlierToday;
      case 'custom':
        if (customTime) {
          const [hours, minutes] = customTime.split(':');
          const customDate = new Date();
          customDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          return customDate;
        }
        return now;
      default:
        return now;
    }
  };

  // Validation
  const validateForm = () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one symptom",
        variant: "destructive",
      });
      return false;
    }
    
    if (!timeOption) {
      toast({
        title: "Validation Error", 
        description: "Please select when this occurred",
        variant: "destructive",
      });
      return false;
    }

    if (timeOption === 'custom' && !customTime) {
      toast({
        title: "Validation Error",
        description: "Please select a custom time",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Get current user ID
  const userId = getCurrentUserId();

  // Save symptom log mutation
  const saveSymptomMutation = useMutation({
    mutationFn: async (logData: SymptomLog) => {
      const response = await fetch('/api/symptoms-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Save symptom log error:', errorData);
        throw new Error('Failed to save symptom log');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Symptom log saved successfully",
      });
      
      // Invalidate related queries
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/user/symptoms/${userId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/user/trends/summary/${userId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/user/trends/recent/${userId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/user/trends/frequency/${userId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/user/trends/triggers/${userId}`] });
      }
      
      // Navigate back to history or dashboard
      navigate('/history');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save symptom log. Please try again.",
        variant: "destructive",
      });
      console.error('Save symptom log error:', error);
    }
  });

  // Handle save log
  const handleSaveLog = () => {
    if (!validateForm()) return;

    const userId = getCurrentUserId();
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save symptom log",
        variant: "destructive",
      });
      return;
    }

    const logData: SymptomLog = {
      userId,
      symptoms: selectedSymptoms,
      intensity,
      occurredAt: getOccurrenceTime().toISOString(),
      triggers: selectedTriggers
    };

    saveSymptomMutation.mutate(logData);
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Log Symptoms</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-4 pb-32 space-y-6">
        {/* Select Symptoms */}
        <div>
          <h2 className="text-white font-medium mb-4">Select Symptoms</h2>
          <div className="grid grid-cols-2 gap-3">
            {symptoms.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                    : 'bg-[#1A1F2E] border-[#2A3441]/30 text-gray-300 hover:bg-[#1F2937]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {selectedSymptoms.includes(symptom.id) && (
                    <Check className="w-4 h-4" />
                  )}
                  <span className="text-lg">{symptom.icon}</span>
                  <span className="font-medium text-sm">{symptom.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        <div>
          <h2 className="text-white font-medium mb-4">How intense is it?</h2>
          <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Mild</span>
              <span className="text-[#7C3AED] font-semibold">{intensity}</span>
              <span>Severe</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${((intensity - 1) / 9) * 100}%, #374151 ${((intensity - 1) / 9) * 100}%, #374151 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
          </div>
        </div>

        {/* When did this occur */}
        <div>
          <h2 className="text-white font-medium mb-4">When did this occur?</h2>
          <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30 space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={() => handleTimeOptionChange('just-now')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOption === 'just-now'
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#2A3441] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                Just now
              </button>
              <button
                onClick={() => handleTimeOptionChange('earlier-today')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  timeOption === 'earlier-today'
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#2A3441] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                Earlier today
              </button>
            </div>
            
            <button
              onClick={() => handleTimeOptionChange('custom')}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                timeOption === 'custom'
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-[#2A3441] text-gray-300 hover:bg-[#374151]'
              }`}
            >
              <span className="mr-2">⏰</span>
              Custom time
            </button>

            {showCustomTime && (
              <div className="mt-3">
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full bg-[#2A3441] border border-[#3A4553] rounded-lg px-3 py-2 text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Possible Triggers */}
        <div>
          <h2 className="text-white font-medium mb-4">Possible Triggers</h2>
          <div className="grid grid-cols-2 gap-3">
            {triggers.map((trigger) => {
              const IconComponent = trigger.icon;
              return (
                <button
                  key={trigger.id}
                  onClick={() => toggleTrigger(trigger.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedTriggers.includes(trigger.id)
                      ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                      : 'bg-[#1A1F2E] border-[#2A3441]/30 text-gray-300 hover:bg-[#1F2937]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {selectedTriggers.includes(trigger.id) && (
                      <Check className="w-4 h-4" />
                    )}
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-sm">{trigger.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Log Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F1419]">
        <button
          onClick={handleSaveLog}
          disabled={saveSymptomMutation.isPending}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-4 rounded-2xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {saveSymptomMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Save Log</span>
            </div>
          )}
        </button>
      </div>


    </div>
  );
}