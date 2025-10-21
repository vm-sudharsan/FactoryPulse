import { createContext, useState, useEffect, useRef, useContext } from 'react';
import machineService from '../services/machineService';
import { AuthContext } from './AuthContext';

export const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const previousMachinesRef = useRef([]);
  const previousDataRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchMachines = async (silent = false) => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) return;
    
    try {
      if (!silent) setLoading(true);
      const data = await machineService.getAllMachines();
      
      // Only update if data has changed (prevents unnecessary re-renders)
      const dataChanged = JSON.stringify(data) !== JSON.stringify(previousMachinesRef.current);
      if (dataChanged) {
        setMachines(data);
        previousMachinesRef.current = data;
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchRecentData = async (silent = false) => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) return;
    
    try {
      const data = await machineService.getRecentData();
      
      // Only update if data has changed (prevents flicker)
      const dataChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
      if (dataChanged) {
        setRecentData(data);
        previousDataRef.current = data;
      }
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  const refreshData = async () => {
    if (!isAuthenticated) return;
    await Promise.all([fetchMachines(), fetchRecentData()]);
  };

  useEffect(() => {
    // Only start fetching data if user is authenticated
    if (!isAuthenticated) {
      // Clear data when user logs out
      setMachines([]);
      setRecentData(null);
      previousMachinesRef.current = [];
      previousDataRef.current = null;
      return;
    }

    // Initial fetch with loading state
    fetchMachines();
    fetchRecentData();
    
    // Poll for sensor data every 10 seconds (silent updates)
    const dataInterval = setInterval(() => {
      fetchRecentData(true);
    }, 10000);

    // Poll for machine status changes every 5 seconds (silent updates)
    const machineInterval = setInterval(() => {
      fetchMachines(true);
    }, 5000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(machineInterval);
    };
  }, [isAuthenticated]); // Re-run when authentication status changes

  const value = {
    machines,
    recentData,
    loading,
    fetchMachines,
    fetchRecentData,
    refreshData,
    setMachines
  };

  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>;
};
