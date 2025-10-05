import { AuthProvider } from './context/AuthContext';
import { MachineProvider } from './context/MachineContext';
import AppRouter from './router/AppRouter';
import './styles/globals.css';
import './styles/auth.css';
import './styles/dashboard.css';

function App() {
  return (
    <AuthProvider>
      <MachineProvider>
        <AppRouter />
      </MachineProvider>
    </AuthProvider>
  );
}

export default App;
