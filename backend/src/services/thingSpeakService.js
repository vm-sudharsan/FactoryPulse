const axios = require('axios');
const cron = require('node-cron');
const { getSensorDataModel } = require('../models/SensorData');
const { getMachineModel } = require('../models/Machine');
require('dotenv').config();

class ThingSpeakService {
  constructor() {
    // Hardcoded ThingSpeak credentials for single-prototype setup
    this.channelId = '3054992';
    this.readApiKey = 'RR1GW7ETRAT8H0DE';
    this.writeApiKey = '37ZB71XBU3N9I2BE';
    this.apiUrl = `https://api.thingspeak.com/channels/${this.channelId}/feeds.json?api_key=${this.readApiKey}&results=1`;
    this.fetchInterval = process.env.THINGSPEAK_FETCH_INTERVAL || 60000;
    this.cronJob = null;
    this.lastUpdateTime = 0; // Track last update to prevent rate limit issues
  }

  async fetchAndSaveData() {
    try {
      console.log('🔄 Fetching data from ThingSpeak...');
      
      const response = await axios.get(this.apiUrl);
      const data = response.data;

      if (data && data.feeds && data.feeds.length > 0) {
        const latestFeed = data.feeds[0];
        
        // Read sensor values (Fields 1-3)
        const temperature = parseFloat(latestFeed.field1) || 0;
        const vibration = parseFloat(latestFeed.field2) || 0;
        const current = parseFloat(latestFeed.field3) || 0;

        const SensorDataModel = getSensorDataModel();
        const dbType = process.env.DB_TYPE || 'mongodb';

        // Save sensor data
        if (dbType === 'mongodb') {
          const sensorData = new SensorDataModel({
            temperature,
            vibration,
            current,
            timestamp: new Date(),
          });
          await sensorData.save();
        } else {
          await SensorDataModel.create({
            temperature,
            vibration,
            current,
            timestamp: new Date(),
          });
        }

        console.log('✅ Data successfully fetched and saved:', {
          temperature,
          vibration,
          current,
        });
      } else {
        console.log('⚠️ No feeds found in ThingSpeak response');
      }
    } catch (error) {
      console.error('❌ Error fetching data from ThingSpeak:', error.message);
    }
  }

  startScheduledFetch() {
    // Convert milliseconds to seconds for cron
    const intervalSeconds = Math.floor(this.fetchInterval / 1000);
    
    // Run every minute (or as configured)
    this.cronJob = cron.schedule('*/1 * * * *', () => {
      this.fetchAndSaveData();
    });

    console.log(`⏰ Scheduled data fetch every ${intervalSeconds} seconds`);
    
    // Fetch immediately on start
    this.fetchAndSaveData();
  }

  stopScheduledFetch() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('⏸️ Scheduled data fetch stopped');
    }
  }

  async controlGPIO(fieldId, value) {
    try {
      // Check rate limit (ThingSpeak allows updates every 15 seconds)
      // But since ESP32 also writes, we need a longer interval
      const now = Date.now();
      const timeSinceLastUpdate = now - this.lastUpdateTime;
      const minInterval = 20000; // 20 seconds to avoid conflicts with ESP32
      
      if (timeSinceLastUpdate < minInterval && this.lastUpdateTime > 0) {
        const waitTime = Math.ceil((minInterval - timeSinceLastUpdate) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before toggling again (ThingSpeak rate limit + ESP32 coordination)`);
      }
      
      // Use hardcoded write API key for single-prototype setup
      const url = `https://api.thingspeak.com/update?api_key=${this.writeApiKey}&field${fieldId}=${value}`;
      
      console.log(`📡 Updating ThingSpeak field${fieldId} to ${value}...`);
      
      // Retry logic for rate limit
      let retries = 3;
      let response;
      
      while (retries > 0) {
        response = await axios.get(url);
        console.log(`📥 ThingSpeak response (attempt ${4 - retries}):`, response.data);
        
        if (response.data !== 0) {
          break; // Success!
        }
        
        retries--;
        if (retries > 0) {
          console.log(`⏳ Rate limit hit, waiting 5 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      if (response.data === 0) {
        throw new Error('ThingSpeak update failed after retries - Channel is busy (ESP32 may be writing)');
      }

      // Update last update time on success
      this.lastUpdateTime = now;
      
      console.log(`✅ GPIO control: field${fieldId} set to ${value} (Entry ID: ${response.data})`);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('❌ ThingSpeak API Error:', {
          status: error.response.status,
          data: error.response.data,
          message: error.message
        });
      } else {
        console.error('❌ Error controlling GPIO:', error.message);
      }
      throw new Error(`ThingSpeak update failed: ${error.message}`);
    }
  }

  async getCurrentStatus() {
    try {
      const response = await axios.get(this.apiUrl);
      const data = response.data;

      if (data && data.feeds && data.feeds.length > 0) {
        const latestFeed = data.feeds[0];
        const field4Value = parseInt(latestFeed.field4) || 0;
        return field4Value === 1 ? 'on' : 'off';
      }
      
      return 'off';
    } catch (error) {
      console.error('❌ Error getting current status:', error.message);
      return 'off';
    }
  }
}

module.exports = new ThingSpeakService();
