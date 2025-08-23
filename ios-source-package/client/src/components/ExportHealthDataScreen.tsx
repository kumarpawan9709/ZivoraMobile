import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Download, FileText, File, Moon, Activity, Utensils, Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface ExportPreferences {
  dateRange: 'last7' | 'last30' | 'custom';
  customStartDate: string;
  customEndDate: string;
  dataTypes: {
    sleepQuality: boolean;
    stressLevels: boolean;
    foodTriggers: boolean;
    hrv: boolean;
  };
  format: 'csv' | 'pdf';
}

export default function ExportHealthDataScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);
  const [preferences, setPreferences] = useState<ExportPreferences>({
    dateRange: 'last30',
    customStartDate: '',
    customEndDate: '',
    dataTypes: {
      sleepQuality: true,
      stressLevels: true,
      foodTriggers: false,
      hrv: true
    },
    format: 'csv'
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.id);
    } else {
      navigate("/get-started");
    }
  }, [navigate]);

  // Fetch export preferences
  const { data: savedPreferences } = useQuery({
    queryKey: ['/api/export/preferences', userId],
    enabled: !!userId,
  });

  // Fetch data summary for size calculation
  const { data: dataSummary } = useQuery({
    queryKey: ['/api/export/summary', userId, preferences.dateRange, preferences.customStartDate, preferences.customEndDate],
    enabled: !!userId,
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (exportData: any) => {
      const response = await fetch('/api/export/health-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(exportData)
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `health-data-${preferences.dateRange}-${preferences.format}.${preferences.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });

  // Initialize preferences from saved data
  useEffect(() => {
    if (savedPreferences) {
      setPreferences(prev => ({ ...prev, ...savedPreferences }));
    }
  }, [savedPreferences]);

  const handleDateRangeChange = (range: 'last7' | 'last30' | 'custom') => {
    setPreferences(prev => ({ ...prev, dateRange: range }));
  };

  const handleDataTypeToggle = (type: keyof ExportPreferences['dataTypes']) => {
    setPreferences(prev => ({
      ...prev,
      dataTypes: {
        ...prev.dataTypes,
        [type]: !prev.dataTypes[type]
      }
    }));
  };

  const handleFormatChange = (format: 'csv' | 'pdf') => {
    setPreferences(prev => ({ ...prev, format }));
  };

  const handleCustomDateChange = (field: 'customStartDate' | 'customEndDate', value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    if (!userId) return;
    
    const exportData = {
      userId,
      ...preferences,
      selectedDataTypes: Object.entries(preferences.dataTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type)
    };
    
    exportMutation.mutate(exportData);
  };

  const getDateRangeText = () => {
    switch (preferences.dateRange) {
      case 'last7':
        return 'Last 7 days';
      case 'last30':
        return 'Last 30 days';
      case 'custom':
        if (preferences.customStartDate && preferences.customEndDate) {
          return `${preferences.customStartDate} to ${preferences.customEndDate}`;
        }
        return 'Custom range';
      default:
        return 'Last 30 days';
    }
  };

  const getSelectedDataTypesCount = () => {
    return Object.values(preferences.dataTypes).filter(Boolean).length;
  };

  const getEstimatedSize = () => {
    if (dataSummary?.estimatedSize) {
      return dataSummary.estimatedSize;
    }
    return '~2.4 MB';
  };

  return (
    <div className="min-h-screen bg-[#0F0F23] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-16 pb-6">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Export Health Data</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-4 space-y-6">
        {/* Select Date Range */}
        <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
          <h2 className="text-white font-medium mb-4">Select Date Range</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => handleDateRangeChange('last7')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                preferences.dateRange === 'last7' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 ${
                preferences.dateRange === 'last7' ? 'bg-white' : 'border-2 border-gray-500'
              }`}></div>
              Last 7 days
            </button>
            
            <button
              onClick={() => handleDateRangeChange('last30')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                preferences.dateRange === 'last30' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 ${
                preferences.dateRange === 'last30' ? 'bg-white' : 'border-2 border-gray-500'
              }`}></div>
              Last 30 days
            </button>
            
            <button
              onClick={() => handleDateRangeChange('custom')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                preferences.dateRange === 'custom' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 ${
                preferences.dateRange === 'custom' ? 'bg-white' : 'border-2 border-gray-500'
              }`}></div>
              Custom range
            </button>
          </div>

          {preferences.dateRange === 'custom' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">From</label>
                <input
                  type="date"
                  value={preferences.customStartDate}
                  onChange={(e) => handleCustomDateChange('customStartDate', e.target.value)}
                  className="w-full bg-[#2A3441] border border-[#3A4553] rounded-lg px-3 py-2 text-white placeholder-gray-500"
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">To</label>
                <input
                  type="date"
                  value={preferences.customEndDate}
                  onChange={(e) => handleCustomDateChange('customEndDate', e.target.value)}
                  className="w-full bg-[#2A3441] border border-[#3A4553] rounded-lg px-3 py-2 text-white placeholder-gray-500"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          )}
        </div>

        {/* Select Data Types */}
        <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
          <h2 className="text-white font-medium mb-4">Select Data Types</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => handleDataTypeToggle('sleepQuality')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Moon className="w-5 h-5 text-blue-400 mr-3" />
              <span className="flex-1 text-left text-white">Sleep Quality</span>
              <div className={`w-6 h-6 rounded ${
                preferences.dataTypes.sleepQuality 
                  ? 'bg-[#7C3AED] flex items-center justify-center' 
                  : 'border-2 border-gray-500'
              }`}>
                {preferences.dataTypes.sleepQuality && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => handleDataTypeToggle('stressLevels')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Activity className="w-5 h-5 text-orange-400 mr-3" />
              <span className="flex-1 text-left text-white">Stress Levels</span>
              <div className={`w-6 h-6 rounded ${
                preferences.dataTypes.stressLevels 
                  ? 'bg-[#7C3AED] flex items-center justify-center' 
                  : 'border-2 border-gray-500'
              }`}>
                {preferences.dataTypes.stressLevels && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => handleDataTypeToggle('foodTriggers')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Utensils className="w-5 h-5 text-green-400 mr-3" />
              <span className="flex-1 text-left text-white">Food Triggers</span>
              <div className={`w-6 h-6 rounded ${
                preferences.dataTypes.foodTriggers 
                  ? 'bg-[#7C3AED] flex items-center justify-center' 
                  : 'border-2 border-gray-500'
              }`}>
                {preferences.dataTypes.foodTriggers && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => handleDataTypeToggle('hrv')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Heart className="w-5 h-5 text-red-400 mr-3" />
              <span className="flex-1 text-left text-white">HRV (Heart Rate Variability)</span>
              <div className={`w-6 h-6 rounded ${
                preferences.dataTypes.hrv 
                  ? 'bg-[#7C3AED] flex items-center justify-center' 
                  : 'border-2 border-gray-500'
              }`}>
                {preferences.dataTypes.hrv && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Export Format */}
        <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
          <h2 className="text-white font-medium mb-4">Export Format</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => handleFormatChange('csv')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                preferences.format === 'csv' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 ${
                preferences.format === 'csv' ? 'bg-white' : 'border-2 border-gray-500'
              }`}></div>
              <File className="w-5 h-5 mr-3" />
              <div className="flex-1 text-left">
                <div className="text-white font-medium">CSV File</div>
                <div className="text-gray-400 text-sm">Spreadsheet compatible format</div>
              </div>
            </button>
            
            <button
              onClick={() => handleFormatChange('pdf')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                preferences.format === 'pdf' 
                  ? 'bg-[#7C3AED] text-white' 
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 ${
                preferences.format === 'pdf' ? 'bg-white' : 'border-2 border-gray-500'
              }`}></div>
              <FileText className="w-5 h-5 mr-3" />
              <div className="flex-1 text-left">
                <div className="text-white font-medium">PDF Report</div>
                <div className="text-gray-400 text-sm">Formatted document with charts</div>
              </div>
            </button>
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
          <h2 className="text-white font-medium mb-4">Export Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date Range:</span>
              <span className="text-white">{getDateRangeText()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data Types:</span>
              <span className="text-white">{getSelectedDataTypesCount()} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Format:</span>
              <span className="text-white">{preferences.format.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estimated Size:</span>
              <span className="text-white">{getEstimatedSize()}</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="pb-8">
          <button
            onClick={handleExport}
            disabled={exportMutation.isPending || getSelectedDataTypesCount() === 0}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center transition-colors"
          >
            {exportMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-3" />
                Export Health Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}