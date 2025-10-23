const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const corsMiddleware = require('./config/corsConfig');
const { initializeDatabase } = require('./config/database');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');
const operatorRoutes = require('./routes/operatorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const mlRoutes = require('./routes/mlRoutes');
const healthRoutes = require('./routes/healthRoutes');
const thingSpeakService = require('./services/thingSpeakService');
const notificationService = require('./services/notificationService');
const { sessionActivityMiddleware } = require('./middleware/sessionMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Logging Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use(corsMiddleware);

// Session Activity Middleware
app.use(sessionActivityMiddleware);

// Health check route (no rate limiting)
app.use('/health', healthRoutes);

// API Routes (with rate limiting)
app.use('/api/data', sensorDataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ml', mlRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Factory Pulse Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      machines: {
        getAll: 'GET /api/machines',
        getById: 'GET /api/machines/:id',
        create: 'POST /api/machines',
        update: 'PUT /api/machines/:id',
        delete: 'DELETE /api/machines/:id',
        toggle: 'POST /api/machines/:id/toggle'
      },
      operators: {
        getAll: 'GET /api/operators',
        create: 'POST /api/operators',
        update: 'PUT /api/operators/:id',
        delete: 'DELETE /api/operators/:id'
      },
      sensorData: {
        recent: 'GET /api/data/recent',
        all: 'GET /api/data/all'
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    notificationService.startAutoShutdownMonitor();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database: ${process.env.DB_TYPE || 'mongodb'}`);
      console.log(`Security: Authentication-based data fetching enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  thingSpeakService.stopScheduledFetch();
  notificationService.stopAutoShutdownMonitor();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  thingSpeakService.stopScheduledFetch();
  notificationService.stopAutoShutdownMonitor();
  process.exit(0);
});

startServer();

module.exports = app;
