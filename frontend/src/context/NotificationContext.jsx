import { createContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
      
      // Count unread notifications
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread notifications
  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadNotifications();
      setUnreadCount(data.length);
      return data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Acknowledge notification
  const acknowledgeNotification = async (notificationId) => {
    try {
      await notificationService.acknowledgeNotification(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId 
          ? { ...n, isAcknowledged: true, isRead: true, acknowledgedAt: new Date() } 
          : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error acknowledging notification:', error);
    }
  };

  // Poll for new notifications every 10 seconds
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchUnreadNotifications();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadNotifications,
        markAsRead,
        acknowledgeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
