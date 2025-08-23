import { getToken, onMessage } from "firebase/messaging";
import { getMessagingInstance } from "@/lib/firebase";

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  data?: Record<string, any>;
}

export class NotificationService {
  private messaging: any = null;

  async initialize() {
    this.messaging = await getMessagingInstance();
    return this.messaging !== null;
  }

  // Request notification permission and get FCM token
  async requestPermission(): Promise<string | null> {
    if (!this.messaging) {
      await this.initialize();
    }

    if (!this.messaging) {
      console.warn("FCM not supported in this browser");
      return null;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // You'll need to add this to Firebase console
      });

      if (token) {
        console.log('FCM registration token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      return null;
    }
  }

  // Listen for foreground messages
  onMessage(callback: (payload: NotificationPayload) => void) {
    if (!this.messaging) return () => {};

    return onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      const notification: NotificationPayload = {
        title: payload.notification?.title || 'Zivora',
        body: payload.notification?.body || '',
        icon: payload.notification?.icon,
        clickAction: payload.notification?.click_action || undefined,
        data: payload.data
      };

      callback(notification);
    });
  }

  // Show local notification
  showNotification(payload: NotificationPayload) {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          badge: '/favicon.ico',
          data: payload.data,
          tag: 'zivora-notification'
        });
      });
    }
  }

  // Save FCM token to backend
  async saveTokenToServer(token: string, userId: string) {
    try {
      const response = await fetch('/api/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token, userId })
      });

      if (!response.ok) {
        throw new Error('Failed to save FCM token');
      }

      console.log('FCM token saved to server');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }
}

export const notificationService = new NotificationService();