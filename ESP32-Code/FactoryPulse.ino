#include <WiFi.h>
#include <ThingSpeak.h>

const char* ssidList[] = {"Home Net - 2.4G", "MINION", "."};
const char* passList[] = {"Password", "sudharsan$", "1234567890"};
const int wifiCount = 3;

unsigned long channelid = 3054992;
const char* writekey = "37ZB71XBU3N9I2BE";
const char* readkey  = "RR1GW7ETRAT8H0DE";

const int temppin = 35;
const int vibpin = 32;
const int currpin = 34;
const int controlpin = 33;

const float voltref = 3.3;
const int adcresolution = 4095;
const float currentsensitivity = 0.185;
const float currentzero = (1950.0 / 4095.0) * voltref;

const unsigned long uploadinterval = 60000;
const unsigned long controlinterval = 10000;
unsigned long lastupload = 0;
unsigned long lastcontrolcheck = 0;
unsigned long lastwifilog = 0;

bool machinestate = false;
WiFiClient client;

void connectwifi() {
  if (WiFi.status() == WL_CONNECTED) {
    if (millis() - lastwifilog >= 60000) {
      lastwifilog = millis();
      Serial.println("WiFi Connected");
    }
    return;
  }

  Serial.println("Scanning for available WiFi networks...");
  int n = WiFi.scanNetworks();
  if (n <= 0) {
    Serial.println("No networks found");
    return;
  }

  int bestIndex = -1;
  int bestSignal = -1000;
  for (int i = 0; i < wifiCount; i++) {
    for (int j = 0; j < n; j++) {
      if (WiFi.SSID(j) == ssidList[i]) {
        int rssi = WiFi.RSSI(j);
        if (rssi > bestSignal) {
          bestSignal = rssi;
          bestIndex = i;
        }
      }
    }
  }

  if (bestIndex == -1) {
    Serial.println("No known networks found nearby");
    return;
  }

  Serial.print("Connecting to best WiFi: ");
  Serial.println(ssidList[bestIndex]);

  WiFi.begin(ssidList[bestIndex], passList[bestIndex]);
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 30) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected");
    Serial.print("Connected to: ");
    Serial.println(ssidList[bestIndex]);
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed");
  }
}

bool readcontrolsignal() {
  float val = ThingSpeak.readFloatField(channelid, 4, readkey);
  int statuscode = ThingSpeak.getLastReadStatus();

  if (statuscode == 200) {
    return (val == 1.0);
  } else {
    return machinestate;
  }
}

void updatemachine(bool newstate) {
  if (newstate != machinestate) {
    machinestate = newstate;
    digitalWrite(controlpin, machinestate ? HIGH : LOW);
    Serial.println(machinestate ? "Machine ON" : "Machine OFF");
  }
}

void readsensors(float &temp, float &vib, float &curr) {
  int rawtemp = analogRead(temppin);
  int rawvibration = analogRead(vibpin);
  int rawcurrent = analogRead(currpin);

  float tempvolt = (rawtemp * voltref) / adcresolution;
  temp = tempvolt / 0.01;

  vib = (rawvibration * voltref) / adcresolution;

  float currentvolt = (rawcurrent * voltref) / adcresolution;
  curr = (currentvolt - currentzero) / currentsensitivity;

  if (temp < 0 || temp > 100) temp = 0;
  if (vib < 0 || vib > 3.3) vib = 0;
  if (abs(curr) < 0.05) curr = 0;
}

void uploaddata(float temp, float vib, float curr) {
  ThingSpeak.setField(1, temp);
  ThingSpeak.setField(2, vib);
  ThingSpeak.setField(3, curr);
  int res = ThingSpeak.writeFields(channelid, writekey);
  if (res == 200) {
    Serial.println("Data Uploaded");
  } else {
    Serial.println("Upload Failed");
  }
}

void setup() {
  Serial.begin(115200);
  delay(2000);

  pinMode(controlpin, OUTPUT);
  digitalWrite(controlpin, HIGH);
  Serial.println("System Init");

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  connectwifi();

  delay(2000);
  ThingSpeak.begin(client);

  machinestate = readcontrolsignal();
  updatemachine(machinestate);

  Serial.println("System Ready");
}

void loop() {
  unsigned long now = millis();
  connectwifi();

  if (now - lastcontrolcheck >= controlinterval) {
    lastcontrolcheck = now;
    bool newstate = readcontrolsignal();
    updatemachine(newstate);
  }

  if (now - lastupload >= uploadinterval) {
    lastupload = now;
    float temp, vib, curr;
    if (machinestate) {
      readsensors(temp, vib, curr);
    } else {
      temp = 0; vib = 0; curr = 0;
    }
    uploaddata(temp, vib, curr);
  }

  delay(100);
}
