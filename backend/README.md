# Factory Pulse Backend - MERN Stack

A Node.js/Express backend that fetches real-time sensor data from ThingSpeak IoT platform and exposes REST APIs for frontend consumption. Supports both **MongoDB Atlas** and **PostgreSQL** databases with easy switching.

## 🏗️ Architecture

```
factorypulse-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection (MongoDB & PostgreSQL)
│   │   └── corsConfig.js        # CORS configuration
│   ├── controllers/
│   │   └── sensorDataController.js  # API request handlers
│   ├── models/
│   │   └── SensorData.js        # Mongoose & Sequelize models
│   ├── services/
│   │   ├── thingSpeakService.js # ThingSpeak data fetching (scheduled)
│   │   └── sensorDataService.js # Business logic for sensor data
│   ├── routes/
│   │   └── sensorDataRoutes.js  # API route definitions
│   └── server.js                # Main application entry point
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

## 🚀 Features

- **ThingSpeak Integration**: Automatically fetches sensor data every 60 seconds
- **Dual Database Support**: Switch between MongoDB Atlas and PostgreSQL
- **REST API**: Exposes `/api/data/recent` and `/api/data/all` endpoints
- **CORS Enabled**: Configured for frontend integration
- **Scheduled Jobs**: Uses node-cron for periodic data fetching
- **Error Handling**: Comprehensive error handling and logging

## 📊 Data Flow

1. **ThingSpeak → Backend**: `ThingSpeakService` fetches data every minute
2. **Backend → Database**: Sensor readings stored in MongoDB or PostgreSQL
3. **Frontend → Backend**: React app calls REST APIs
4. **Backend → Frontend**: Returns JSON data (recent/all readings)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account OR PostgreSQL installed locally
- ThingSpeak API key

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Selection (mongodb or postgresql)
DB_TYPE=mongodb

# MongoDB Configuration (if using MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/factorypulse?retryWrites=true&w=majority

# PostgreSQL Configuration (if using PostgreSQL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=factorypulse
POSTGRES_USER=postgres
POSTGRES_PASSWORD=toor

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000

# ThingSpeak API Configuration
THINGSPEAK_API_URL=https://api.thingspeak.com/channels/3054992/feeds.json?api_key=RR1GW7ETRAT8H0DE&results=1
THINGSPEAK_FETCH_INTERVAL=60000
```

### 3. Database Setup

#### Option A: MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env`
4. Set `DB_TYPE=mongodb`

#### Option B: PostgreSQL

1. Install PostgreSQL locally
2. Create database:
   ```sql
   CREATE DATABASE factorypulse;
   ```
3. Update PostgreSQL credentials in `.env`
4. Set `DB_TYPE=postgresql`

### 4. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📡 API Endpoints

### 1. Get Recent Sensor Data
```http
GET http://localhost:8080/api/data/recent
```

**Response:**
```json
{
  "temperature": 25.5,
  "vibration": 0.8,
  "current": 12.3,
  "timestamp": "2025-10-04T10:24:52.000Z"
}
```

### 2. Get All Sensor Data
```http
GET http://localhost:8080/api/data/all
```

**Response:**
```json
[
  {
    "temperature": 24.2,
    "vibration": 0.7,
    "current": 11.8,
    "timestamp": "2025-10-04T10:23:52.000Z"
  },
  {
    "temperature": 25.5,
    "vibration": 0.8,
    "current": 12.3,
    "timestamp": "2025-10-04T10:24:52.000Z"
  }
]
```

### 3. Health Check
```http
GET http://localhost:8080/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Factory Pulse Backend is running",
  "database": "mongodb",
  "timestamp": "2025-10-04T10:24:52.000Z"
}
```

## 🔄 Switching Between Databases

Simply change the `DB_TYPE` in `.env`:

```env
# For MongoDB
DB_TYPE=mongodb

# For PostgreSQL
DB_TYPE=postgresql
```

Restart the server after changing the database type.

## 🧩 Key Components

### 1. ThingSpeak Service
- **File**: `src/services/thingSpeakService.js`
- **Purpose**: Fetches sensor data from ThingSpeak API every 60 seconds
- **Scheduling**: Uses `node-cron` for periodic execution

### 2. Sensor Data Service
- **File**: `src/services/sensorDataService.js`
- **Purpose**: Business logic for retrieving recent and all sensor data
- **Database Agnostic**: Works with both MongoDB and PostgreSQL

### 3. Database Configuration
- **File**: `src/config/database.js`
- **Purpose**: Manages connections to MongoDB (Mongoose) and PostgreSQL (Sequelize)

### 4. Models
- **File**: `src/models/SensorData.js`
- **MongoDB Model**: Mongoose schema
- **PostgreSQL Model**: Sequelize model
- **Factory Function**: Returns appropriate model based on `DB_TYPE`

### 5. Controller & Routes
- **Controller**: `src/controllers/sensorDataController.js`
- **Routes**: `src/routes/sensorDataRoutes.js`
- **Purpose**: Handle HTTP requests and responses

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Ensure IP whitelist includes your IP in MongoDB Atlas
- Check network connectivity

### PostgreSQL Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists

### ThingSpeak Data Not Fetching
- Verify API URL and key in `.env`
- Check ThingSpeak channel is public or key is valid
- Review console logs for error messages

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **sequelize**: PostgreSQL ORM
- **axios**: HTTP client for ThingSpeak API
- **node-cron**: Task scheduling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **pg**: PostgreSQL client

## 🎯 Comparison with Spring Boot Version

| Feature | Spring Boot | MERN (Node.js) |
|---------|-------------|----------------|
| Framework | Spring Boot | Express.js |
| Database ORM | JPA/Hibernate | Mongoose/Sequelize |
| Scheduling | @Scheduled | node-cron |
| HTTP Client | RestTemplate | axios |
| Config | application.properties | .env |
| CORS | WebMvcConfigurer | cors middleware |

## 📝 Notes

- Data is fetched from ThingSpeak every 60 seconds (configurable)
- All timestamps are stored in UTC
- CORS is configured for `http://localhost:3000` by default
- The server gracefully handles shutdown signals (SIGINT/SIGTERM)

## 🚀 Next Steps

1. Add authentication/authorization
2. Implement data analytics endpoints
3. Add alerting for abnormal sensor readings
4. Create data visualization endpoints
5. Add unit and integration tests

## 📄 License

ISC

---

**Created for IoT Factory Pulse Monitoring System**
