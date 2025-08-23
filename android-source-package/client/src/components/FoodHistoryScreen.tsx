import React, { useState } from 'react';
import { ArrowLeft, Calendar, Filter, ChevronDown, Utensils, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface Food {
  id: number;
  name: string;
  brand?: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
}

interface FoodLog {
  id: number;
  userId: number;
  foodId: number;
  quantity: number;
  unit: string;
  mealType: string;
  notes?: string;
  loggedAt: string;
  createdAt: string;
  food: Food;
}

export default function FoodHistoryScreen() {
  const [location, navigate] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

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

  // Fetch user food logs
  const { data: foodLogs = [], isLoading } = useQuery({
    queryKey: ['user', 'food-logs', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`/api/user/food-log/recent/${userId}?limit=50`);
      if (!response.ok) throw new Error('Failed to fetch food logs');
      return response.json();
    },
    enabled: !!userId,
  });

  // Filter food logs based on selected criteria
  const filteredLogs = foodLogs.filter((log: FoodLog) => {
    if (selectedFilter !== 'all' && log.mealType !== selectedFilter) return false;
    if (selectedDate && !log.loggedAt.startsWith(selectedDate)) return false;
    return true;
  });

  // Group logs by date
  const groupedLogs: Record<string, FoodLog[]> = filteredLogs.reduce((groups: Record<string, FoodLog[]>, log: FoodLog) => {
    const date = new Date(log.loggedAt).toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMealTypeEmoji = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍪';
      default: return '🍽️';
    }
  };

  const getFoodEmoji = (foodName: string) => {
    const name = foodName.toLowerCase();
    if (name.includes('chicken') || name.includes('salad')) return '🥗';
    if (name.includes('apple')) return '🍎';
    if (name.includes('oatmeal')) return '🥣';
    if (name.includes('yogurt')) return '🥛';
    if (name.includes('banana')) return '🍌';
    if (name.includes('almond')) return '🥜';
    if (name.includes('salmon') || name.includes('fish')) return '🐟';
    if (name.includes('rice')) return '🍚';
    return '🍽️';
  };

  const calculateNutrition = (log: FoodLog) => {
    const multiplier = log.quantity;
    return {
      calories: Math.round(log.food.caloriesPerServing * multiplier),
      protein: Math.round(log.food.proteinPerServing * multiplier),
      carbs: Math.round(log.food.carbsPerServing * multiplier),
      fat: Math.round(log.food.fatPerServing * multiplier),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2D3748] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading food history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D3748] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium text-white">Food History</h1>
        <div className="w-6"></div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3 mb-4">
          {/* Meal Type Filter */}
          <div className="relative flex-1">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-[#4A5568] text-white rounded-xl px-4 py-3 pr-10 appearance-none outline-none"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snacks</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#4A5568] text-white rounded-xl px-4 py-3 outline-none"
            />
          </div>
        </div>

        {/* Summary Stats */}
        {filteredLogs.length > 0 && (
          <div className="bg-[#4A5568] rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Utensils className="w-5 h-5 text-[#7C3AED]" />
              <span className="text-white font-medium">Today's Summary</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-white font-semibold">
                  {filteredLogs.reduce((total: number, log: FoodLog) => total + calculateNutrition(log).calories, 0)}
                </div>
                <div className="text-gray-400 text-xs">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">
                  {filteredLogs.reduce((total: number, log: FoodLog) => total + calculateNutrition(log).protein, 0)}g
                </div>
                <div className="text-gray-400 text-xs">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">
                  {filteredLogs.reduce((total: number, log: FoodLog) => total + calculateNutrition(log).carbs, 0)}g
                </div>
                <div className="text-gray-400 text-xs">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">
                  {filteredLogs.reduce((total: number, log: FoodLog) => total + calculateNutrition(log).fat, 0)}g
                </div>
                <div className="text-gray-400 text-xs">Fat</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Food Logs List */}
      <div className="px-4 pb-32">
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#4A5568] rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-2">No Food Logs Yet</h3>
            <p className="text-gray-400 mb-6">Start tracking your meals to see your food history here.</p>
            <button
              onClick={() => navigate('/add-food')}
              className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#6D28D9] transition-colors"
            >
              Add Food
            </button>
          </div>
        ) : (
          Object.entries(groupedLogs)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, logs]) => (
              <div key={date} className="mb-6">
                {/* Date Header */}
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#7C3AED]" />
                  <h2 className="text-white font-medium">{formatDate(date)}</h2>
                  <div className="text-gray-400 text-sm">
                    {(logs as FoodLog[]).length} {(logs as FoodLog[]).length === 1 ? 'entry' : 'entries'}
                  </div>
                </div>

                {/* Food Entries */}
                <div className="space-y-3">
                  {(logs as FoodLog[]).map((log: FoodLog) => {
                    const nutrition = calculateNutrition(log);
                    return (
                      <div key={log.id} className="bg-[#4A5568] rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center">
                              <span className="text-lg">{getFoodEmoji(log.food.name)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{log.food.name}</div>
                              <div className="text-gray-400 text-sm">
                                {log.quantity} {log.unit} • {nutrition.calories} calories
                              </div>
                              {log.food.brand && (
                                <div className="text-gray-500 text-xs">{log.food.brand}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-gray-400 text-sm mb-1">
                              {getMealTypeEmoji(log.mealType)}
                              <span className="capitalize">{log.mealType}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(log.loggedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Nutrition Details */}
                        <div className="grid grid-cols-4 gap-4 pt-3 border-t border-[#2D3748]">
                          <div className="text-center">
                            <div className="text-white font-semibold text-sm">{nutrition.calories}</div>
                            <div className="text-gray-400 text-xs">Cal</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold text-sm">{nutrition.protein}g</div>
                            <div className="text-gray-400 text-xs">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold text-sm">{nutrition.carbs}g</div>
                            <div className="text-gray-400 text-xs">Carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold text-sm">{nutrition.fat}g</div>
                            <div className="text-gray-400 text-xs">Fat</div>
                          </div>
                        </div>

                        {/* Notes */}
                        {log.notes && (
                          <div className="mt-3 pt-3 border-t border-[#2D3748]">
                            <p className="text-gray-300 text-sm italic">"{log.notes}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => navigate('/add-food')}
          className="w-14 h-14 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6D28D9] transition-colors"
        >
          <Utensils className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}