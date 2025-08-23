import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsScreen() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Get authenticated user ID from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };
  
  const userId = getUserIdFromToken();

  // Fetch notifications
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: [`/api/user/notifications/${userId}`],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log('Fetching notifications for userId:', userId, 'with token:', token ? 'present' : 'missing');
      
      const response = await fetch(`/api/user/notifications/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      console.log('Notifications API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Notifications API error:', errorData);
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Notifications data received:', data);
      return data;
    },
    enabled: !!userId,
    retry: 1
  });

  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/notifications/mark-read/${userId}`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to mark notifications as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/notifications/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/notifications/unread-count/${userId}`] });
    }
  });

  // Auto-mark as read when screen opens
  useEffect(() => {
    if (notifications.length > 0 && notifications.some((n: Notification) => !n.isRead)) {
      markAllReadMutation.mutate();
    }
  }, [notifications]);

  // Format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return notificationTime.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">


      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4 pb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Notifications</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Notifications List */}
      <div className="px-6 pb-20">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">You're all caught up!</h3>
            <p className="text-gray-400 text-center">No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className="bg-gray-800 rounded-2xl p-4 border-l-4 border-purple-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-base mb-2 ${!notification.isRead ? 'text-white font-semibold' : 'text-gray-300 font-medium'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {getRelativeTime(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-purple-400 text-xs">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}