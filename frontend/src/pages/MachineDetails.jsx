import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
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
  const [downloading, setDownloading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const previousDataRef = useRef({ machine: null, recentData: null });

  useEffect(() => {
    loadMachineData();
    
    // Poll for updates every 5 seconds (silent updates to prevent flicker)
    const interval = setInterval(() => {
      loadMachineData(true);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  const loadMachineData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [machineData, allData, recent] = await Promise.all([
        machineService.getMachineById(id),
        machineService.getAllData(),
        machineService.getRecentData()
      ]);
      
      // Only update if data has changed (prevents flicker)
      const machineChanged = JSON.stringify(machineData) !== JSON.stringify(previousDataRef.current.machine);
      const recentChanged = JSON.stringify(recent) !== JSON.stringify(previousDataRef.current.recentData);
      
      if (machineChanged) {
        setMachine(machineData);
        previousDataRef.current.machine = machineData;
      }
      
      if (recentChanged) {
        setRecentData(recent);
        previousDataRef.current.recentData = recent;
      }
      
      // Always update sensor data array (for charts)
      setSensorData(allData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load machine data');
    } finally {
      if (!silent) setLoading(false);
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

  const handleDownloadCSV = async () => {
    try {
      setDownloading(true);
      setDownloadError('');

      // Validate dates
      if (!startDate || !endDate) {
        setDownloadError('Please select both start and end dates');
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setDownloadError('Start date must be before end date');
        return;
      }

      // Download CSV
      const response = await machineService.downloadCSV(id, startDate, endDate);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or generate default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${machine?.name || 'machine'}_data.csv`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Clear dates after successful download
      setStartDate('');
      setEndDate('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to download CSV';
      setDownloadError(errorMsg);
      console.error('Download error:', errorMsg);
    } finally {
      setDownloading(false);
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
                {error}
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
              Note: Wait 20 seconds between toggles (ThingSpeak + ESP32 coordination)
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
                <span className="reading-label">Temperature</span>
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
                <span className="reading-label">Vibration</span>
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
                <span className="reading-label">Current</span>
                <span className="reading-value">
                  {machine?.status === 'off' ? '0.00' : recentData.current?.toFixed(2)} A
                </span>
              </div>
              <div className="reading-item" style={{ backgroundColor: '#f5f5f5' }}>
                <span className="reading-label">Last Updated</span>
                <span className="reading-value">{formatDate(recentData.timestamp)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="chart-card">
          <div className="chart-header">
            <h3>Historical Data</h3>
          </div>
          <MachineChart data={sensorData} />
          
          {/* CSV Download Section */}
          <div className="csv-download-section">
            <h4>Download Data as CSV</h4>
            <p className="download-description">
              Select a date range to download sensor readings for {machine?.name}
            </p>
            
            <div className="date-range-picker">
              <div className="date-input-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="date-input"
                />
              </div>
              
              <div className="date-input-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={startDate}
                  className="date-input"
                />
              </div>
            </div>

            {downloadError && (
              <div className="error-message" style={{ 
                color: '#f44336', 
                backgroundColor: '#ffebee', 
                padding: '10px', 
                borderRadius: '4px', 
                marginTop: '10px',
                fontSize: '14px'
              }}>
                {downloadError}
              </div>
            )}

            <button
              onClick={handleDownloadCSV}
              className="btn btn-download"
              disabled={downloading || !startDate || !endDate}
            >
              <Download size={18} />
              {downloading ? 'Downloading...' : 'Download CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
