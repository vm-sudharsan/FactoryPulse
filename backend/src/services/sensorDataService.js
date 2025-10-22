const { getSensorDataModel } = require('../models/SensorData');
const { getMachineModel } = require('../models/Machine');
require('dotenv').config();

class SensorDataService {
  constructor() {
    this.dbType = process.env.DB_TYPE || 'mongodb';
  }

  async getRecentData() {
    try {
      const SensorDataModel = getSensorDataModel();

      if (this.dbType === 'mongodb') {
        const recentData = await SensorDataModel
          .findOne()
          .sort({ timestamp: -1 })
          .lean();
        
        return recentData ? this.convertToDto(recentData) : null;
      } else {
        const recentData = await SensorDataModel.findOne({
          order: [['timestamp', 'DESC']],
        });
        
        return recentData ? this.convertToDto(recentData.toJSON()) : null;
      }
    } catch (error) {
      console.error('Error fetching recent data:', error.message);
      throw error;
    }
  }

  async getAllData() {
    try {
      const SensorDataModel = getSensorDataModel();

      if (this.dbType === 'mongodb') {
        const allData = await SensorDataModel
          .find()
          .sort({ timestamp: 1 })
          .lean();
        
        return allData.map(data => this.convertToDto(data));
      } else {
        const allData = await SensorDataModel.findAll({
          order: [['timestamp', 'ASC']],
        });
        
        return allData.map(data => this.convertToDto(data.toJSON()));
      }
    } catch (error) {
      console.error('Error fetching all data:', error.message);
      throw error;
    }
  }

  async getDataByDateRange(startDate, endDate) {
    try {
      const SensorDataModel = getSensorDataModel();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);

      if (this.dbType === 'mongodb') {
        const data = await SensorDataModel
          .find({
            timestamp: {
              $gte: start,
              $lte: end
            }
          })
          .sort({ timestamp: 1 })
          .lean();
        
        return data.map(d => this.convertToDto(d));
      } else {
        const data = await SensorDataModel.findAll({
          where: {
            timestamp: {
              [require('sequelize').Op.gte]: start,
              [require('sequelize').Op.lte]: end
            }
          },
          order: [['timestamp', 'ASC']],
        });
        
        return data.map(d => this.convertToDto(d.toJSON()));
      }
    } catch (error) {
      console.error('Error fetching data by date range:', error.message);
      throw error;
    }
  }

  convertToDto(data) {
    return {
      temperature: data.temperature,
      vibration: data.vibration,
      current: data.current,
      timestamp: data.timestamp,
    };
  }
}

module.exports = new SensorDataService();
