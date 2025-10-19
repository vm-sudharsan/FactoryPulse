const mongoose = require('mongoose');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ==================== MongoDB Model (Mongoose) ====================
const notificationSchema = new mongoose.Schema({
  machineId: {
    type: String,
    required: true,
  },
  machineName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['warning', 'critical'],
    required: true,
  },
  sensorData: {
    temperature: Number,
    vibration: Number,
    current: Number,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isAcknowledged: {
    type: Boolean,
    default: false,
  },
  acknowledgedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationMongo = mongoose.model('Notification', notificationSchema);

// ==================== PostgreSQL Model (Sequelize) ====================
const NotificationPostgres = sequelize.define('Notification', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  machineId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  machineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('warning', 'critical'),
    allowNull: false,
  },
  sensorData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAcknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'notifications',
  timestamps: false,
});

// ==================== Factory Function ====================
const getNotificationModel = () => {
  const dbType = process.env.DB_TYPE || 'mongodb';
  return dbType === 'mongodb' ? NotificationMongo : NotificationPostgres;
};

module.exports = {
  NotificationMongo,
  NotificationPostgres,
  getNotificationModel,
};
