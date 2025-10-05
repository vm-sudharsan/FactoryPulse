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
    const interval = setInterval(() => {
      fetchRecentData();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
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
