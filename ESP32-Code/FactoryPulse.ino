/*
 * IoT Machine Monitoring System - ESP32 (Final v3.1)
 * --------------------------------------------------
 * Channel ID: 3054992
 * Read Key  : RR1GW7ETRAT8H0DE
 * Write Key : 37ZB71XBU3N9I2BE
 * 
 * Field1 = Temperature (°C)
 * Field2 = Vibration (V)
 * Field3 = Current (A)
 * Field4 = Machine Control (0=OFF, 1=ON)
 */

#include <WiFi.h>
#include <ThingSpeak.h>

// ============================================================
// WiFi Credentials - UPDATE THESE
// ============================================================
const char* ssid = "Your_WiFi_SSID";
const char* password = "Your_WiFi_Password";

// ============================================================
// ThingSpeak Configuration
// ============================================================
unsigned long myChannelNumber = 3054992;
const char* myWriteAPIKey = "37ZB71XBU3N9I2BE";
const char* myReadAPIKey  = "RR1GW7ETRAT8H0DE";

// ============================================================
// Hardware Pins
// ============================================================
const int tempPin = 35;       // LM35 Temperature Sensor
const int vibrationPin = 32;  // SW-420 Vibration Sensor
const int currentPin = 34;    // ACS712 Current Sensor
const int controlPin = 33;    // Relay/LED output

// ============================================================
// Sensor Calibration
// ============================================================
const float V_REF = 3.3;
const int ADC_RES = 4095;
const float ACS_SENS = 0.185;                     // 185mV per Amp
const float ACS_ZERO = (1950.0 / 4095.0) * V_REF; // ~1.56V center

// ============================================================
// Timing Intervals
// ============================================================
const unsigned long UPLOAD_INTERVAL = 60000;        // 60s
const unsigned long CONTROL_INTERVAL = 10000;       // 10s
unsigned long lastUpload = 0;
unsigned long lastControlCheck = 0;
unsigned long lastWiFiLog = 0;

// ============================================================
// Globals
// ============================================================
bool machineState = false;
WiFiClient client;

// ============================================================
// WiFi Connection with Logging
// ============================================================
void connectWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("📡 Connecting to WiFi...");
    WiFi.begin(ssid, password);
    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry < 30) {
      delay(500);
      Serial.print(".");
      retry++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ WiFi Connected!");
      Serial.print("📶 Signal Strength (RSSI): ");
      Serial.print(WiFi.RSSI());
      Serial.println(" dBm");
      Serial.print("🌐 IP Address: ");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println("\n❌ WiFi Connection Failed!");
    }
  } else {
    // Log WiFi health every 60s
    if (millis() - lastWiFiLog >= 60000) {
      lastWiFiLog = millis();
      Serial.print("📶 WiFi still connected | RSSI: ");
      Serial.print(WiFi.RSSI());
      Serial.println(" dBm");
    }
  }
}

// ============================================================
// Read Control Signal (Field 4)
// ============================================================
bool readControlSignal() {
  float val = ThingSpeak.readFloatField(myChannelNumber, 4, myReadAPIKey);
  int statusCode = ThingSpeak.getLastReadStatus();

  if (statusCode == 200) {
    Serial.print("🔹 Control Signal (Field 4): ");
    Serial.println(val);
    return (val == 1.0);
  } else {
    Serial.print("⚠️ ThingSpeak Read Error (HTTP ");
    Serial.print(statusCode);
    Serial.println(")");
    return machineState;
  }
}

// ============================================================
// Update Machine State (GPIO33)
// ============================================================
void updateMachine(bool newState) {
  if (newState != machineState) {
    machineState = newState;
    digitalWrite(controlPin, machineState ? HIGH : LOW);
    Serial.println(machineState ? "⚙️ Machine Turned ON (GPIO33 HIGH)" : "🛑 Machine Turned OFF (GPIO33 LOW)");
  }
}

// ============================================================
// Read Sensors with Logging
// ============================================================
void readSensors(float &temp, float &vib, float &curr) {
  int rawT = analogRead(tempPin);
  int rawV = analogRead(vibrationPin);
  int rawC = analogRead(currentPin);

  float tVolt = (rawT * V_REF) / ADC_RES;
  temp = tVolt / 0.01;  // LM35 → 10mV/°C

  vib = (rawV * V_REF) / ADC_RES;

  float cVolt = (rawC * V_REF) / ADC_RES;
  curr = (cVolt - ACS_ZERO) / ACS_SENS;

  if (temp < 0 || temp > 100) temp = 0;
  if (vib < 0 || vib > 3.3) vib = 0;
  if (abs(curr) < 0.05) curr = 0;

  Serial.println("🌡️ Sensor Data:");
  Serial.print("   ↳ Temperature: "); Serial.print(temp); Serial.println(" °C");
  Serial.print("   ↳ Vibration: "); Serial.print(vib); Serial.println(" V");
  Serial.print("   ↳ Current: "); Serial.print(curr); Serial.println(" A");
}

// ============================================================
// Upload Sensor Data
// ============================================================
void uploadData(float temp, float vib, float curr) {
  ThingSpeak.setField(1, temp);
  ThingSpeak.setField(2, vib);
  ThingSpeak.setField(3, curr);

  int res = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  if (res == 200) {
    Serial.println("✅ Data Uploaded Successfully to ThingSpeak");
  } else {
    Serial.print("⚠️ Upload Failed (HTTP ");
    Serial.print(res);
    Serial.println(")");
  }
}

// ============================================================
// Setup
// ============================================================
void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("\n=== 🛰️ Machine Monitor v3.1 ===");

  pinMode(controlPin, OUTPUT);
  digitalWrite(controlPin, LOW);
  Serial.println("GPIO33 initialized to LOW (Machine OFF)");

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  connectWiFi();

  ThingSpeak.begin(client);

  machineState = readControlSignal();
  updateMachine(machineState);

  Serial.println("✅ System Ready\n");
}

// ============================================================
// Main Loop
// ============================================================
void loop() {
  unsigned long now = millis();

  connectWiFi();

  // Control check every 10s
  if (now - lastControlCheck >= CONTROL_INTERVAL) {
    lastControlCheck = now;
    bool newState = readControlSignal();
    updateMachine(newState);
  }

  // Upload data every 60s
  if (now - lastUpload >= UPLOAD_INTERVAL) {
    lastUpload = now;

    float temp, vib, curr;
    if (machineState) {
      // Machine ON - read real sensor values
      readSensors(temp, vib, curr);
    } else {
      // Machine OFF - read sensors but send zeros
      Serial.println("🕹️ Machine OFF → Reading sensors but sending zeros");
      readSensors(temp, vib, curr);
      Serial.println("📤 Overriding with zeros for upload");
      temp = 0; vib = 0; curr = 0;
    }

    uploadData(temp, vib, curr);
  }

  delay(100);
}
