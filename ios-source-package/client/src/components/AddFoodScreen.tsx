import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Scan, Star, Plus, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
  userId: number;
  foodId: number;
  quantity: number;
  unit: string;
  mealType: string;
  notes?: string;
  loggedAt: string;
}

interface NutritionCalculation {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function AddFoodScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('cup');
  const [mealType, setMealType] = useState('Breakfast');
  const [notes, setNotes] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionCalculation>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
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

  // Search foods API
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['foods', 'search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/foods/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search foods');
      return response.json();
    },
    enabled: searchQuery.length > 2,
  });

  // Recent food logs API
  const { data: recentFoods = [], isLoading: recentLoading } = useQuery({
    queryKey: ['user', 'food-logs', 'recent', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/food-log/recent/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch recent foods');
      return response.json();
    },
    enabled: !!userId,
  });

  // User favorites API
  const { data: userFavorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['user', 'favorites', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/favorites/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch favorites');
      return response.json();
    },
    enabled: !!userId,
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async (foodId: number) => {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, foodId }),
      });
      if (!response.ok) throw new Error('Failed to add to favorites');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to Favorites",
        description: "Food item has been added to your favorites.",
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'favorites', userId] });
    },
  });

  // Save food log mutation
  const saveFoodLogMutation = useMutation({
    mutationFn: async (foodLog: FoodLog) => {
      const response = await fetch('/api/user/food-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodLog),
      });
      if (!response.ok) throw new Error('Failed to save food log');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Food Saved Successfully!",
        description: "View your food history to see all logged meals and nutrition data.",
        action: (
          <button
            onClick={() => navigate('/food-history')}
            className="bg-white text-[#7C3AED] px-3 py-1 rounded text-sm font-medium"
          >
            View History
          </button>
        ),
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user', 'food-logs'] });
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] });
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save food log. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate nutrition based on quantity and unit
  useEffect(() => {
    if (selectedFood) {
      const multiplier = quantity;
      setNutrition({
        calories: Math.round(selectedFood.caloriesPerServing * multiplier),
        protein: Math.round(selectedFood.proteinPerServing * multiplier),
        carbs: Math.round(selectedFood.carbsPerServing * multiplier),
        fat: Math.round(selectedFood.fatPerServing * multiplier),
      });
    }
  }, [selectedFood, quantity, selectedUnit]);

  const handleFoodSelect = (food: Food) => {
    console.log('Food selected:', food);
    setSelectedFood(food);
    setSelectedUnit(food.servingUnit);
    setQuantity(1);
  };

  const handleAddToFavorites = (foodId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    addToFavoritesMutation.mutate(foodId);
  };

  const isFavorite = (foodId: number) => {
    return userFavorites.some((fav: any) => fav.foodId === foodId);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleSave = () => {
    if (!selectedFood || !userId) {
      toast({
        title: "Error",
        description: "Please select a food item",
        variant: "destructive",
      });
      return;
    }

    const foodLog: FoodLog = {
      userId,
      foodId: selectedFood.id,
      quantity,
      unit: selectedUnit,
      mealType: mealType.toLowerCase(),
      notes: notes.trim() || undefined,
      loggedAt: new Date().toISOString(),
    };

    saveFoodLogMutation.mutate(foodLog);
  };

  // Process recent foods to extract food details
  const processedRecentFoods = recentFoods.map((log: any) => log.food).filter(Boolean);
  
  const displayFoods = showFavorites ? userFavorites.map((fav: any) => fav.food).filter(Boolean) : 
    searchQuery.length > 2 ? searchResults : 
    processedRecentFoods.slice(0, 10);

  // Food emoji mapping
  const getFoodEmoji = (foodName: string) => {
    if (!foodName || typeof foodName !== 'string') return '🍽️';
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
        <h1 className="text-lg font-medium text-white">Add Food</h1>
        <div className="w-6"></div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search food item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#4A5568] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 outline-none border-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-6 flex space-x-3">
        <button
          disabled
          className="flex-1 bg-[#7C3AED] rounded-xl py-3 flex items-center justify-center opacity-50 cursor-not-allowed"
        >
          <Scan className="w-5 h-5 mr-2" />
          <span className="font-medium">Scan</span>
        </button>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="flex-1 bg-[#4A5568] rounded-xl py-3 flex items-center justify-center text-white"
        >
          <Star className="w-5 h-5 mr-2" />
          <span className="font-medium">Favorites</span>
        </button>
      </div>

      <div className="px-4 pb-32">
        {/* Section Title */}
        <h2 className="text-white font-medium mb-4">
          {showFavorites ? 'Favorites' : searchQuery.length > 2 ? 'Search Results' : 'Recent Foods'}
        </h2>

        {/* Loading State */}
        {(searchLoading || recentLoading || favoritesLoading) && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Food Items List */}
        <div className="space-y-3 mb-6">
          {displayFoods.length === 0 && !searchLoading && !recentLoading && !favoritesLoading ? (
            <div className="text-center py-8 text-gray-400">
              {searchQuery.length > 2 ? 'No foods found. Try a different search term.' : 
               showFavorites ? 'No favorite foods yet.' : 'No recent foods found.'}
            </div>
          ) : (
            displayFoods.map((food: Food, index: number) => (
              food && food.id ? (
                <div key={`${food.id}-${index}`} className="relative">
                  <button
                    onClick={() => handleFoodSelect(food)}
                    className="w-full bg-[#4A5568] rounded-xl p-4 text-left flex items-center justify-between hover:bg-[#5A6578] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center">
                        <span className="text-lg">{getFoodEmoji(food.name || '')}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{food.name || 'Unknown Food'}</div>
                        <div className="text-gray-400 text-sm">
                          {food.servingSize || 1} {food.servingUnit || 'serving'} • {food.caloriesPerServing || 0} calories
                        </div>
                        {food.brand && (
                          <div className="text-gray-500 text-xs">{food.brand}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => handleAddToFavorites(food.id, e)}
                    className="absolute top-3 right-10 p-1 hover:bg-[#2D3748] rounded transition-colors"
                  >
                    <Star className={`w-4 h-4 ${isFavorite(food.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              ) : null
            )).filter(Boolean)
          )}
        </div>

        {/* Add Sample Foods Button for Testing */}
        {!searchQuery && displayFoods.length === 0 && (
          <div className="text-center py-4">
            <button
              onClick={() => setSearchQuery('chicken')}
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors"
            >
              Try searching for "chicken"
            </button>
          </div>
        )}

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="space-y-6 mt-6">
            {/* Selected Food Card */}
            <div className="bg-[#4A5568] rounded-xl p-4 border-2 border-[#7C3AED]">
              <div className="text-white font-medium mb-2">{selectedFood.name}</div>
              <div className="text-gray-400 text-sm mb-4">Selected</div>
              
              {/* Quantity Controls */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 bg-[#2D3748] rounded-full flex items-center justify-center hover:bg-[#1A202C] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 bg-[#2D3748] rounded-full flex items-center justify-center hover:bg-[#1A202C] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  {/* Unit Selector */}
                  <div className="relative">
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="bg-[#2D3748] text-white rounded-lg px-3 py-2 pr-8 appearance-none outline-none"
                    >
                      <option value={selectedFood.servingUnit}>{selectedFood.servingUnit}</option>
                      <option value="cup">cup</option>
                      <option value="slice">slice</option>
                      <option value="piece">piece</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Nutrition Summary */}
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-3">Nutrition Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-white font-semibold">{nutrition.calories}</div>
                    <div className="text-gray-400 text-xs">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{nutrition.protein}g</div>
                    <div className="text-gray-400 text-xs">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{nutrition.carbs}g</div>
                    <div className="text-gray-400 text-xs">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{nutrition.fat}g</div>
                    <div className="text-gray-400 text-xs">Fat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Type */}
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-4">Meal Type</h3>
              <div className="grid grid-cols-4 gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mealType === type
                        ? 'bg-[#7C3AED] text-white'
                        : 'bg-[#4A5568] text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-4">Notes (Optional)</h3>
              <textarea
                placeholder="Add any notes about this food..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#4A5568] rounded-xl p-4 text-white placeholder-gray-400 outline-none resize-none h-20"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saveFoodLogMutation.isPending}
              className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveFoodLogMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}