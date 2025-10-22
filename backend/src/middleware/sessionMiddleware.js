/**
 * Session Activity Middleware
 * Updates last activity time for authenticated requests
 */

const sessionManager = require('../services/sessionManager');

const sessionActivityMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token && sessionManager.isSessionActive(token)) {
    // Update last activity time
    sessionManager.updateActivity(token);
  }
  
  next();
};

module.exports = { sessionActivityMiddleware };
