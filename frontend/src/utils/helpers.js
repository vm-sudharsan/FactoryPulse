export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getMachineStatusColor = (temperature, vibration, current) => {
  const tempStatus = getStatusLevel(temperature, 'temperature');
  const vibStatus = getStatusLevel(vibration, 'vibration');
  const currStatus = getStatusLevel(current, 'current');
  
  if (tempStatus === 'critical' || vibStatus === 'critical' || currStatus === 'critical') {
    return 'critical';
  } else if (tempStatus === 'warning' || vibStatus === 'warning' || currStatus === 'warning') {
    return 'warning';
  } else {
    return 'normal';
  }
};

export const getSensorStatusColor = (value, type) => {
  const status = getStatusLevel(value, type);
  
  // Calm, minimal colors
  const colors = {
    normal: '#e8f5e9',    // Very light green
    warning: '#fff3e0',   // Very light orange
    critical: '#ffebee'   // Very light red
  };
  
  return colors[status];
};

const getStatusLevel = (value, type) => {
  const thresholds = {
    temperature: { warning: 10, critical: 25 },
    vibration: { warning: 2, critical: 5 },
    current: { warning: 5, critical: 10 }
  };
  
  const threshold = thresholds[type];
  if (value >= threshold.critical) return 'critical';
  if (value >= threshold.warning) return 'warning';
  return 'normal';
};
