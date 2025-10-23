const sensorDataService = require('../services/sensorDataService');
const { getMachineModel } = require('../models/Machine');

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

  async downloadCSV(req, res) {
    try {
      const { machineId, startDate, endDate, format } = req.query;

      // Validate required parameters
      if (!machineId || !startDate || !endDate) {
        return res.status(400).json({ 
          message: 'Missing required parameters: machineId, startDate, endDate' 
        });
      }

      // Get machine details
      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';
      
      let machine;
      if (dbType === 'mongodb') {
        machine = await MachineModel.findById(machineId).lean();
      } else {
        const machineData = await MachineModel.findByPk(machineId);
        machine = machineData ? machineData.toJSON() : null;
      }

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' });
      }

      // Get sensor data for date range
      const sensorData = await sensorDataService.getDataByDateRange(startDate, endDate);

      if (!sensorData || sensorData.length === 0) {
        return res.status(404).json({ 
          message: 'No data found for the specified date range' 
        });
      }

      // Determine CSV format based on query parameter
      const isAIFormat = format === 'ai';
      let csvContent;
      let filenameSuffix = '';

      if (isAIFormat) {
        // AI Analysis Format: lowercase headers, no units, no timestamp
        const csvHeader = 'temperature,vibration,current\n';
        const csvRows = sensorData.map(data => {
          return `${data.temperature},${data.vibration},${data.current}`;
        }).join('\n');
        csvContent = csvHeader + csvRows;
        filenameSuffix = '_ai_analysis';
      } else {
        // Standard Format: with timestamp and units
        const csvHeader = 'Timestamp,Temperature (°C),Vibration (Hz),Current (A)\n';
        const csvRows = sensorData.map(data => {
          const timestamp = new Date(data.timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
          return `${timestamp},${data.temperature},${data.vibration},${data.current}`;
        }).join('\n');
        csvContent = csvHeader + csvRows;
      }

      // Generate filename with machine name and date range
      const machineName = machine.name.replace(/[^a-z0-9]/gi, '_');
      const startDateStr = new Date(startDate).toISOString().split('T')[0];
      const endDateStr = new Date(endDate).toISOString().split('T')[0];
      const filename = `${machineName}_${startDateStr}_to_${endDateStr}${filenameSuffix}.csv`;

      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent));

      // Send CSV content
      return res.status(200).send(csvContent);
    } catch (error) {
      console.error('Error in downloadCSV:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
}

module.exports = new SensorDataController();
