import { useState, useEffect, useContext } from 'react';
import { MachineContext } from '../context/MachineContext';
import Navbar from '../components/Navbar';
import MachineGrid from '../components/MachineGrid';
import Loader from '../components/Loader';
import machineService from '../services/machineService';

const Dashboard = () => {
  const { machines, recentData, loading, fetchMachines, fetchRecentData } = useContext(MachineContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
          <h1>Machine Dashboard</h1>
          <button 
            onClick={handleRefresh} 
            className="btn btn-secondary"
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
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
