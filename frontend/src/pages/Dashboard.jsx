import { useState, useEffect, useContext } from 'react';
import { MachineContext } from '../context/MachineContext';
import Navbar from '../components/Navbar';
import MachineGrid from '../components/MachineGrid';
import Loader from '../components/Loader';
import machineService from '../services/machineService';

const Dashboard = () => {
  const { machines, recentData, loading, fetchMachines, fetchRecentData } = useContext(MachineContext);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  // Update last update time when data changes
  useEffect(() => {
    if (machines.length > 0 || recentData) {
      setLastUpdate(new Date());
    }
  }, [machines, recentData]);

  const loadData = async () => {
    await Promise.all([fetchMachines(), fetchRecentData()]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Machine Dashboard</h1>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Real-time monitoring - Auto-updates every 5 seconds
            </p>
          </div>
          <button 
            onClick={handleRefresh} 
            className="btn btn-secondary"
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <MachineGrid machines={machines} recentData={recentData} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
