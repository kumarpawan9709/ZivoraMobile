import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, Activity, Brain, Heart, Eye, Moon, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import BottomNavigation from './BottomNavigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TriggerRisk {
  trigger: string;
  percentage: number;
  note: string;
}

interface AnalysisConfidence {
  confidencePercent: number;
  daysTracked: number;
}

interface StressSleepData {
  stressLevel: string;
  avgSleepHours: number;
  insightNote: string;
}

interface RiskPrediction {
  title: string;
  risk: string;
  percentage: number;
  note: string;
}

interface Recommendation {
  title: string;
  note: string;
}

export default function AnalysisReportScreen() {
  const [location, navigate] = useLocation();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

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

  // API Queries
  const { data: analysisConfidence, isLoading: isLoadingConfidence } = useQuery<AnalysisConfidence>({
    queryKey: ['analysis-confidence', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/analysis-confidence/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch analysis confidence");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: triggerRisks, isLoading: isLoadingTriggers } = useQuery<TriggerRisk[]>({
    queryKey: ['triggers', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/triggers/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch triggers");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: stressSleepData, isLoading: isLoadingStressSleep } = useQuery<StressSleepData>({
    queryKey: ['stress-sleep', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/stress-sleep/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch stress sleep data");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: riskPredictions, isLoading: isLoadingPredictions } = useQuery<RiskPrediction[]>({
    queryKey: ['risk-predictions', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/risk-prediction/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch risk predictions");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<Recommendation[]>({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/insight/recommendations/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      return response.json();
    },
    enabled: !!userId,
  });

  // Chart configurations
  const migraineTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Migraine Episodes',
        data: [3, 5, 2, 4],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const triggerAnalysisData = {
    labels: triggerRisks?.map(t => t.trigger) || ['Dark Chocolate', 'Stress', 'Lack of Sleep'],
    datasets: [
      {
        label: 'Trigger Risk %',
        data: triggerRisks?.map(t => t.percentage) || [85, 72, 68],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const sleepPatternData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sleep Hours',
        data: [7.5, 6.2, 8.1, 7.8, 6.5, 8.5, 7.2],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      },
    ],
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          padding: 20,
        },
      },
    },
  };

  const handleExportReport = () => {
    // Navigate to export screen with analysis report context
    navigate('/export-data?type=analysis-report');
  };

  const handleShareReport = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Zivora Analysis Report',
        text: 'Check out my migraine analysis report from Zivora',
        url: window.location.href,
      });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRecommendationIcon = (title: string) => {
    if (title.toLowerCase().includes('sleep')) return <Moon className="w-4 h-4" />;
    if (title.toLowerCase().includes('stress')) return <Brain className="w-4 h-4" />;
    if (title.toLowerCase().includes('food') || title.toLowerCase().includes('avoid')) return <AlertCircle className="w-4 h-4" />;
    if (title.toLowerCase().includes('exercise')) return <Activity className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getRecommendationColor = (title: string) => {
    if (title.toLowerCase().includes('sleep')) return 'bg-blue-500';
    if (title.toLowerCase().includes('stress')) return 'bg-purple-500';
    if (title.toLowerCase().includes('food') || title.toLowerCase().includes('avoid')) return 'bg-red-500';
    if (title.toLowerCase().includes('exercise')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 sticky top-0 z-10">
        <button
          onClick={() => navigate('/insights')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Analysis Report</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareReport}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">Time Range:</span>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Analysis Confidence Summary */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Analysis Summary</h3>
              <p className="text-gray-400 text-sm">AI-powered insights based on your data</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {isLoadingConfidence ? '--' : `${analysisConfidence?.confidencePercent || 75}%`}
              </div>
              <div className="text-gray-400 text-sm">Confidence Level</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {isLoadingConfidence ? '--' : `${analysisConfidence?.daysTracked || 0}`}
              </div>
              <div className="text-gray-400 text-sm">Days Tracked</div>
            </div>
          </div>
        </div>

        {/* Migraine Trend Chart */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Migraine Trends
          </h3>
          <div className="h-64">
            <Line data={migraineTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Risk Predictions */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Risk Predictions
          </h3>
          <div className="space-y-3">
            {isLoadingPredictions ? (
              <div className="text-gray-400">Loading predictions...</div>
            ) : (
              riskPredictions?.map((prediction, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{prediction.title}</h4>
                    <span className={`text-sm font-semibold ${getRiskColor(prediction.risk)}`}>
                      {prediction.risk} Risk
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          prediction.risk.toLowerCase() === 'high' ? 'bg-red-500' :
                          prediction.risk.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${prediction.percentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-400">{prediction.percentage}%</span>
                  </div>
                  <p className="text-gray-400 text-sm">{prediction.note}</p>
                </div>
              )) || []
            )}
          </div>
        </div>

        {/* Trigger Analysis Chart */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Trigger Analysis
          </h3>
          <div className="h-64">
            <Bar data={triggerAnalysisData} options={chartOptions} />
          </div>
        </div>

        {/* Sleep Pattern Analysis */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Moon className="w-5 h-5 mr-2" />
            Sleep Pattern Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48">
              <Bar data={sleepPatternData} options={chartOptions} />
            </div>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Average Sleep</div>
                <div className="text-xl font-bold text-white">
                  {isLoadingStressSleep ? '--' : `${stressSleepData?.avgSleepHours || 7.2}h`}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Sleep Quality</div>
                <div className="text-xl font-bold text-white">Good</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Risk Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={riskDistributionData} options={doughnutOptions} />
          </div>
        </div>

        {/* Stress & Lifestyle Factors */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Stress & Lifestyle Factors
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-lg font-bold text-white mb-1">
                {isLoadingStressSleep ? '--' : stressSleepData?.stressLevel || 'Moderate'}
              </div>
              <div className="text-gray-400 text-sm">Stress Level</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-lg font-bold text-white mb-1">3.2</div>
              <div className="text-gray-400 text-sm">Exercise Hours/Week</div>
            </div>
          </div>
          {stressSleepData?.insightNote && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm">{stressSleepData.insightNote}</p>
            </div>
          )}
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {isLoadingRecommendations ? (
              <div className="text-gray-400">Loading recommendations...</div>
            ) : (
              recommendations?.map((recommendation, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 ${getRecommendationColor(recommendation.title)} rounded-full flex-shrink-0 mt-0.5`}>
                      {getRecommendationIcon(recommendation.title)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-2">{recommendation.title}</h4>
                      <p className="text-gray-400 text-sm">{recommendation.note}</p>
                    </div>
                  </div>
                </div>
              )) || []
            )}
          </div>
        </div>

        {/* Key Insights Summary */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Key Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Migraine frequency decreased by 23% this month</p>
                <p className="text-gray-400 text-sm">Compared to last month's data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Sleep quality correlation with episodes is strong</p>
                <p className="text-gray-400 text-sm">Episodes are 67% more likely after poor sleep</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Dark chocolate is your highest risk trigger</p>
                <p className="text-gray-400 text-sm">85% correlation with migraine episodes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Generation Info */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <h4 className="text-white font-medium">Report Generated</h4>
              <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            This analysis is based on your tracked data and machine learning algorithms. 
            Always consult with your healthcare provider for medical decisions.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}