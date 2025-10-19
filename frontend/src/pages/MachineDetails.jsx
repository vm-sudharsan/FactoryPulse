import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MachineChart from '../components/MachineChart';
import Loader from '../components/Loader';
import machineService from '../services/machineService';
import { formatDate, getSensorStatusColor } from '../utils/helpers';

const MachineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [machine, setMachine] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMachineData();
  }, [id]);

  const loadMachineData = async () => {
    try {
      setLoading(true);
      const [machineData, allData, recent] = await Promise.all([
        machineService.getMachineById(id),
        machineService.getAllData(),
        machineService.getRecentData()
      ]);
      
      setMachine(machineData);
      setSensorData(allData);
      setRecentData(recent);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load machine data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setToggling(true);
      setError(''); // Clear previous errors
      const response = await machineService.toggleMachine(id);
      setMachine(response.machine);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to toggle machine';
      setError(errorMsg);
      console.error('Toggle error:', errorMsg);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="machine-details-page">
      <Navbar />
      
      <div className="machine-details-container">
        <div className="details-header">
          <button onClick={() => navigate('/dashboard')} className="btn btn-back">
            ← Back to Dashboard
          </button>
          <h1>{machine?.name}</h1>
        </div>

        <div className="machine-info-card">
          <div className="info-section">
            <h3>Machine Information</h3>
            <p><strong>Name:</strong> {machine?.name}</p>
            <p><strong>Description:</strong> {machine?.description || 'No description'}</p>
            <p><strong>ThingSpeak Field:</strong> {machine?.thingspeakFieldId}</p>
            <p><strong>Status:</strong> 
              <span className={`status-badge ${machine?.status}`}>
                {machine?.status?.toUpperCase()}
              </span>
            </p>
          </div>

          <div className="control-section">
            <h3>Machine Control</h3>
            {error && (
              <div className="error-message" style={{ 
                color: '#f44336', 
                backgroundColor: '#ffebee', 
                padding: '10px', 
                borderRadius: '4px', 
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                ⚠️ {error}
              </div>
            )}
            <button
              onClick={handleToggle}
              className={`btn btn-toggle ${machine?.status === 'on' ? 'btn-danger' : 'btn-success'}`}
              disabled={toggling}
            >
              {toggling ? 'Processing...' : machine?.status === 'on' ? 'Turn OFF' : 'Turn ON'}
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              ⏱️ Note: Wait 20 seconds between toggles (ThingSpeak + ESP32 coordination)
            </p>
          </div>
        </div>

        {recentData && (
          <div className="recent-readings-card">
            <h3>Recent Sensor Readings</h3>
            <div className="readings-grid">
              <div 
                className="reading-item" 
                style={{ 
                  backgroundColor: machine?.status === 'off' 
                    ? '#f5f5f5' 
                    : getSensorStatusColor(recentData.temperature, 'temperature')
                }}
              >
                <span className="reading-label">🌡️ Temperature</span>
                <span className="reading-value">
                  {machine?.status === 'off' ? '0.00' : recentData.temperature?.toFixed(2)}°C
                </span>
              </div>
              <div 
                className="reading-item"
                style={{ 
                  backgroundColor: machine?.status === 'off' 
                    ? '#f5f5f5' 
                    : getSensorStatusColor(recentData.vibration, 'vibration')
                }}
              >
                <span className="reading-label">📳 Vibration</span>
                <span className="reading-value">
                  {machine?.status === 'off' ? '0.00' : recentData.vibration?.toFixed(2)} Hz
                </span>
              </div>
              <div 
                className="reading-item"
                style={{ 
                  backgroundColor: machine?.status === 'off' 
                    ? '#f5f5f5' 
                    : getSensorStatusColor(recentData.current, 'current')
                }}
              >
                <span className="reading-label">⚡ Current</span>
                <span className="reading-value">
                  {machine?.status === 'off' ? '0.00' : recentData.current?.toFixed(2)} A
                </span>
              </div>
              <div className="reading-item" style={{ backgroundColor: '#f5f5f5' }}>
                <span className="reading-label">🕐 Last Updated</span>
                <span className="reading-value">{formatDate(recentData.timestamp)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="chart-card">
          <h3>Historical Data</h3>
          <MachineChart data={sensorData} />
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
