const express = require('express');
const router = express.Router();

/**
 * Health Check Endpoint
 * Used by deployment platforms to verify service status
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'backend',
    message: 'Factory Pulse Backend is running',
    database: process.env.DB_TYPE || 'mongodb',
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
