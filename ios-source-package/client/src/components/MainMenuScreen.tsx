import React from 'react';
import { ArrowLeft, Brain, TrendingUp, Pill, Settings, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  route: string;
  color: string;
}

export default function MainMenuScreen() {
  const [location, navigate] = useLocation();

  const menuItems: MenuItem[] = [
    {
      id: 'insights',
      icon: <Brain className="w-6 h-6" />,
      title: 'Insights',
      description: 'Patterns about migraines',
      route: '/insights',
      color: 'bg-purple-500'
    },
    {
      id: 'history',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'History & Trends',
      description: 'Track your patterns',
      route: '/history',
      color: 'bg-blue-500'
    },
    {
      id: 'medications',
      icon: <Pill className="w-6 h-6" />,
      title: 'Medications',
      description: 'Track and schedule',
      route: '/medications',
      color: 'bg-green-500'
    },
    {
      id: 'settings',
      icon: <Settings className="w-6 h-6" />,
      title: 'Settings',
      description: 'Account & preferences',
      route: '/settings',
      color: 'bg-gray-500'
    }
  ];

  const handleMenuItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu
          </h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item.route)}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`${item.color} rounded-full p-3 text-white`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}