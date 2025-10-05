const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

// GET /api/data/recent - Get the most recent sensor reading
router.get('/recent', sensorDataController.getRecentSensorData);

// GET /api/data/all - Get all sensor readings
router.get('/all', sensorDataController.getAllSensorData);

module.exports = router;
