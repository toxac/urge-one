// src/stores/notificationStore.ts
import { atom } from 'nanostores';

export interface Notification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

// handles multiple notifications
export const notificationStore = atom<Notification[]>([]);

// Track timeout IDs by notification ID
const dismissTimeouts = new Map<string, number>();

export const notify = {
  success: (message: string, title?: string, duration: number = 3000, position: string = "bottom-right") => {
    addNotification({ type: 'success', message, title, duration });
  },
  
  error: (message: string, title?: string, duration: number = 5000, position: string = "bottom-right") => {
    addNotification({ type: 'error', message, title, duration });
  },
  
  warning: (message: string, title?: string, duration: number = 4000, position: string = "bottom-right") => {
    addNotification({ type: 'warning', message, title, duration });
  },
  
  info: (message: string, title?: string, duration: number = 3000, position: string = "bottom-right") => {
    addNotification({ type: 'info', message, title, duration });
  },
};

// Adds a new notification to notification store array
function addNotification(notification: Notification) {
  const id = Math.random().toString(36).substring(2, 9);
  const notificationWithId = { 
    ...notification, 
    id,
    position: notification.position || 'bottom-center'
  };
  
  // Add to store
  const currentNotifications = notificationStore.get();
  notificationStore.set([...currentNotifications, notificationWithId]);
  
  // Set timeout for auto-dismiss if duration is provided
  if (notification.duration && notification.duration > 0) {
    const timeoutId = setTimeout(() => {
      removeNotification(id);
    }, notification.duration) as unknown as number;
    
    dismissTimeouts.set(id, timeoutId);
  }
  
  return id;
}

// removes a notification from notification store 
export const removeNotification = (id: string) => {
  // Clear timeout if exists
  if (dismissTimeouts.has(id)) {
    clearTimeout(dismissTimeouts.get(id));
    dismissTimeouts.delete(id);
  }
  
  // Remove from store
  const currentNotifications = notificationStore.get();
  notificationStore.set(currentNotifications.filter(n => n.id !== id));
};


export const clearAllNotifications = () => {
  // Clear all timeouts
  dismissTimeouts.forEach((timeoutId, id) => {
    clearTimeout(timeoutId);
  });
  dismissTimeouts.clear();
  
  // Clear store
  notificationStore.set([]);
};