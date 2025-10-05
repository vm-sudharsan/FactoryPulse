# Spring Boot to MERN Stack Mapping

This document shows how each Spring Boot component maps to the MERN implementation.

## 📁 File Structure Comparison

| Spring Boot | MERN Stack |
|-------------|------------|
| `application.properties` | `.env` |
| `CorsConfig.java` | `src/config/corsConfig.js` |
| `SensorDataController.java` | `src/controllers/sensorDataController.js` |
| `SensorDataDto.java` | Handled in service layer (plain objects) |
| `SensorData.java` (Entity) | `src/models/SensorData.js` |
| `SensorDataRepository.java` | Built into models (Mongoose/Sequelize) |
| `SensorDataService.java` | `src/services/sensorDataService.js` |
| `ThingSpeakService.java` | `src/services/thingSpeakService.js` |
| `BackendApplication.java` | `src/server.js` |
| N/A | `src/routes/sensorDataRoutes.js` |
| N/A | `src/config/database.js` |

## 🔄 Feature-by-Feature Comparison

### 1. CORS Configuration

**Spring Boot:**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
```

**MERN:**
```javascript
const cors = require('cors');
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
module.exports = cors(corsOptions);
```

### 2. Controller/API Endpoints

**Spring Boot:**
```java
@RestController
@RequestMapping("/api/data")
public class SensorDataController {
    @GetMapping("/recent")
    public ResponseEntity<SensorDataDto> getRecentSensorData() {
        // ...
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<SensorDataDto>> getAllSensorData() {
        // ...
    }
}
```

**MERN:**
```javascript
// Controller
class SensorDataController {
  async getRecentSensorData(req, res) {
    // ...
  }
  
  async getAllSensorData(req, res) {
    // ...
  }
}

// Routes
router.get('/recent', sensorDataController.getRecentSensorData);
router.get('/all', sensorDataController.getAllSensorData);
```

### 3. Entity/Model

**Spring Boot:**
```java
@Entity
@Data
public class SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double temperature;
    private double vibration;
    private double current;
    private LocalDateTime timestamp;
}
```

**MERN (MongoDB):**
```javascript
const sensorDataSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  vibration: { type: Number, required: true },
  current: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
```

**MERN (PostgreSQL):**
```javascript
const SensorDataPostgres = sequelize.define('SensorData', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  temperature: { type: DataTypes.DOUBLE, allowNull: false },
  vibration: { type: DataTypes.DOUBLE, allowNull: false },
  current: { type: DataTypes.DOUBLE, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
```

### 4. Repository/Data Access

**Spring Boot:**
```java
@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
}

// Usage in service
sensorDataRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"))
```

**MERN (MongoDB):**
```javascript
// Built into Mongoose model
await SensorDataModel.findOne().sort({ timestamp: -1 });
await SensorDataModel.find().sort({ timestamp: 1 });
```

**MERN (PostgreSQL):**
```javascript
// Built into Sequelize model
await SensorDataModel.findOne({ order: [['timestamp', 'DESC']] });
await SensorDataModel.findAll({ order: [['timestamp', 'ASC']] });
```

### 5. Service Layer

**Spring Boot:**
```java
@Service
public class SensorDataService {
    @Autowired
    SensorDataRepository sensorDataRepository;
    
    public SensorDataDto getRecentData() {
        Optional<SensorData> recentData = sensorDataRepository
            .findAll(Sort.by(Sort.Direction.DESC, "timestamp"))
            .stream().findFirst();
        // Convert to DTO
    }
}
```

**MERN:**
```javascript
class SensorDataService {
  async getRecentData() {
    const SensorDataModel = getSensorDataModel();
    const recentData = await SensorDataModel
      .findOne()
      .sort({ timestamp: -1 });
    return this.convertToDto(recentData);
  }
}
```

### 6. ThingSpeak Integration

**Spring Boot:**
```java
@Service
public class ThingSpeakService {
    @Scheduled(fixedRate = 60000)
    public void fetchAndSaveThingSpeakData() {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        // Parse and save
    }
}
```

**MERN:**
```javascript
const cron = require('node-cron');
const axios = require('axios');

class ThingSpeakService {
  startScheduledFetch() {
    cron.schedule('*/1 * * * *', async () => {
      const response = await axios.get(this.apiUrl);
      // Parse and save
    });
  }
}
```

### 7. Application Entry Point

**Spring Boot:**
```java
@SpringBootApplication
@EnableScheduling
@Import(CorsConfig.class)
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
```

**MERN:**
```javascript
const express = require('express');
const app = express();

app.use(corsMiddleware);
app.use('/api/data', sensorDataRoutes);

const startServer = async () => {
  await initializeDatabase();
  thingSpeakService.startScheduledFetch();
  app.listen(PORT);
};

startServer();
```

## 🔧 Configuration Comparison

### Spring Boot (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/factorypulse
spring.datasource.username=postgres
spring.datasource.password=toor
server.port=8080
cors.allowed-origins=http://localhost:3000
thingspeak.api.url=https://api.thingspeak.com/...
```

### MERN (.env)
```env
DB_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=factorypulse
POSTGRES_USER=postgres
POSTGRES_PASSWORD=toor
PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000
THINGSPEAK_API_URL=https://api.thingspeak.com/...
```

## 🎯 Key Differences

| Aspect | Spring Boot | MERN |
|--------|-------------|------|
| **Language** | Java | JavaScript |
| **Type System** | Static typing | Dynamic typing |
| **Dependency Injection** | @Autowired | require() / import |
| **Annotations** | @Service, @RestController | Class-based patterns |
| **ORM** | JPA/Hibernate | Mongoose/Sequelize |
| **Scheduling** | @Scheduled | node-cron |
| **HTTP Client** | RestTemplate | axios |
| **Configuration** | .properties | .env |
| **Routing** | @RequestMapping | Express Router |

## ✅ Functional Equivalence

Both implementations provide:

1. ✅ **Same API Endpoints**
   - `GET /api/data/recent`
   - `GET /api/data/all`

2. ✅ **Same Data Flow**
   - ThingSpeak → Backend (every 60s)
   - Backend → Database
   - Frontend → Backend API

3. ✅ **Same CORS Configuration**
   - Allows requests from `http://localhost:3000`

4. ✅ **Same Database Schema**
   - Fields: temperature, vibration, current, timestamp

5. ✅ **Same Response Format**
   - JSON DTOs with sensor readings

## 🚀 MERN Advantages

1. **Single Language**: JavaScript for both frontend and backend
2. **Dual Database Support**: Easy switching between MongoDB and PostgreSQL
3. **Lightweight**: Faster startup time
4. **NPM Ecosystem**: Vast package availability
5. **JSON Native**: Natural JSON handling

## 📊 Performance Notes

- **Spring Boot**: Better for large enterprise applications, strong typing
- **MERN**: Faster development, better for rapid prototyping
- **Both**: Suitable for this IoT monitoring use case

---

**Result**: The MERN implementation is functionally identical to your Spring Boot version with added flexibility for database selection!
