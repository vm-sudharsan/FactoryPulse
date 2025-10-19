// const express = require('express');
// const corsMiddleware = require('./config/corsConfig');
// const { initializeDatabase } = require('./config/database');
// const sensorDataRoutes = require('./routes/sensorDataRoutes');
// const authRoutes = require('./routes/authRoutes');
// const machineRoutes = require('./routes/machineRoutes');
// const operatorRoutes = require('./routes/operatorRoutes');
// const thingSpeakService = require('./services/thingSpeakService');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(corsMiddleware);

// // Routes
// app.use('/api/data', sensorDataRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/machines', machineRoutes);
// app.use('/api/operators', operatorRoutes);

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     message: 'Factory Pulse Backend is running',
//     database: process.env.DB_TYPE || 'mongodb',
//     timestamp: new Date().toISOString()
//   });
// });

// // Root endpoint
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Factory Pulse Backend API',
//     version: '1.0.0',
//     endpoints: {
//       health: '/health',
//       auth: {
//         signup: 'POST /api/auth/signup',
//         login: 'POST /api/auth/login',
//         profile: 'GET /api/auth/profile'
//       },
//       machines: {
//         getAll: 'GET /api/machines',
//         getById: 'GET /api/machines/:id',
//         create: 'POST /api/machines',
//         update: 'PUT /api/machines/:id',
//         delete: 'DELETE /api/machines/:id',
//         toggle: 'POST /api/machines/:id/toggle'
//       },
//       operators: {
//         getAll: 'GET /api/operators',
//         create: 'POST /api/operators',
//         update: 'PUT /api/operators/:id',
//         delete: 'DELETE /api/operators/:id'
//       },
//       sensorData: {
//         recent: 'GET /api/data/recent',
//         all: 'GET /api/data/all'
//       }
//     }
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
//   res.status(500).json({ 
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Initialize server
// const startServer = async () => {
//   try {
//     // Initialize database
//     await initializeDatabase();
    
//     // Start scheduled ThingSpeak data fetching
//     thingSpeakService.startScheduledFetch();
    
//     // Start Express server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`);
//       console.log(`📊 Database: ${process.env.DB_TYPE || 'mongodb'}`);
//       console.log(`🌐 CORS enabled for: ${process.env.CORS_ALLOWED_ORIGINS}`);
//       console.log(`\n📡 API Endpoints:`);
//       console.log(`   - GET http://localhost:${PORT}/api/data/recent`);
//       console.log(`   - GET http://localhost:${PORT}/api/data/all`);
//     });
//   } catch (error) {
//     console.error('❌ Failed to start server:', error.message);
//     process.exit(1);
//   }
// };

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n⏸️ Shutting down gracefully...');
//   thingSpeakService.stopScheduledFetch();
//   process.exit(0);
// });

// process.on('SIGTERM', () => {
//   console.log('\n⏸️ Shutting down gracefully...');
//   thingSpeakService.stopScheduledFetch();
//   process.exit(0);
// });

// // Start the server
// startServer();

// module.exports = app;
const express = require('express');
const corsMiddleware = require('./config/corsConfig');
const { initializeDatabase } = require('./config/database');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');
const operatorRoutes = require('./routes/operatorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const thingSpeakService = require('./services/thingSpeakService');
const notificationService = require('./services/notificationService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use('/api/data', sensorDataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Factory Pulse Backend is running',
    database: process.env.DB_TYPE || 'mongodb',
    timestamp: new Date().toISOString()
  });
});

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
    thingSpeakService.startScheduledFetch();
    notificationService.startAutoShutdownMonitor();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database: ${process.env.DB_TYPE || 'mongodb'}`);
      console.log(`CORS enabled for: ${process.env.CORS_ALLOWED_ORIGINS}`);
      console.log(`API Endpoints:`);
      console.log(`   - GET http://localhost:${PORT}/api/data/recent`);
      console.log(`   - GET http://localhost:${PORT}/api/data/all`);
      console.log(`   - GET http://localhost:${PORT}/api/notifications`);
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
