const sensorDataService = require('../services/sensorDataService');

class SensorDataController {
  async getRecentSensorData(req, res) {
    try {
      const recentData = await sensorDataService.getRecentData();
      
      if (recentData) {
        return res.status(200).json(recentData);
      } else {
        return res.status(404).json({ message: 'No sensor data found' });
      }
    } catch (error) {
      console.error('Error in getRecentSensorData:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async getAllSensorData(req, res) {
    try {
      const allData = await sensorDataService.getAllData();
      return res.status(200).json(allData);
    } catch (error) {
      console.error('Error in getAllSensorData:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
}

module.exports = new SensorDataController();
