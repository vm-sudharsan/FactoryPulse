const mongoose = require('mongoose');

const analysisReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  machineName: {
    type: String,
    required: true
  },
  healthScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical']
  },
  totalReadings: {
    type: Number,
    required: true
  },
  criticalEvents: {
    type: Number,
    default: 0
  },
  warningEvents: {
    type: Number,
    default: 0
  },
  anomaliesDetected: {
    type: Number,
    default: 0
  },
  thresholds: {
    temperature: {
      warning: Number,
      critical: Number
    },
    vibration: {
      warning: Number,
      critical: Number
    },
    current: {
      warning: Number,
      critical: Number
    }
  },
  trends: {
    temperature: {
      min: Number,
      max: Number,
      average: Number,
      std: Number,
      trend: String
    },
    vibration: {
      min: Number,
      max: Number,
      average: Number,
      std: Number,
      trend: String
    },
    current: {
      min: Number,
      max: Number,
      average: Number,
      std: Number,
      trend: String
    }
  },
  recommendations: [{
    priority: String,
    action: String,
    reason: String,
    severity: String
  }],
  stressEvents: [{
    timestamp: String,
    stress_level: String,
    factors: [String]
  }],
  analysisDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
analysisReportSchema.index({ machineId: 1, analysisDate: -1 });

module.exports = mongoose.model('AnalysisReport', analysisReportSchema);
