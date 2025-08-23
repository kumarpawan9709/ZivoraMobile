import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Filter, X, Clock, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TrendsSummary {
  totalEpisodes: number;
  avgSeverity: number;
  avgDuration: number;
}

export default function HistoryScreen() {
  const [location, navigate] = useLocation();
  const [timePeriod, setTimePeriod] = useState('30d');
  const [showFilter, setShowFilter] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState({
    severity: 'all',
    triggers: 'all',
    duration: 'all'
  });
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [showEpisodeDetails, setShowEpisodeDetails] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get time greeting based on current time
  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format current time
  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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

  // API calls for dynamic data with time period filtering
  const { data: trendsSummary, isLoading: summaryLoading } = useQuery({
    queryKey: [`/api/user/trends/summary/${userId}`, timePeriod],
    queryFn: () => fetch(`/api/user/trends/summary/${userId}?period=${timePeriod}`)
      .then(res => res.json()),
    enabled: !!userId
  });

  const { data: recentEpisodes = [], isLoading: episodesLoading } = useQuery({
    queryKey: [`/api/user/trends/recent/${userId}`, timePeriod],
    queryFn: async () => {
      const response = await fetch(`/api/user/trends/recent/${userId}?limit=5&period=${timePeriod}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!userId
  });

  const { data: frequencyTrendData = [], isLoading: frequencyLoading } = useQuery({
    queryKey: [`/api/user/trends/frequency/${userId}`, timePeriod],
    queryFn: () => fetch(`/api/user/trends/frequency/${userId}?period=${timePeriod}`)
      .then(res => res.json()),
    enabled: !!userId
  });

  const { data: correlationData, isLoading: correlationLoading } = useQuery({
    queryKey: [`/api/user/trends/correlations/${userId}`, timePeriod],
    queryFn: () => fetch(`/api/user/trends/correlations/${userId}?period=${timePeriod}`)
      .then(res => res.json()),
    enabled: !!userId
  });

  const { data: triggerPatterns = [], isLoading: triggersLoading } = useQuery({
    queryKey: [`/api/user/trends/triggers/${userId}`, timePeriod],
    queryFn: async () => {
      const response = await fetch(`/api/user/trends/triggers/${userId}?period=${timePeriod}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!userId
  });

  // Fetch recent symptom logs
  const { data: recentSymptomLogs = [], isLoading: symptomLogsLoading } = useQuery({
    queryKey: [`/api/user/symptoms/${userId}`],
    queryFn: async () => {
      const response = await fetch(`/api/user/symptoms/${userId}`);
      const data = await response.json();
      return Array.isArray(data) ? data.slice(0, 5) : [];
    },
    enabled: !!userId
  });

  // Process frequency data for chart
  const frequencyData = frequencyTrendData.length > 0 ? frequencyTrendData : [
    { day: 0, count: 0 },
    { day: 6, count: 0 },
    { day: 12, count: 0 },
    { day: 18, count: 0 },
    { day: 24, count: 0 },
    { day: 30, count: 0 }
  ];

  // Export health data function - navigate to export screen
  const handleExportData = () => {
    navigate('/export-data');
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white">History & Trends</h1>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{getTimeGreeting()}, {formatTime()}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowFilter(true)}
          className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <Filter className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Time Period Filter Pills */}
      <div className="px-4 mb-8">
        <div className="flex gap-3">
          <button
            onClick={() => setTimePeriod('30d')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              timePeriod === '30d' 
                ? 'bg-[#6366f1] text-white shadow-lg' 
                : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/40'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimePeriod('3m')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              timePeriod === '3m' 
                ? 'bg-[#6366f1] text-white shadow-lg' 
                : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/40'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimePeriod('6m')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              timePeriod === '6m' 
                ? 'bg-[#6366f1] text-white shadow-lg' 
                : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/40'
            }`}
          >
            6 Months
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="px-4 mb-8">
        <div className="bg-[#1A1F2E] rounded-2xl p-6 border border-[#2A3441]/30">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {summaryLoading ? '...' : trendsSummary?.totalEpisodes || 8}
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Total<br />Episodes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {summaryLoading ? '...' : trendsSummary?.avgSeverity?.toFixed(1) || '2.1'}
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Avg Severity
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {summaryLoading ? '...' : `${trendsSummary?.avgDuration?.toFixed(1) || '4.2'}h`}
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Avg Duration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Frequency Trend Chart */}
      <div className="px-4 mb-8">
        <div className="bg-[#1A1F2E] rounded-2xl p-6 border border-[#2A3441]/30">
          <h3 className="text-lg font-semibold text-white mb-6">Episode Frequency Trend</h3>
          
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frequencyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 3]}
                  tickCount={4}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7, fill: '#8B5CF6', strokeWidth: 2, stroke: '#0F1419' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Symptom Logs */}
      <div className="px-4 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Symptom Logs</h3>
        {symptomLogsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        ) : recentSymptomLogs.length === 0 ? (
          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-[#2A3441]/30 text-center">
            <div className="text-gray-400 text-sm">
              No symptom logs found
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Use "Log Symptoms" to track your symptoms
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSymptomLogs.map((log: any) => (
              <div key={log.id} className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">
                      {log.occurredAt ? new Date(log.occurredAt).toLocaleDateString() : 'Recent'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {log.occurredAt ? new Date(log.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.intensity >= 7 ? 'bg-red-500 text-white' : 
                    log.intensity >= 4 ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
                  }`}>
                    {log.intensity}/10
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400 text-xs">Symptoms: </span>
                    <span className="text-white text-sm">
                      {log.symptoms && log.symptoms.length > 0 ? log.symptoms.join(', ') : 'None'}
                    </span>
                  </div>
                  {log.triggers && log.triggers.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-xs">Triggers: </span>
                      <span className="text-gray-300 text-sm">
                        {log.triggers.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Episodes */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Episodes</h3>
          <div className="flex items-center gap-2">
            {!episodesLoading && recentEpisodes.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            )}
            <span className="text-gray-400 text-sm">
              {timePeriod === '30d' ? 'Last 30 days' : timePeriod === '3m' ? 'Last 3 months' : 'Last 6 months'}
            </span>
          </div>
        </div>
        {episodesLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        ) : recentEpisodes.length === 0 ? (
          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-[#2A3441]/30 text-center">
            <div className="text-gray-400 text-sm">
              No episodes found for {timePeriod === '30d' ? 'the last 30 days' : timePeriod === '3m' ? 'the last 3 months' : 'the last 6 months'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEpisodes.map((episode: any) => {
              const getSeverityColor = (severity: string) => {
                switch (severity.toLowerCase()) {
                  case 'severe': return 'bg-red-500';
                  case 'moderate': return 'bg-orange-500';
                  case 'mild': return 'bg-yellow-500';
                  default: return 'bg-gray-500';
                }
              };

              const getSeverityDots = (severity: string) => {
                const color = getSeverityColor(severity);
                const count = severity.toLowerCase() === 'severe' ? 3 : severity.toLowerCase() === 'moderate' ? 2 : 1;
                return Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < count ? color : 'bg-gray-600'}`}></div>
                ));
              };

              return (
                <div 
                  key={episode.id} 
                  className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30 cursor-pointer hover:bg-[#1A1F2E]/80 transition-colors"
                  onClick={() => {
                    setSelectedEpisode(episode);
                    setShowEpisodeDetails(true);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {new Date(episode.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {episode.severity} • {episode.duration.toFixed(1)} hours
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {getSeverityDots(episode.severity)}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {episode.triggers.map((trigger: string, index: number) => (
                      <span key={index} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg text-xs">
                        {trigger}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Rating: {episode.rating}/3</span>
                    <div className="flex items-center gap-2">
                      <span>Click for details</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Quick action menu could go here
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button 
          onClick={() => navigate('/episode-log')}
          className="w-full mt-4 text-gray-400 text-sm font-medium py-3 border border-[#2A3441]/30 rounded-xl bg-[#1A1F2E] hover:bg-[#1A1F2E]/80 transition-colors flex items-center justify-center gap-2"
        >
          View All Episodes
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Health Correlations */}
      <div className="px-4 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Health Correlations</h3>
        
        {correlationLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        ) : correlationData ? (
          <>
            {/* Heart Rate Variability */}
            <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-600 rounded-md flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-white font-medium text-sm">Heart Rate Variability</span>
                </div>
                <span className="bg-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  {correlationData.heartRate?.strength || 'Strong'}
                </span>
              </div>
              <div className="h-20 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={correlationData.heartRate?.data || [
                    { day: 'Jan 1', value: 25 }, { day: 'Jan 5', value: 28 }, { day: 'Jan 10', value: 32 }, 
                    { day: 'Jan 15', value: 35 }, { day: 'Jan 20', value: 38 }, { day: 'Jan 25', value: 42 }, { day: 'Jan 30', value: 47 }
                  ]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} domain={[15, 50]} />
                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#purpleGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{correlationData.heartRate?.description || 'Episodes occur 73% more often when HRV drops below 25ms'}</span>
                <span className="text-purple-400 font-medium">{correlationData.heartRate?.correlation || '73%'} correlation</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                    <div className="w-2.5 h-1.5 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-white font-medium text-sm">Sleep Quality</span>
                </div>
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  {correlationData.sleep?.strength || 'Moderate'}
                </span>
              </div>
              <div className="h-20 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={correlationData.sleep?.data || [
                    { day: 'Jan 1', value: 40 }, { day: 'Jan 5', value: 35 }, { day: 'Jan 10', value: 30 }, 
                    { day: 'Jan 15', value: 33 }, { day: 'Jan 20', value: 38 }, { day: 'Jan 25', value: 42 }, { day: 'Jan 30', value: 40 }
                  ]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} domain={[15, 50]} />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#blueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-400">
                {correlationData.sleep?.description || 'Risk increases 45% with less than 6 hours of sleep'}
              </div>
            </div>

            {/* Stress Levels */}
            <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-600 rounded-md flex items-center justify-center">
                    <div className="w-1 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-white font-medium text-sm">Stress Levels</span>
                </div>
                <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  {correlationData.stress?.strength || 'Very Strong'}
                </span>
              </div>
              <div className="h-20 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={correlationData.stress?.data || [
                    { day: 'Jan 1', value: 42 }, { day: 'Jan 5', value: 38 }, { day: 'Jan 10', value: 32 }, 
                    { day: 'Jan 15', value: 28 }, { day: 'Jan 20', value: 35 }, { day: 'Jan 25', value: 43 }, { day: 'Jan 30', value: 47 }
                  ]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} domain={[15, 50]} />
                    <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} fill="url(#redGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-400">
                {correlationData.stress?.description || '89% of episodes occur during high stress periods'}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-[#2A3441]/30 text-center">
            <div className="text-gray-400 text-sm">No correlation data available</div>
          </div>
        )}
      </div>

      {/* Episode Details Modal */}
      {showEpisodeDetails && selectedEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D1117] rounded-xl p-6 max-w-md w-full border border-[#2A3441]/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Episode Details</h3>
              <button 
                onClick={() => setShowEpisodeDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-white font-medium text-lg">
                  {new Date(selectedEpisode.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Severity</span>
                  <div className="text-white font-medium">{selectedEpisode.severity}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Duration</span>
                  <div className="text-white font-medium">{selectedEpisode.duration.toFixed(1)} hours</div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Pain Rating</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-white font-medium">{selectedEpisode.rating}/3</div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${
                        i < selectedEpisode.rating ? 'bg-red-500' : 'bg-gray-600'
                      }`}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedEpisode.triggers && selectedEpisode.triggers.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Triggers</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEpisode.triggers.map((trigger: string, index: number) => (
                      <span key={index} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg text-xs">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => {
                    setShowEpisodeDetails(false);
                    navigate('/daily-log');
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Log Similar Episode
                </button>
                <button 
                  onClick={() => setShowEpisodeDetails(false)}
                  className="flex-1 bg-[#1A1F2E] text-gray-300 py-2 px-4 rounded-lg text-sm font-medium border border-[#2A3441]/30 hover:bg-[#1A1F2E]/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Trigger Patterns */}
      <div className="px-4 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Food Trigger Patterns</h3>
        {triggersLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        ) : triggerPatterns.length === 0 ? (
          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-[#2A3441]/30 text-center">
            <div className="text-gray-400 text-sm">
              No trigger patterns found for {timePeriod === '30d' ? 'the last 30 days' : timePeriod === '3m' ? 'the last 3 months' : 'the last 6 months'}
            </div>
          </div>
        ) : (
          <div className="bg-[#1A1F2E] rounded-xl p-4 border border-[#2A3441]/30 space-y-4">
            {triggerPatterns.map((trigger: any, index: number) => {
              const getColorByPercentage = (percentage: number) => {
                if (percentage >= 70) return 'bg-red-500';
                if (percentage >= 50) return 'bg-orange-500';
                if (percentage >= 30) return 'bg-yellow-500';
                return 'bg-blue-500';
              };

              // Fixed trigger patterns with proper colors matching Figma
              const triggerColors = {
                'Dark Chocolate': 'bg-red-500',
                'Red Wine': 'bg-orange-500', 
                'Processed Cheese': 'bg-yellow-500',
                'Citrus Fruits': 'bg-blue-500'
              };

              const getColorForTrigger = (name: string) => {
                return triggerColors[name as keyof typeof triggerColors] || getColorByPercentage(trigger.percentage);
              };

              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{trigger.name}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getColorForTrigger(trigger.name)}`} 
                        style={{ width: `${trigger.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm">{trigger.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export Health Data */}
      <div className="px-4 pb-8">
        <button 
          onClick={handleExportData}
          className="w-full bg-[#1A1F2E] border border-[#2A3441]/30 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-300 hover:bg-[#1A1F2E]/80 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">Export Health Data</span>
        </button>
      </div>

      {/* Filter Dialog */}
      {showFilter && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFilter(false);
            }
          }}
        >
          <div className="bg-[#1A1F2E] rounded-2xl max-w-md w-full border border-[#2A3441]/30 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#2A3441]/30">
              <h3 className="text-lg font-semibold text-white">Filter History</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Severity Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'mild', 'moderate', 'severe'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, severity: level }))}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilters.severity === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'short', 'medium', 'long'].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, duration }))}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilters.duration === duration
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {duration === 'all' ? 'All' : 
                       duration === 'short' ? '< 4 hours' :
                       duration === 'medium' ? '4-12 hours' : '> 12 hours'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Trigger Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'food', 'stress', 'sleep', 'weather', 'hormonal'].map((trigger) => (
                    <button
                      key={trigger}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, triggers: trigger }))}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilters.triggers === trigger
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {trigger.charAt(0).toUpperCase() + trigger.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 p-6 pt-4 border-t border-[#2A3441]/30">
              <button
                onClick={() => {
                  setSelectedFilters({ severity: 'all', triggers: 'all', duration: 'all' });
                }}
                className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setShowFilter(false);
                  // Apply filters logic here
                }}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}