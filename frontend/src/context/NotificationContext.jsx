import { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react';
import notificationService from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const MAX_NOTIFICATIONS = 30;
  const previousNotificationsRef = useRef([]);
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all notifications with queue behavior (limit to 30)
  const fetchNotifications = useCallback(async (silent = false) => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) return;
    
    try {
      if (!silent) setLoading(true);
      const data = await notificationService.getAllNotifications();
      
      // Limit to 30 most recent notifications (queue behavior)
      const limitedData = data.slice(0, MAX_NOTIFICATIONS);
      
      // Only update state if data has actually changed (prevents flicker)
      const dataChanged = JSON.stringify(limitedData) !== JSON.stringify(previousNotificationsRef.current);
      if (dataChanged) {
        setNotifications(limitedData);
        previousNotificationsRef.current = limitedData;
        
        // Count unread notifications
        const unread = limitedData.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch unread notifications (silent update for polling)
  const fetchUnreadNotifications = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) return [];
    
    try {
      const data = await notificationService.getUnreadNotifications();
      const newUnreadCount = data.length;
      
      // Only update if count changed to prevent unnecessary re-renders
      setUnreadCount(prev => prev !== newUnreadCount ? newUnreadCount : prev);
      
      // If there are new notifications, silently refresh the full list
      if (newUnreadCount > unreadCount) {
        fetchNotifications(true); // Silent refresh
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  }, [isAuthenticated, unreadCount, fetchNotifications]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state smoothly
      setNotifications(prev => {
        const updated = prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
        previousNotificationsRef.current = updated;
        return updated;
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Acknowledge notification
  const acknowledgeNotification = async (notificationId) => {
    try {
      await notificationService.acknowledgeNotification(notificationId);
      
      // Update local state smoothly
      setNotifications(prev => {
        const updated = prev.map(n => n.id === notificationId 
          ? { ...n, isAcknowledged: true, isRead: true, acknowledgedAt: new Date() } 
          : n
        );
        previousNotificationsRef.current = updated;
        return updated;
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error acknowledging notification:', error);
    }
  };

  // Initial fetch and smooth polling for new notifications
  useEffect(() => {
    // Only start fetching if user is authenticated
    if (!isAuthenticated) {
      // Clear data when user logs out
      setNotifications([]);
      setUnreadCount(0);
      previousNotificationsRef.current = [];
      return;
    }

    fetchNotifications(); // Initial fetch with loading state
    
    // Poll for updates every 5 seconds (silent updates to prevent flicker)
    const interval = setInterval(() => {
      fetchUnreadNotifications(); // This will trigger silent refresh if needed
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, fetchUnreadNotifications]);

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
