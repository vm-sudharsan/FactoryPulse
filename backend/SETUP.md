# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Database

### Option A: Using MongoDB Atlas (Recommended for Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Update `.env`:
   ```env
   DB_TYPE=mongodb
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/factorypulse?retryWrites=true&w=majority
   ```

### Option B: Using PostgreSQL (Local)

1. Ensure PostgreSQL is installed and running
2. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE factorypulse;
   \q
   ```
3. Update `.env`:
   ```env
   DB_TYPE=postgresql
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=factorypulse
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   ```

## Step 3: Update ThingSpeak Configuration (Optional)

If you have your own ThingSpeak channel:

```env
THINGSPEAK_API_URL=https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds.json?api_key=YOUR_API_KEY&results=1
```

## Step 4: Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Step 5: Test the API

Open your browser or use curl/Postman:

```bash
# Health check
curl http://localhost:8080/health

# Get recent data
curl http://localhost:8080/api/data/recent

# Get all data
curl http://localhost:8080/api/data/all
```

## Expected Console Output

```
🔄 Initializing MONGODB database...
✅ MongoDB Connected Successfully
⏰ Scheduled data fetch every 60 seconds
🔄 Fetching data from ThingSpeak...
✅ Data successfully fetched and saved: { temperature: 25.5, vibration: 0.8, current: 12.3 }
🚀 Server is running on port 8080
📊 Database: mongodb
🌐 CORS enabled for: http://localhost:3000

📡 API Endpoints:
   - GET http://localhost:8080/api/data/recent
   - GET http://localhost:8080/api/data/all
```

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your internet connection
- Verify MongoDB Atlas connection string
- Ensure IP is whitelisted in MongoDB Atlas

### "Cannot connect to PostgreSQL"
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database `factorypulse` exists

### "No data from ThingSpeak"
- Wait 60 seconds for first fetch
- Check ThingSpeak API URL is correct
- Verify API key is valid

## Switching Databases

To switch from MongoDB to PostgreSQL (or vice versa):

1. Stop the server (Ctrl+C)
2. Change `DB_TYPE` in `.env`
3. Restart the server

The application will automatically use the correct database!

## Next Steps

1. ✅ Backend is running
2. Create your React frontend
3. Connect frontend to `http://localhost:8080/api/data/recent` and `/all`
4. Build your dashboard!
