export const THRESHOLDS = {
  temperature: {
    normal: { min: 0, max: 50 },
    warning: { min: 50, max: 75 },
    critical: { min: 75, max: 150 }
  },
  vibration: {
    normal: { min: 0, max: 5 },
    warning: { min: 5, max: 10 },
    critical: { min: 10, max: 50 }
  },
  current: {
    normal: { min: 0, max: 10 },
    warning: { min: 10, max: 15 },
    critical: { min: 15, max: 50 }
  }
};

export const getStatus = (value, type) => {
  const threshold = THRESHOLDS[type];
  
  if (value >= threshold.critical.min) {
    return 'critical';
  } else if (value >= threshold.warning.min) {
    return 'warning';
  } else {
    return 'normal';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'normal':
      return '#4caf50';
    case 'warning':
      return '#ff9800';
    case 'critical':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};
