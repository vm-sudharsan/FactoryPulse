import { createContext, useState, useEffect, useRef } from 'react';
import machineService from '../services/machineService';

export const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const previousMachinesRef = useRef([]);
  const previousDataRef = useRef(null);

  const fetchMachines = async (silent = false) => {
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
    await Promise.all([fetchMachines(), fetchRecentData()]);
  };

  useEffect(() => {
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
  }, []);

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
