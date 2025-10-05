import { useNavigate } from 'react-router-dom';
import { getMachineStatusColor } from '../utils/helpers';

const MachineCard = ({ machine, recentData }) => {
  const navigate = useNavigate();

  // If machine is OFF, display zeros; otherwise show real sensor data
  const temperature = machine.status === 'off' ? 0 : (recentData?.temperature || 0);
  const vibration = machine.status === 'off' ? 0 : (recentData?.vibration || 0);
  const current = machine.status === 'off' ? 0 : (recentData?.current || 0);

  const status = getMachineStatusColor(temperature, vibration, current);
  
  const statusColors = {
    normal: '#4caf50',
    warning: '#ff9800',
    critical: '#f44336'
  };

  const handleClick = () => {
    navigate(`/machine/${machine.id || machine._id}`);
  };

  return (
    <div 
      className="machine-card" 
      onClick={handleClick}
      style={{ borderLeft: `5px solid ${statusColors[status]}` }}
    >
      <div className="machine-card-header">
        <h3>{machine.name}</h3>
        <span className={`status-badge status-${status}`}>
          {status.toUpperCase()}
        </span>
      </div>
      
      <div className="machine-card-body">
        <div className="metric">
          <span className="metric-label">Temperature:</span>
          <span className="metric-value">{temperature.toFixed(1)}°C</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Vibration:</span>
          <span className="metric-value">{vibration.toFixed(1)} Hz</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Current:</span>
          <span className="metric-value">{current.toFixed(1)} A</span>
        </div>
      </div>
      
      <div className="machine-card-footer">
        <span className={`power-status ${machine.status}`}>
          {machine.status === 'on' ? '🟢 ON' : '🔴 OFF'}
        </span>
      </div>
    </div>
  );
};

export default MachineCard;
