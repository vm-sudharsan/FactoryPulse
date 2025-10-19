const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// GET /api/notifications - Get all notifications
router.get('/', notificationController.getAllNotifications);

// GET /api/notifications/unread - Get unread notifications
router.get('/unread', notificationController.getUnreadNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/:id/acknowledge - Acknowledge notification
router.put('/:id/acknowledge', notificationController.acknowledgeNotification);

module.exports = router;
