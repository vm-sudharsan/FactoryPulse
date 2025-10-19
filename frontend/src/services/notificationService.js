import api from './api';

const notificationService = {
  // Get all notifications
  getAllNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Acknowledge notification
  acknowledgeNotification: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/acknowledge`);
    return response.data;
  },
};

export default notificationService;
