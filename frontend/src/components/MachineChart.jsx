import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatTime } from '../utils/helpers';

const MachineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    time: formatTime(item.timestamp),
    temperature: item.temperature,
    vibration: item.vibration,
    current: item.current
  }));

  // Responsive height based on screen size
  const getChartHeight = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 480) return 300;
      if (window.innerWidth < 768) return 350;
    }
    return 400;
  };

  return (
    <div className="machine-chart">
      <ResponsiveContainer width="100%" height={getChartHeight()}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#f44336" 
            name="Temperature (°C)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="vibration" 
            stroke="#2196f3" 
            name="Vibration (Hz)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#4caf50" 
            name="Current (A)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MachineChart;
