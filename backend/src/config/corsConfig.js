const cors = require('cors');
require('dotenv').config();

const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600,
};

module.exports = cors(corsOptions);
