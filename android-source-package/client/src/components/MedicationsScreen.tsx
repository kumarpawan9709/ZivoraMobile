import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import BottomNavigation from './BottomNavigation';

interface UserMedication {
  id: number;
  userId: number;
  name: string;
  dosage: string;
  type: 'preventive' | 'acute' | 'triptan' | 'otc';
  isActive: boolean;
  createdAt: string;
}

interface CommonMedication {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'acute' | 'triptan' | 'otc';
  icon: string;
  color: string;
}

interface MedicationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function MedicationsScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [customMedication, setCustomMedication] = useState({
    name: '',
    dosage: '',
    type: 'acute' as 'acute' | 'preventive' | 'triptan' | 'otc'
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedMedication, setExpandedMedication] = useState<number | null>(null);

  // Get user ID from token (assuming user ID 2 for authenticated user)
  const userId = 2;

  // Set authentication token if not present
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdEBtbS5jb20iLCJpYXQiOjE3NTA2NTMzNTF9.g0k5-gPEuwoxWzyZtA8o4xgD3tS2qEf9118ISIEtu-k');
    }
  }, []);

  // Fetch user medications with authentication
  const { data: userMedications = [], isLoading } = useQuery<UserMedication[]>({
    queryKey: [`/api/users/${userId}/medications`],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/medications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch medications');
      return response.json();
    },
    enabled: true
  });

  // Add common medication mutation
  const addMedicationMutation = useMutation({
    mutationFn: async (medication: CommonMedication) => {
      const response = await fetch(`/api/users/${userId}/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: medication.name,
          dosage: '50mg',
          type: medication.type,
          isActive: true
        })
      });
      if (!response.ok) throw new Error('Failed to add medication');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/medications`] });
    }
  });

  // Add custom medication mutation
  const addCustomMedicationMutation = useMutation({
    mutationFn: async (medicationData: typeof customMedication) => {
      const response = await fetch(`/api/users/${userId}/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: medicationData.name,
          dosage: medicationData.dosage,
          type: medicationData.type,
          isActive: true
        })
      });
      if (!response.ok) throw new Error('Failed to add custom medication');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/medications`] });
      setShowAddForm(false);
      setCustomMedication({ name: '', dosage: '', type: 'acute' });
    }
  });

  // Remove medication mutation
  const removeMedicationMutation = useMutation({
    mutationFn: async (medicationId: number) => {
      const response = await fetch(`/api/users/${userId}/medications/${medicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to remove medication');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/medications`] });
      setExpandedMedication(null);
    }
  });

  // Common migraine medications with all 4 categories and extensive sample data
  const commonMedications: CommonMedication[] = [
    // Acute medications
    {
      id: 'ibuprofen',
      name: 'Ibuprofen',
      description: 'NSAID • Immediate relief',
      type: 'acute',
      icon: '💊',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'acetaminophen',
      name: 'Acetaminophen',
      description: 'Pain reliever • Fast acting',
      type: 'acute',
      icon: '💊',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'aspirin',
      name: 'Aspirin',
      description: 'Anti-inflammatory • Quick relief',
      type: 'acute',
      icon: '💊',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'naproxen',
      name: 'Naproxen',
      description: 'Long-lasting NSAID',
      type: 'acute',
      icon: '💊',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'diclofenac',
      name: 'Diclofenac',
      description: 'Strong anti-inflammatory',
      type: 'acute',
      icon: '💊',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'ketorolac',
      name: 'Ketorolac',
      description: 'Powerful NSAID injection',
      type: 'acute',
      icon: '💉',
      color: 'bg-[#8B5CF6]'
    },
    // Preventive medications
    {
      id: 'topiramate',
      name: 'Topiramate',
      description: 'Anticonvulsant • Daily prevention',
      type: 'preventive',
      icon: '🛡️',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'propranolol',
      name: 'Propranolol',
      description: 'Beta-blocker • Prevention',
      type: 'preventive',
      icon: '🛡️',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'amitriptyline',
      name: 'Amitriptyline',
      description: 'Tricyclic • Daily prevention',
      type: 'preventive',
      icon: '💊',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'valproate',
      name: 'Valproate',
      description: 'Anticonvulsant • Prevention',
      type: 'preventive',
      icon: '💊',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'metoprolol',
      name: 'Metoprolol',
      description: 'Beta-blocker • Daily use',
      type: 'preventive',
      icon: '🛡️',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'aimovig',
      name: 'Aimovig (Erenumab)',
      description: 'CGRP inhibitor • Monthly injection',
      type: 'preventive',
      icon: '💉',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'emgality',
      name: 'Emgality (Galcanezumab)',
      description: 'CGRP inhibitor • Monthly injection',
      type: 'preventive',
      icon: '💉',
      color: 'bg-[#3B82F6]'
    },
    // Triptan medications
    {
      id: 'sumatriptan',
      name: 'Sumatriptan',
      description: 'Most common triptan • Fast relief',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    {
      id: 'rizatriptan',
      name: 'Rizatriptan',
      description: 'Dissolving tablet • Rapid action',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    {
      id: 'zolmitriptan',
      name: 'Zolmitriptan',
      description: 'Nasal spray available • Effective',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    {
      id: 'eletriptan',
      name: 'Eletriptan',
      description: 'High efficacy • Targeted relief',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    {
      id: 'almotriptan',
      name: 'Almotriptan',
      description: 'Well tolerated • Gentle option',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    {
      id: 'naratriptan',
      name: 'Naratriptan',
      description: 'Long-lasting effect • Extended relief',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    {
      id: 'frovatriptan',
      name: 'Frovatriptan',
      description: 'Longest half-life • Sustained action',
      type: 'triptan',
      icon: '⚡',
      color: 'bg-[#EC4899]'
    },
    // OTC medications
    {
      id: 'excedrin',
      name: 'Excedrin Migraine',
      description: 'Combination formula • Over-the-counter',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    },
    {
      id: 'advil-migraine',
      name: 'Advil Migraine',
      description: 'Ibuprofen formula • Liquid gels',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    },
    {
      id: 'tylenol',
      name: 'Tylenol',
      description: 'Acetaminophen • Gentle relief',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    },
    {
      id: 'aleve',
      name: 'Aleve',
      description: 'Naproxen • 12-hour relief',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    },
    {
      id: 'bc-powder',
      name: 'BC Powder',
      description: 'Fast-acting powder • Quick absorption',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    },
    {
      id: 'goodys-powder',
      name: 'Goody\'s Powder',
      description: 'Aspirin + caffeine • Powder form',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    },
    {
      id: 'motrin',
      name: 'Motrin IB',
      description: 'Ibuprofen • Anti-inflammatory',
      type: 'otc',
      icon: '🟡',
      color: 'bg-[#F59E0B]'
    }
  ];

  // Medication categories matching Figma design
  const categories: MedicationCategory[] = [
    {
      id: 'acute',
      name: 'Acute',
      description: 'Immediate relief',
      icon: '⚡',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'preventive',
      name: 'Preventive',
      description: 'Daily prevention',
      icon: '🛡️',
      color: 'bg-[#3B82F6]'
    },
    {
      id: 'triptans',
      name: 'Triptans',
      description: 'Targeted relief',
      icon: '💊',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 'otc',
      name: 'OTC',
      description: 'Over-the-counter',
      icon: '💊',
      color: 'bg-[#F59E0B]'
    }
  ];

  const handleAddMedication = (medication: CommonMedication) => {
    addMedicationMutation.mutate(medication);
  };

  const handleAddCustomMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMedication.name && customMedication.dosage) {
      addCustomMedicationMutation.mutate(customMedication);
    }
  };

  // Filter medications based on selected category
  const filteredMedications = selectedCategory 
    ? commonMedications.filter(med => med.type === selectedCategory)
    : commonMedications;

  const handleCategoryClick = (categoryType: string) => {
    setSelectedCategory(selectedCategory === categoryType ? null : categoryType);
  };

  const handleMedicationClick = (medicationId: number) => {
    setExpandedMedication(expandedMedication === medicationId ? null : medicationId);
  };

  const handleRemoveMedication = (medicationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeMedicationMutation.mutate(medicationId);
  };

  const getMedicationIcon = (name: string, type: string) => {
    // Map specific medications to their exact icons and colors from Figma
    const iconMap: { [key: string]: { icon: string; color: string } } = {
      'Sumatriptan': { icon: '💊', color: 'bg-[#8B5CF6]' },
      'Rizatriptan': { icon: '💊', color: 'bg-[#EC4899]' },
      'Propranolol': { icon: '💊', color: 'bg-[#3B82F6]' }
    };
    return iconMap[name] || { icon: '💊', color: type === 'preventive' ? 'bg-[#3B82F6]' : 'bg-[#8B5CF6]' };
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1E293B]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">
          Medications
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        {/* My Medications Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">My Medications</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#6366F1] hover:bg-[#5855EB] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Custom
            </button>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#1E293B] rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : userMedications.length > 0 ? (
              userMedications.map((medication) => {
                const iconData = getMedicationIcon(medication.name, medication.type);
                const description = medication.type === 'acute' ? 'Acute treatment' : 'Preventive';
                const isExpanded = expandedMedication === medication.id;
                return (
                  <div key={medication.id} className="bg-[#1E293B] rounded-xl overflow-hidden">
                    <div 
                      onClick={() => handleMedicationClick(medication.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#334155] transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${iconData.color} rounded-xl flex items-center justify-center text-2xl`}>
                          {iconData.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{medication.name}</h3>
                          <p className="text-sm text-gray-400">{medication.dosage} • {description}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 bg-[#0F172A] border-t border-gray-700">
                        <div className="mt-4">
                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-3">
                              <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Medication Type</span>
                                <p className="text-white font-medium capitalize">{medication.type}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${medication.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                  <p className={`font-medium ${medication.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                    {medication.isActive ? 'Active' : 'Inactive'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Dosage</span>
                                <p className="text-white font-medium">{medication.dosage}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Added</span>
                                <p className="text-white font-medium">{new Date(medication.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <div className="flex justify-end">
                            <button
                              onClick={(e) => handleRemoveMedication(medication.id, e)}
                              disabled={removeMedicationMutation.isPending}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              {removeMedicationMutation.isPending ? 'Removing...' : 'Remove'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-[#1E293B] rounded-xl p-4 text-center">
                <p className="text-gray-400">No medications added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Common Migraine Medications Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Common Migraine Medications</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-[#6366F1] hover:text-[#5855EB] transition-colors"
              >
                Show All
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
            {filteredMedications.map((medication) => (
              <div key={medication.id} className="bg-[#1E293B] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${medication.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {medication.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{medication.name}</h3>
                    <p className="text-sm text-gray-400">{medication.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddMedication(medication)}
                  disabled={addMedicationMutation.isPending}
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#5855EB] rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {addMedicationMutation.isPending ? 'Adding...' : 'Add'}
                </button>
              </div>
            ))}
            {filteredMedications.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No medications found for this category
              </div>
            )}
          </div>
        </div>

        {/* Browse by Category Section */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`bg-[#1E293B] rounded-xl p-4 flex items-center justify-between transition-all duration-200 text-left ${
                  selectedCategory === category.id 
                    ? 'border-2 border-[#6366F1] bg-[#6366F1]/10' 
                    : 'border-2 border-transparent hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center text-xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-xs text-gray-400">{category.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Medication Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Add Custom Medication</h3>
            <form onSubmit={handleAddCustomMedication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={customMedication.name}
                  onChange={(e) => setCustomMedication({...customMedication, name: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  placeholder="Enter medication name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={customMedication.dosage}
                  onChange={(e) => setCustomMedication({...customMedication, dosage: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  placeholder="e.g., 50mg, 10ml"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={customMedication.type}
                  onChange={(e) => setCustomMedication({...customMedication, type: e.target.value as 'acute' | 'preventive' | 'triptan' | 'otc'})}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="acute">Acute</option>
                  <option value="preventive">Preventive</option>
                  <option value="triptan">Triptans</option>
                  <option value="otc">OTC</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addCustomMedicationMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#5855EB] rounded-lg text-white transition-colors disabled:opacity-50"
                >
                  {addCustomMedicationMutation.isPending ? 'Adding...' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
}