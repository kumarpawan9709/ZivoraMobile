import { useQuery } from "@tanstack/react-query";

interface NotificationBadgeProps {
  children: React.ReactNode;
  userId: number | null;
}

export default function NotificationBadge({ children, userId }: NotificationBadgeProps) {
  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: [`/api/user/notifications/unread-count/${userId}`],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log('Fetching unread count for userId:', userId);
      
      const response = await fetch(`/api/user/notifications/unread-count/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error('Unread count API error:', response.status);
        return { count: 0 }; // Return default instead of throwing
      }
      
      const data = await response.json();
      console.log('Unread count data:', data);
      return data;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1
  });

  const unreadCount = unreadData?.count || 0;

  return (
    <div className="relative">
      {children}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
}