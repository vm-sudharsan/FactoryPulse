import { useNavigate } from 'react-router-dom';
import { getMachineStatusColor, getSensorStatusColor } from '../utils/helpers';

const MachineCard = ({ machine, recentData }) => {
  const navigate = useNavigate();

  // If machine is OFF, display zeros; otherwise show real sensor data
  const temperature = machine.status === 'off' ? 0 : (recentData?.temperature || 0);
  const vibration = machine.status === 'off' ? 0 : (recentData?.vibration || 0);
  const current = machine.status === 'off' ? 0 : (recentData?.current || 0);

  const overallStatus = getMachineStatusColor(temperature, vibration, current);
  
  // Get individual sensor status colors (calm, minimal colors)
  const tempColor = getSensorStatusColor(temperature, 'temperature');
  const vibColor = getSensorStatusColor(vibration, 'vibration');
  const currColor = getSensorStatusColor(current, 'current');
  
  const statusColors = {
    normal: '#81c784',    // Calm green
    warning: '#ffb74d',   // Calm yellow/orange
    critical: '#e57373'   // Calm red
  };

  const handleClick = () => {
    navigate(`/machine/${machine.id || machine._id}`);
  };

  return (
    <div 
      className="machine-card" 
      onClick={handleClick}
      style={{ borderLeft: `5px solid ${statusColors[overallStatus]}` }}
    >
      <div className="machine-card-header">
        <h3>{machine.name}</h3>
        <span className={`status-badge status-${overallStatus}`}>
          {overallStatus.toUpperCase()}
        </span>
      </div>
      
      <div className="machine-card-body">
        <div className="metric" style={{ backgroundColor: tempColor }}>
          <span className="metric-label">Temperature:</span>
          <span className="metric-value">{temperature.toFixed(1)}°C</span>
        </div>
        
        <div className="metric" style={{ backgroundColor: vibColor }}>
          <span className="metric-label">Vibration:</span>
          <span className="metric-value">{vibration.toFixed(1)} Hz</span>
        </div>
        
        <div className="metric" style={{ backgroundColor: currColor }}>
          <span className="metric-label">Current:</span>
          <span className="metric-value">{current.toFixed(1)} A</span>
        </div>
      </div>
      
      <div className="machine-card-footer">
        <span className={`power-status ${machine.status}`}>
          {machine.status === 'on' ? '● ON' : '○ OFF'}
        </span>
      </div>
    </div>
  );
};

export default MachineCard;
