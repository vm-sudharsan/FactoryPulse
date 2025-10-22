const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// PostgreSQL Connection using Sequelize
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectPostgreSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

// Initialize database based on DB_TYPE
const initializeDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'mongodb';
  
  if (dbType === 'mongodb') {
    await connectMongoDB();
  } else if (dbType === 'postgresql') {
    await connectPostgreSQL();
  } else {
    console.error('Invalid DB_TYPE');
    process.exit(1);
  }
};

module.exports = {
  initializeDatabase,
  sequelize,
  mongoose,
};
