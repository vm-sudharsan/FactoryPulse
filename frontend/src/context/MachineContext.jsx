import { createContext, useState, useEffect } from 'react';
import machineService from '../services/machineService';

export const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await machineService.getAllMachines();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentData = async () => {
    try {
      const data = await machineService.getRecentData();
      setRecentData(data);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchMachines(), fetchRecentData()]);
  };

  useEffect(() => {
    // Poll for machine status and sensor data every 10 seconds for real-time updates
    const dataInterval = setInterval(() => {
      fetchRecentData();
    }, 10000); // Refresh every 10 seconds

    // Poll for machine status changes every 5 seconds
    const machineInterval = setInterval(() => {
      fetchMachines();
    }, 5000); // Refresh every 5 seconds

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
