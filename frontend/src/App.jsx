import { AuthProvider } from './context/AuthContext';
import { MachineProvider } from './context/MachineContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './router/AppRouter';
import './styles/globals.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/notifications.css';
import './styles/ai-analysis.css';

function App() {
  return (
    <AuthProvider>
      <MachineProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </MachineProvider>
    </AuthProvider>
  );
}

export default App;
