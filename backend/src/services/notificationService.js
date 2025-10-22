const { getNotificationModel } = require('../models/Notification');
const { getMachineModel } = require('../models/Machine');
require('dotenv').config();

class NotificationService {
  constructor() {
    this.dbType = process.env.DB_TYPE || 'mongodb';
    this.unacknowledgedNotifications = new Map(); // machineId -> { notificationId, timestamp }
    this.autoShutdownTimeout = 2 * 60 * 1000; // 2 minutes in milliseconds
    this.checkInterval = null;
  }

  // Get default thresholds (fallback if machine doesn't have custom thresholds)
  getDefaultThresholds() {
    return {
      temperature: { warning: 10, critical: 25 },
      vibration: { warning: 2, critical: 5 },
      current: { warning: 5, critical: 10 }
    };
  }

  // Analyze sensor data and determine severity using machine-specific thresholds
  analyzeSensorData(sensorData, machineThresholds = null) {
    const thresholds = machineThresholds || this.getDefaultThresholds();
    let severity = 'normal';
    const issues = [];

    // Check temperature
    if (sensorData.temperature >= thresholds.temperature.critical) {
      severity = 'critical';
      issues.push(`Temperature critically high (${sensorData.temperature.toFixed(1)}°C)`);
    } else if (sensorData.temperature >= thresholds.temperature.warning) {
      if (severity !== 'critical') severity = 'warning';
      issues.push(`Temperature elevated (${sensorData.temperature.toFixed(1)}°C)`);
    }

    // Check vibration
    if (sensorData.vibration >= thresholds.vibration.critical) {
      severity = 'critical';
      issues.push(`Vibration critically high (${sensorData.vibration.toFixed(1)} Hz)`);
    } else if (sensorData.vibration >= thresholds.vibration.warning) {
      if (severity !== 'critical') severity = 'warning';
      issues.push(`Vibration elevated (${sensorData.vibration.toFixed(1)} Hz)`);
    }

    // Check current
    if (sensorData.current >= thresholds.current.critical) {
      severity = 'critical';
      issues.push(`Current critically high (${sensorData.current.toFixed(1)} A)`);
    } else if (sensorData.current >= thresholds.current.warning) {
      if (severity !== 'critical') severity = 'warning';
      issues.push(`Current elevated (${sensorData.current.toFixed(1)} A)`);
    }

    return { severity, issues };
  }

  // Create a notification
  async createNotification(machineId, machineName, sensorData, severity, issues) {
    try {
      if (severity === 'critical' && this.unacknowledgedNotifications.has(machineId)) {
        return null;
      }

      const NotificationModel = getNotificationModel();
      const message = `Machine requires maintenance check. Issues: ${issues.join(', ')}`;

      const notificationData = {
        machineId,
        machineName,
        message,
        severity,
        sensorData: {
          temperature: sensorData.temperature,
          vibration: sensorData.vibration,
          current: sensorData.current,
        },
        isRead: false,
        isAcknowledged: false,
        createdAt: new Date(),
      };

      let notification;
      if (this.dbType === 'mongodb') {
        notification = await NotificationModel.create(notificationData);
      } else {
        notification = await NotificationModel.create(notificationData);
      }

      // Track unacknowledged critical notifications
      if (severity === 'critical') {
        const notifId = notification._id || notification.id;
        this.unacknowledgedNotifications.set(machineId, {
          notificationId: notifId.toString(),
          timestamp: Date.now(),
          machineName,
        });
        console.log(`CRITICAL notification: ${machineName} - Auto-shutdown in 2 minutes`);
      }

      return this.convertToDto(notification);
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw error;
    }
  }

  // Get all notifications
  async getAllNotifications() {
    try {
      const NotificationModel = getNotificationModel();

      if (this.dbType === 'mongodb') {
        const notifications = await NotificationModel
          .find()
          .sort({ createdAt: -1 })
          .lean();
        return notifications.map(n => this.convertToDto(n));
      } else {
        const notifications = await NotificationModel.findAll({
          order: [['createdAt', 'DESC']],
        });
        return notifications.map(n => this.convertToDto(n.toJSON()));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      throw error;
    }
  }

  // Get unread notifications
  async getUnreadNotifications() {
    try {
      const NotificationModel = getNotificationModel();

      if (this.dbType === 'mongodb') {
        const notifications = await NotificationModel
          .find({ isRead: false })
          .sort({ createdAt: -1 })
          .lean();
        return notifications.map(n => this.convertToDto(n));
      } else {
        const notifications = await NotificationModel.findAll({
          where: { isRead: false },
          order: [['createdAt', 'DESC']],
        });
        return notifications.map(n => this.convertToDto(n.toJSON()));
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error.message);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const NotificationModel = getNotificationModel();

      if (this.dbType === 'mongodb') {
        const notification = await NotificationModel.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );
        return notification ? this.convertToDto(notification) : null;
      } else {
        const notification = await NotificationModel.findByPk(notificationId);
        if (notification) {
          notification.isRead = true;
          await notification.save();
          return this.convertToDto(notification.toJSON());
        }
        return null;
      }
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      throw error;
    }
  }

  // Acknowledge notification
  async acknowledgeNotification(notificationId) {
    try {
      const NotificationModel = getNotificationModel();

      if (this.dbType === 'mongodb') {
        const notification = await NotificationModel.findByIdAndUpdate(
          notificationId,
          { 
            isAcknowledged: true, 
            acknowledgedAt: new Date(),
            isRead: true 
          },
          { new: true }
        );
        
        if (notification) {
          this.unacknowledgedNotifications.delete(notification.machineId);
          return this.convertToDto(notification);
        }
        return null;
      } else {
        const notification = await NotificationModel.findByPk(notificationId);
        if (notification) {
          notification.isAcknowledged = true;
          notification.acknowledgedAt = new Date();
          notification.isRead = true;
          await notification.save();
          
          this.unacknowledgedNotifications.delete(notification.machineId);
          return this.convertToDto(notification.toJSON());
        }
        return null;
      }
    } catch (error) {
      console.error('Error acknowledging notification:', error.message);
      throw error;
    }
  }

  // Check for unacknowledged notifications and auto-shutdown machines
  async checkUnacknowledgedNotifications() {
    const now = Date.now();
    const machineModel = getMachineModel();
    // Lazy-load thingSpeakService to avoid circular dependency
    const thingSpeakService = require('./thingSpeakService');

    for (const [machineId, data] of this.unacknowledgedNotifications.entries()) {
      const timeSinceNotification = now - data.timestamp;

      if (timeSinceNotification >= this.autoShutdownTimeout) {
        try {
          console.log(`AUTO-SHUTDOWN: ${data.machineName}`);

          // Turn off the machine
          let machine;
          if (this.dbType === 'mongodb') {
            machine = await machineModel.findById(machineId);
            if (machine && machine.status === 'on') {
              machine.status = 'off';
              await machine.save();
              
              await thingSpeakService.updateMachineStatus(machine.thingspeakFieldId, 'off');
              
              const NotificationModel = getNotificationModel();
              await NotificationModel.create({
                machineId,
                machineName: data.machineName,
                message: `Machine automatically shut down after 2 minutes without acknowledgment of critical alert`,
                severity: 'critical',
                sensorData: null,
                isRead: false,
                isAcknowledged: true,
                acknowledgedAt: new Date(),
                createdAt: new Date(),
              });
            }
          } else {
            machine = await machineModel.findByPk(machineId);
            if (machine && machine.status === 'on') {
              machine.status = 'off';
              await machine.save();
              
              await thingSpeakService.updateMachineStatus(machine.thingspeakFieldId, 'off');
              
              // Create a shutdown notification
              const NotificationModel = getNotificationModel();
              await NotificationModel.create({
                machineId,
                machineName: data.machineName,
                message: `Machine automatically shut down after 2 minutes without acknowledgment of critical alert`,
                severity: 'critical',
                sensorData: null,
                isRead: false,
                isAcknowledged: true,
                acknowledgedAt: new Date(),
                createdAt: new Date(),
              });
            }
          }

          // Remove from tracking
          this.unacknowledgedNotifications.delete(machineId);
        } catch (error) {
          console.error(`Error auto-shutting down machine ${machineId}:`, error.message);
        }
      }
    }
  }

  startAutoShutdownMonitor() {
    if (this.checkInterval) {
      return;
    }

    this.checkInterval = setInterval(() => {
      this.checkUnacknowledgedNotifications();
    }, 30000);

    console.log('Auto-shutdown monitor started');
  }

  stopAutoShutdownMonitor() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Convert to DTO
  convertToDto(notification) {
    const id = notification._id || notification.id;
    return {
      id: id ? id.toString() : null,
      machineId: notification.machineId,
      machineName: notification.machineName,
      message: notification.message,
      severity: notification.severity,
      sensorData: notification.sensorData,
      isRead: notification.isRead,
      isAcknowledged: notification.isAcknowledged,
      acknowledgedAt: notification.acknowledgedAt,
      createdAt: notification.createdAt,
    };
  }
}

module.exports = new NotificationService();
