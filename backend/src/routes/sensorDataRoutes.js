const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

// GET /api/data/recent - Get the most recent sensor reading
router.get('/recent', sensorDataController.getRecentSensorData);

// GET /api/data/all - Get all sensor readings
router.get('/all', sensorDataController.getAllSensorData);

// GET /api/data/download-csv - Download sensor data as CSV
router.get('/download-csv', sensorDataController.downloadCSV);

module.exports = router;
