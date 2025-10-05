const mongoose = require('mongoose');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ==================== MongoDB Model (Mongoose) ====================
const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['on', 'off'],
    default: 'off',
  },
  thingspeakFieldId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MachineMongo = mongoose.model('Machine', machineSchema);

// ==================== PostgreSQL Model (Sequelize) ====================
const MachinePostgres = sequelize.define('Machine', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('on', 'off'),
    defaultValue: 'off',
    allowNull: false,
  },
  thingspeakFieldId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'machines',
  timestamps: false,
});

// ==================== Factory Function ====================
const getMachineModel = () => {
  const dbType = process.env.DB_TYPE || 'mongodb';
  return dbType === 'mongodb' ? MachineMongo : MachinePostgres;
};

module.exports = {
  MachineMongo,
  MachinePostgres,
  getMachineModel,
};
