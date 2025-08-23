import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Settings, Camera, Plus, ChevronLeft, ChevronRight, Home, BarChart3, Calendar, MessageCircle } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface DailyLogData {
  date: string;
  mealImage?: string;

  manualFoodEntry?: string;
  headacheSeverity: string;
  headacheDuration: {
    hours: number;
    minutes: number;
  };
  sleepQuality: string;
  stressLevel: string;
  hydration: number;
  activity: string;
  customTriggers: {
    emotions: string[];
    activities: string[];
    medications: string[];
  };
  notes: string;
}

export default function DailyLogScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Date navigation state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Form state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState("");
  const [severity, setSeverity] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [sleepQuality, setSleepQuality] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [hydration, setHydration] = useState(1);
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [customEmotion, setCustomEmotion] = useState("");
  const [customActivity, setCustomActivity] = useState("");
  const [customMedication, setCustomMedication] = useState("");
  const [showEmotionInput, setShowEmotionInput] = useState(false);
  const [showActivityInput, setShowActivityInput] = useState(false);
  const [showMedicationInput, setShowMedicationInput] = useState(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query to fetch existing log data for selected date
  const { data: existingLogData, isLoading: isLoadingLog } = useQuery({
    queryKey: ['daily-log', selectedDate],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/daily-log/${selectedDate}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch daily log");
      }
      return response.json();
    },
    staleTime: 0, // Always refetch when date changes
  });

  // Effect to populate form with existing data
  useEffect(() => {
    if (existingLogData?.exists && existingLogData.data) {
      const data = existingLogData.data;
      setSelectedPhoto(data.mealImage || null);
      setManualEntry(data.manualFoodEntry || "");
      setSeverity(data.headacheSeverity || "");
      setHours(data.headacheDuration?.hours || 0);
      setMinutes(data.headacheDuration?.minutes || 0);
      setSleepQuality(data.sleepQuality || "");
      setStressLevel(data.stressLevel || "");
      setHydration(data.hydration || 1);
      setActivity(data.activity || "");
      setNotes(data.notes || "");
      if (data.customTriggers) {
        setEmotions(data.customTriggers.emotions || []);
        setActivities(data.customTriggers.activities || []);
        setMedications(data.customTriggers.medications || []);
      }
    } else {
      // Reset form when no data exists for the date
      resetForm();
    }
  }, [existingLogData]);

  const resetForm = () => {
    setSelectedPhoto(null);
    setManualEntry("");
    setSeverity("");
    setHours(0);
    setMinutes(0);
    setSleepQuality("");
    setStressLevel("");
    setHydration(1);
    setActivity("");
    setNotes("");
    setEmotions([]);
    setActivities([]);
    setMedications([]);
    setValidationErrors({});
  };

  // Date navigation functions
  const changeDate = (direction: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return "Today";
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return "Yesterday";
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const saveLogMutation = useMutation({
    mutationFn: async (logData: DailyLogData) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(logData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to save daily log");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "Entry saved successfully!",
        description: "Your daily log has been recorded.",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Failed to save entry",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Compress image before upload
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Resize to maximum 800px width
        const maxWidth = 800;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setSelectedPhoto(compressedDataUrl);
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSeveritySelect = (selectedSeverity: string) => {
    setSeverity(selectedSeverity);
    // Clear validation error when user selects a value
    if (validationErrors.severity) {
      setValidationErrors(prev => ({ ...prev, severity: "" }));
    }
  };

  const handleSleepQualitySelect = (quality: string) => {
    setSleepQuality(quality);
    if (validationErrors.sleepQuality) {
      setValidationErrors(prev => ({ ...prev, sleepQuality: "" }));
    }
  };

  const handleStressLevelSelect = (level: string) => {
    setStressLevel(level);
    if (validationErrors.stressLevel) {
      setValidationErrors(prev => ({ ...prev, stressLevel: "" }));
    }
  };

  const handleActivitySelect = (selectedActivity: string) => {
    setActivity(selectedActivity);
    if (validationErrors.activity) {
      setValidationErrors(prev => ({ ...prev, activity: "" }));
    }
  };

  const handleManualEntryChange = (value: string) => {
    setManualEntry(value);
    if (validationErrors.foodEntry) {
      setValidationErrors(prev => ({ ...prev, foodEntry: "" }));
    }
  };

  const toggleEmotion = (emotion: string) => {
    setEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleMedication = (medication: string) => {
    setMedications(prev => 
      prev.includes(medication) 
        ? prev.filter(m => m !== medication)
        : [...prev, medication]
    );
  };

  const addCustomEmotion = () => {
    if (customEmotion.trim()) {
      setEmotions(prev => [...prev, customEmotion.trim()]);
      setCustomEmotion("");
      setShowEmotionInput(false);
    }
  };

  const addCustomActivity = () => {
    if (customActivity.trim()) {
      setActivities(prev => [...prev, customActivity.trim()]);
      setCustomActivity("");
      setShowActivityInput(false);
    }
  };

  const addCustomMedication = () => {
    if (customMedication.trim()) {
      setMedications(prev => [...prev, customMedication.trim()]);
      setCustomMedication("");
      setShowMedicationInput(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (!severity) {
      errors.severity = "Headache severity is required";
    }
    
    if (!sleepQuality) {
      errors.sleepQuality = "Sleep quality is required";
    }
    
    if (!stressLevel) {
      errors.stressLevel = "Stress level is required";
    }
    
    if (hydration < 1) {
      errors.hydration = "Water intake is required";
    }
    
    if (!activity) {
      errors.activity = "Physical activity is required";
    }
    
    // Food entry validation - either photo OR manual entry required
    if (!selectedPhoto && !manualEntry.trim()) {
      errors.foodEntry = "Either photo or manual food entry is required";
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Please fill all required fields",
        description: "Complete the form before saving your entry.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSaveEntry = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    
    const logData: DailyLogData = {
      date: today,
      mealImage: selectedPhoto || undefined,
      manualFoodEntry: manualEntry || undefined,
      headacheSeverity: severity,
      headacheDuration: {
        hours,
        minutes
      },
      sleepQuality,
      stressLevel,
      hydration,
      activity,
      customTriggers: {
        emotions,
        activities,
        medications
      },
      notes
    };

    saveLogMutation.mutate(logData);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const availableEmotions = ["Work stress", "Family issues", "Financial worry"];
  const availableActivities = ["Screen time", "Exercise", "Travel"];
  const availableMedications = ["Ibuprofen", "Acetaminophen"];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-16 pb-4">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 -ml-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-white text-lg font-medium">Daily Log</h1>
          <div className="flex items-center space-x-4 mt-1">
            <button 
              onClick={() => changeDate(-1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-gray-400 text-sm">{formatDisplayDate(selectedDate)}</p>
            <button 
              onClick={() => changeDate(1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-500 text-xs">{selectedDate}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="p-2 -mr-2 text-white hover:bg-gray-800 rounded-full transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-48 space-y-5">
        {/* Food Intake Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Food Intake
          </h2>
          
          {/* Photo Capture */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm font-medium mb-2">Photo Capture</p>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {selectedPhoto ? (
                <div className="relative bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                  <img 
                    src={selectedPhoto} 
                    alt="Meal" 
                    className="w-full h-32 object-cover rounded-lg shadow-sm" 
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                  >
                    ×
                  </button>
                  <p className="text-green-400 text-xs mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Photo captured
                  </p>
                </div>
              ) : (
                <div className="bg-gray-800/30 border-2 border-dashed border-gray-600/50 rounded-xl p-4 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-white text-sm font-medium">Add Photo</span>
                      <p className="text-gray-400 text-xs">Tap to capture meal</p>
                    </div>
                  </div>
                </div>
              )}
            </label>
          </div>



          {/* Manual Entry */}
          <div>
            <p className="text-gray-300 text-sm font-medium mb-2">
              Food Description 
              <span className="text-red-400 ml-1">*</span>
            </p>
            <div className="relative">
              <textarea
                placeholder="Type your meal or symptoms...
Example: Chicken sandwich, apple, water"
                value={manualEntry}
                onChange={(e) => handleManualEntryChange(e.target.value)}
                className={`w-full bg-gray-800/50 border rounded-xl p-3 text-white placeholder-gray-500 outline-none resize-none h-24 text-sm transition-all ${
                  validationErrors.foodEntry 
                    ? 'border-red-500/60 bg-red-900/10' 
                    : manualEntry.length > 0 
                    ? 'border-green-500/60' 
                    : 'border-gray-700/50 focus:border-purple-500/60'
                }`}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {manualEntry.length}/200
              </div>
            </div>
            {validationErrors.foodEntry && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                {validationErrors.foodEntry}
              </p>
            )}
            {manualEntry.length > 0 && !validationErrors.foodEntry && (
              <p className="text-green-400 text-xs mt-1 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Food entry saved
              </p>
            )}
          </div>
        </div>

        {/* Headache Logging Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Headache Logging
          </h2>
          
          {/* Severity */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-3">Severity *</p>
            <div className="flex space-x-3">
              {["None", "Mild", "Moderate", "Severe"].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSeveritySelect(level)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    severity === level
                      ? level === "Severe" 
                        ? "bg-purple-600 text-white"
                        : level === "Moderate"
                        ? "bg-orange-600 text-white"
                        : level === "Mild"
                        ? "bg-yellow-600 text-white"
                        : "bg-green-600 text-white"
                      : validationErrors.severity
                      ? "bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-red-500"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            {validationErrors.severity && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.severity}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Duration</p>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Hours"
                  value={hours || ""}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-800 rounded-xl p-3 text-white placeholder-gray-400 outline-none"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Minutes"
                  value={minutes || ""}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-800 rounded-xl p-3 text-white placeholder-gray-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Quality Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Sleep Quality
            <span className="text-red-400 ml-1">*</span>
          </h2>
          <div className="flex space-x-3">
            {["Poor", "Average", "Good", "Excellent"].map((quality) => (
              <button
                key={quality}
                onClick={() => handleSleepQualitySelect(quality)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  sleepQuality === quality
                    ? quality === "Excellent" 
                      ? "bg-green-600 text-white"
                      : quality === "Good"
                      ? "bg-blue-600 text-white"
                      : quality === "Average"
                      ? "bg-yellow-600 text-white"
                      : "bg-red-600 text-white"
                    : validationErrors.sleepQuality
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-red-500"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
          {validationErrors.sleepQuality && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.sleepQuality}</p>
          )}
        </div>

        {/* Stress Level Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Stress Level
            <span className="text-red-400 ml-1">*</span>
          </h2>
          <div className="flex space-x-3">
            {["Low", "Moderate", "High"].map((level) => (
              <button
                key={level}
                onClick={() => handleStressLevelSelect(level)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  stressLevel === level
                    ? level === "High" 
                      ? "bg-red-600 text-white"
                      : level === "Moderate"
                      ? "bg-orange-600 text-white"
                      : "bg-green-600 text-white"
                    : validationErrors.stressLevel
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-red-500"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          {validationErrors.stressLevel && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.stressLevel}</p>
          )}
        </div>

        {/* Activity & Hydration Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Activity & Hydration
          </h2>
          
          {/* Hydration */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-3">Water Intake (cups) *</p>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="12"
                value={hydration}
                onChange={(e) => setHydration(parseInt(e.target.value))}
                className={`flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer ${
                  validationErrors.hydration ? 'border-2 border-red-500' : ''
                }`}
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(hydration / 12) * 100}%, #374151 ${(hydration / 12) * 100}%, #374151 100%)`
                }}
              />
              <span className="text-white font-medium w-12 text-center">{hydration}</span>
            </div>
            {validationErrors.hydration && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.hydration}</p>
            )}
          </div>

          {/* Activity */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Physical Activity *</p>
            <select
              value={activity}
              onChange={(e) => handleActivitySelect(e.target.value)}
              className={`w-full bg-gray-800 rounded-xl p-3 text-white outline-none ${
                validationErrors.activity ? 'border-2 border-red-500' : ''
              }`}
            >
              <option value="">Select activity</option>
              <option value="Walk">Walk</option>
              <option value="Gym">Gym</option>
              <option value="Yoga">Yoga</option>
              <option value="Running">Running</option>
              <option value="Swimming">Swimming</option>
              <option value="Cycling">Cycling</option>
              <option value="None">None</option>
            </select>
            {validationErrors.activity && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.activity}</p>
            )}
          </div>
        </div>

        {/* Custom Triggers Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Custom Triggers
          </h2>
          
          {/* Stress Events */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Stress Events</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableEmotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    emotions.includes(emotion)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {emotion}
                </button>
              ))}
              {emotions.filter(e => !availableEmotions.includes(e)).map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className="px-3 py-2 rounded-full text-sm bg-purple-600 text-white"
                >
                  {emotion}
                </button>
              ))}
            </div>
            {showEmotionInput ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add custom stress event..."
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  className="flex-1 bg-gray-800 rounded-xl p-3 text-white placeholder-gray-400 outline-none"
                />
                <button
                  onClick={addCustomEmotion}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEmotionInput(true)}
                className="flex items-center text-gray-400 text-sm hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add custom stress event...
              </button>
            )}
          </div>

          {/* Specific Activities */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Specific Activities</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableActivities.map((activity) => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    activities.includes(activity)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {activity}
                </button>
              ))}
              {activities.filter(a => !availableActivities.includes(a)).map((activity) => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className="px-3 py-2 rounded-full text-sm bg-purple-600 text-white"
                >
                  {activity}
                </button>
              ))}
            </div>
            {showActivityInput ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add activity..."
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  className="flex-1 bg-gray-800 rounded-xl p-3 text-white placeholder-gray-400 outline-none"
                />
                <button
                  onClick={addCustomActivity}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowActivityInput(true)}
                className="flex items-center text-gray-400 text-sm hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add activity...
              </button>
            )}
          </div>

          {/* Medications */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Medications</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableMedications.map((medication) => (
                <button
                  key={medication}
                  onClick={() => toggleMedication(medication)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    medications.includes(medication)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {medication}
                </button>
              ))}
              {medications.filter(m => !availableMedications.includes(m)).map((medication) => (
                <button
                  key={medication}
                  onClick={() => toggleMedication(medication)}
                  className="px-3 py-2 rounded-full text-sm bg-purple-600 text-white"
                >
                  {medication}
                </button>
              ))}
            </div>
            {showMedicationInput ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add medication..."
                  value={customMedication}
                  onChange={(e) => setCustomMedication(e.target.value)}
                  className="flex-1 bg-gray-800 rounded-xl p-3 text-white placeholder-gray-400 outline-none"
                />
                <button
                  onClick={addCustomMedication}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMedicationInput(true)}
                className="flex items-center text-gray-400 text-sm hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add medication...
              </button>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
          <h2 className="text-white text-base font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Notes
            <span className="text-gray-400 ml-2 text-xs">(Optional)</span>
          </h2>
          <textarea
            placeholder="Add any additional notes about your day..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-800/70 border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-400 outline-none resize-none h-28 focus:border-purple-500/60 focus:bg-gray-800/90 transition-all"
          />
        </div>
      </div>

      {/* Save Entry Button - Fixed at bottom */}
<div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-black to-black/90 backdrop-blur-sm z-30">
        <button
          onClick={handleSaveEntry}
          disabled={isSubmitting || saveLogMutation.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/20 disabled:shadow-none flex items-center justify-center space-x-2 active:scale-98"
        >
          {isSubmitting || saveLogMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Entry</span>
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </>
          )}
        </button>
        
        {/* Compact progress indicator */}
        <div className="mt-2 flex justify-center">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${selectedPhoto || manualEntry ? 'bg-green-400' : 'bg-gray-600'}`}></div>
              <span>Food</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${severity ? 'bg-green-400' : 'bg-gray-600'}`}></div>
              <span>Headache</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${sleepQuality && stressLevel ? 'bg-green-400' : 'bg-gray-600'}`}></div>
              <span>Health</span>
            </div>
          </div>
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
            className="flex flex-col items-center py-2 px-3 text-purple-400"
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
            className="flex flex-col items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}