const mongoose = require('mongoose');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ==================== MongoDB Model (Mongoose) ====================
const sensorDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  vibration: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SensorDataMongo = mongoose.model('SensorData', sensorDataSchema);

// ==================== PostgreSQL Model (Sequelize) ====================
const SensorDataPostgres = sequelize.define('SensorData', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  temperature: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  vibration: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  current: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'sensor_data',
  timestamps: false,
});

// ==================== Factory Function ====================
const getSensorDataModel = () => {
  const dbType = process.env.DB_TYPE || 'mongodb';
  return dbType === 'mongodb' ? SensorDataMongo : SensorDataPostgres;
};

module.exports = {
  SensorDataMongo,
  SensorDataPostgres,
  getSensorDataModel,
};
