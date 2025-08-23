import React from 'react';
import { useLocation } from 'wouter';
import { Home, Calendar, TrendingUp, History, BookOpen } from 'lucide-react';

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'daily-log',
      label: 'Daily Log',
      icon: Calendar,
      path: '/daily-log'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: TrendingUp,
      path: '/insights'
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      path: '/history'
    },
    {
      id: 'education',
      label: 'Education',
      icon: BookOpen,
      path: '/education'
    }
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-gray-700 px-6 py-4 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center space-y-1"
            >
              <Icon className={`w-6 h-6 ${active ? 'text-[#6366F1]' : 'text-gray-400'}`} />
              <span className={`text-xs ${active ? 'text-[#6366F1]' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}