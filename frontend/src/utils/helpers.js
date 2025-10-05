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

const getStatusLevel = (value, type) => {
  const thresholds = {
    temperature: { warning: 50, critical: 75 },
    vibration: { warning: 5, critical: 10 },
    current: { warning: 10, critical: 15 }
  };
  
  const threshold = thresholds[type];
  if (value >= threshold.critical) return 'critical';
  if (value >= threshold.warning) return 'warning';
  return 'normal';
};
