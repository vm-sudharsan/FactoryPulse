const notificationService = require('../services/notificationService');

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error in getAllNotifications:', error.message);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// Get unread notifications
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUnreadNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error in getUnreadNotifications:', error.message);
    res.status(500).json({ message: 'Failed to fetch unread notifications', error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error in markAsRead:', error.message);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
};

// Acknowledge notification
const acknowledgeNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.acknowledgeNotification(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error in acknowledgeNotification:', error.message);
    res.status(500).json({ message: 'Failed to acknowledge notification', error: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getUnreadNotifications,
  markAsRead,
  acknowledgeNotification,
};
