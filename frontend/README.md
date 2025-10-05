# Factory Pulse - Frontend

Machine Health Monitoring System Frontend built with React + Vite.

## 🚀 Features

- **Real-time Dashboard**: Monitor all machines with live sensor data
- **Machine Control**: Turn machines ON/OFF via ThingSpeak GPIO control
- **Role-Based Access**: Owner and Operator roles with different permissions
- **Historical Data**: View trends with interactive charts (Recharts)
- **JWT Authentication**: Secure login and signup
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── MachineCard.jsx
│   │   ├── MachineChart.jsx
│   │   ├── MachineGrid.jsx
│   │   └── Loader.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MachineDetails.jsx
│   │   ├── ManageMachines.jsx
│   │   └── ManageOperators.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── machineService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── MachineContext.jsx
│   ├── router/
│   │   └── AppRouter.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── dashboard.css
│   │   └── auth.css
│   ├── utils/
│   │   ├── thresholds.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API endpoint:**
   - The API base URL is set in `src/services/api.js`
   - Default: `http://localhost:8080/api`
   - Update if your backend runs on a different port

## 🏃 Running the Application

**Development mode:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 🔐 User Roles

### Owner
- Full access to all features
- Can add/edit/delete machines
- Can add/edit/delete operators
- Can view dashboard and control machines

### Operator
- Can view dashboard
- Can control machines (ON/OFF)
- Cannot manage machines or operators

## 📄 Pages

### Public Pages
- **Landing Page** (`/`): Introduction and features
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): Owner registration

### Protected Pages (Requires Login)
- **Dashboard** (`/dashboard`): View all machines with live data
- **Machine Details** (`/machine/:id`): Detailed view with charts and control

### Owner-Only Pages
- **Manage Machines** (`/admin/machines`): CRUD operations for machines
- **Manage Operators** (`/admin/operators`): CRUD operations for operators

## 🎨 Styling

- Pure CSS (no frameworks)
- Responsive design
- Color-coded status indicators:
  - 🟢 **Green**: Normal operation
  - 🟡 **Yellow**: Warning state
  - 🔴 **Red**: Critical state

## 📊 Thresholds

Defined in `src/utils/thresholds.js`:

- **Temperature**: Normal (0-50°C), Warning (50-75°C), Critical (75+°C)
- **Vibration**: Normal (0-5 Hz), Warning (5-10 Hz), Critical (10+ Hz)
- **Current**: Normal (0-10 A), Warning (10-15 A), Critical (15+ A)

## 🔌 API Integration

All API calls are handled through:
- `api.js`: Axios instance with JWT token interceptor
- `authService.js`: Authentication operations
- `machineService.js`: Machine and sensor data operations

## 🧪 Technology Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Chart library
- **Context API**: State management

## 📝 Notes

- JWT tokens are stored in localStorage
- Auto-refresh sensor data every 60 seconds
- Protected routes redirect to login if not authenticated
- Owner-only routes redirect to dashboard if accessed by operators

## 🚨 Important

Make sure the backend server is running before starting the frontend!
