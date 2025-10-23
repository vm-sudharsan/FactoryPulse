import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import mlService from '../services/mlService';
import '../styles/aiAnalysis.css';

const AIAnalysis = () => {
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  
  const analysisQuotes = [
    "Analyzing sensor patterns and detecting anomalies...",
    "Processing machine health indicators...",
    "Evaluating stress patterns and trends...",
    "Generating intelligent recommendations...",
    "Calculating health scores and predictions..."
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
        setReport(null);
      } else {
        setError('Please select a CSV file');
        setFile(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');
      setProgress(0);
      setReport(null);
      
      // Simulate progressive loading with phases
      const phases = [
        { progress: 20, phase: 'Uploading and validating CSV file...', delay: 800 },
        { progress: 40, phase: 'Extracting machine parameters...', delay: 1000 },
        { progress: 60, phase: 'Running AI analysis algorithms...', delay: 1500 },
        { progress: 80, phase: 'Generating health predictions...', delay: 1200 },
        { progress: 95, phase: 'Compiling comprehensive report...', delay: 800 }
      ];
      
      // Start analysis in background
      const analysisPromise = mlService.analyzeCSV(file);
      
      // Show progressive loading
      for (const { progress: prog, phase, delay } of phases) {
        setProgress(prog);
        setLoadingPhase(phase);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Wait for actual analysis to complete
      const result = await analysisPromise;
      
      // Final progress
      setProgress(100);
      setLoadingPhase('Analysis complete!');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.success) {
        // Navigate to report page with data
        navigate('/analysis-report', { state: { report: result } });
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze file');
    } finally {
      setAnalyzing(false);
      setProgress(0);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 85) return '#4caf50';
    if (score >= 70) return '#8bc34a';
    if (score >= 50) return '#ff9800';
    if (score >= 30) return '#ff5722';
    return '#f44336';
  };

  const getStressColor = (level) => {
    if (level === 'Critical') return '#f44336';
    if (level === 'High') return '#ff9800';
    return '#2196f3';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return '#d32f2f';
    if (priority === 'High') return '#f44336';
    if (priority === 'Medium') return '#ff9800';
    return '#4caf50';
  };

  return (
    <div className="ai-analysis-page">
      <Navbar />
      
      <div className="ai-analysis-container">
        <div className="page-header">
          <button onClick={() => navigate('/dashboard')} className="btn btn-back">
            ← Back to Dashboard
          </button>
          <h1>AI-Powered Machinery Analysis</h1>
          <p className="page-description">
            Upload sensor data CSV to get comprehensive health analysis and recommendations
          </p>
        </div>

        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-icon">
              <Upload size={48} />
            </div>
            <h3>Upload CSV File</h3>
            <p>Select a CSV file containing sensor readings (temperature, vibration, current)</p>
            
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                id="csv-file"
                className="file-input"
              />
              <label htmlFor="csv-file" className="file-label">
                <FileText size={20} />
                {file ? file.name : 'Choose CSV File'}
              </label>
            </div>

            {file && (
              <div className="file-info">
                <CheckCircle size={16} color="#4caf50" />
                <span>File selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}

            {error && (
              <div className="error-message">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              className="btn btn-primary btn-analyze"
              disabled={!file || analyzing}
            >
              {analyzing ? (
                <>
                  <Activity size={18} className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity size={18} />
                  Analyze Data
                </>
              )}
            </button>

            <div className="csv-format-info">
              <h4>Required CSV Format:</h4>
              <code>
                temperature,vibration,current<br/>
                45.2,2.8,12.5<br/>
                46.1,2.9,12.7
              </code>
            </div>
          </div>
        </div>

        {analyzing && (
          <div className="professional-loading-screen">
            <div className="loading-content">
              <div className="loading-quote">
                <h2>AI Analysis in Progress</h2>
                <p className="quote-text">
                  {analysisQuotes[Math.floor((progress / 100) * analysisQuotes.length)] || analysisQuotes[0]}
                </p>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar-wrapper">
                  <div className="progress-bar" style={{ width: `${progress}%` }}>
                    <span className="progress-percentage">{progress}%</span>
                  </div>
                </div>
                <p className="loading-phase">{loadingPhase}</p>
              </div>
              
              <div className="loading-details">
                <div className="loading-step">
                  <div className={`step-icon ${progress >= 20 ? 'completed' : ''}`}>✓</div>
                  <span>File Validation</span>
                </div>
                <div className="loading-step">
                  <div className={`step-icon ${progress >= 40 ? 'completed' : ''}`}>✓</div>
                  <span>Data Extraction</span>
                </div>
                <div className="loading-step">
                  <div className={`step-icon ${progress >= 60 ? 'completed' : ''}`}>✓</div>
                  <span>AI Analysis</span>
                </div>
                <div className="loading-step">
                  <div className={`step-icon ${progress >= 80 ? 'completed' : ''}`}>✓</div>
                  <span>Health Prediction</span>
                </div>
                <div className="loading-step">
                  <div className={`step-icon ${progress >= 95 ? 'completed' : ''}`}>✓</div>
                  <span>Report Generation</span>
                </div>
              </div>
              
              <div className="loading-footer">
                <p>Analyzing {file?.name}</p>
                <p className="loading-tip">Tip: Our AI uses machine-specific thresholds for accurate analysis</p>
              </div>
            </div>
          </div>
        )}

        {report && report.success && (
          <div className="report-section">
            <div className="report-header-enhanced">
              <div className="report-title-section">
                <h2>📊 Comprehensive Analysis Report</h2>
                {report.overall_health.machine_name && report.overall_health.machine_name !== 'Unknown' && (
                  <h3 className="machine-name-title">{report.overall_health.machine_name}</h3>
                )}
                <span className="analysis-date">
                  Generated on {report.overall_health.analysis_date}
                </span>
              </div>
              <div className="report-actions">
                <button className="btn-report-action" onClick={() => window.print()}>
                  📄 Print Report
                </button>
                <button className="btn-report-action" onClick={() => setReport(null)}>
                  🔄 New Analysis
                </button>
              </div>
            </div>
            
            {/* Executive Summary */}
            <div className="executive-summary">
              <h3>Executive Summary</h3>
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="summary-icon">📈</div>
                  <div className="summary-content">
                    <span className="summary-label">Overall Status</span>
                    <span className="summary-value" style={{ color: getHealthColor(report.overall_health.score) }}>
                      {report.overall_health.status}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">🎯</div>
                  <div className="summary-content">
                    <span className="summary-label">Health Score</span>
                    <span className="summary-value">{report.overall_health.score}/100</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">📊</div>
                  <div className="summary-content">
                    <span className="summary-label">Data Points</span>
                    <span className="summary-value">{report.overall_health.total_readings}</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">⚠️</div>
                  <div className="summary-content">
                    <span className="summary-label">Critical Events</span>
                    <span className="summary-value critical-text">{report.summary.critical_events}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="health-overview">
              <div className="health-score-card">
                <div className="score-circle" style={{ borderColor: getHealthColor(report.overall_health.score) }}>
                  <span className="score-value">{report.overall_health.score}</span>
                  <span className="score-label">Health Score</span>
                </div>
                <div className="health-details">
                  <h3 style={{ color: getHealthColor(report.overall_health.score) }}>
                    {report.overall_health.status}
                  </h3>
                  <p>Based on {report.overall_health.total_readings} readings</p>
                  <p className="health-trend">
                    <TrendingUp size={16} />
                    Trend: {report.summary.health_trend}
                  </p>
                  
                  {report.machine_thresholds && (
                    <div className="thresholds-info" style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      background: '#f8f9fa', 
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}>
                      <strong>Machine Thresholds:</strong>
                      <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.25rem' }}>
                        <span>🌡️ Temp: {report.machine_thresholds.temperature.warning}°C / {report.machine_thresholds.temperature.critical}°C</span>
                        <span>📳 Vib: {report.machine_thresholds.vibration.warning} Hz / {report.machine_thresholds.vibration.critical} Hz</span>
                        <span>⚡ Curr: {report.machine_thresholds.current.warning} A / {report.machine_thresholds.current.critical} A</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-value">{report.summary.total_stress_events}</span>
                  <span className="stat-label">Stress Events</span>
                </div>
                <div className="stat-item critical">
                  <span className="stat-value">{report.summary.critical_events}</span>
                  <span className="stat-label">Critical Events</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{report.summary.anomalies_detected}</span>
                  <span className="stat-label">Anomalies</span>
                </div>
              </div>
            </div>

            <div className="trends-section-enhanced">
              <h3>📈 Sensor Performance Trends</h3>
              <p className="section-description">Statistical analysis of sensor readings over the analyzed period</p>
              <div className="trends-grid">
                {Object.entries(report.trends).map(([sensor, data]) => {
                  const sensorIcons = {
                    temperature: '🌡️',
                    vibration: '📳',
                    current: '⚡'
                  };
                  const trendColors = {
                    'Increasing': '#ff9800',
                    'Decreasing': '#2196f3',
                    'Stable': '#4caf50'
                  };
                  return (
                    <div key={sensor} className="trend-card-enhanced">
                      <div className="trend-header">
                        <span className="trend-icon">{sensorIcons[sensor]}</span>
                        <h4>{sensor.charAt(0).toUpperCase() + sensor.slice(1)}</h4>
                        <span 
                          className="trend-badge" 
                          style={{ backgroundColor: trendColors[data.trend] || '#718096' }}
                        >
                          {data.trend}
                        </span>
                      </div>
                      <div className="trend-stats-grid">
                        <div className="stat-box">
                          <span className="stat-label">Average</span>
                          <span className="stat-value">{data.average}</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-label">Min</span>
                          <span className="stat-value">{data.min}</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-label">Max</span>
                          <span className="stat-value">{data.max}</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-label">Std Dev</span>
                          <span className="stat-value">{data.std}</span>
                        </div>
                      </div>
                      <div className="trend-visual">
                        <div className="range-bar">
                          <div 
                            className="range-indicator" 
                            style={{ 
                              left: `${((data.average - data.min) / (data.max - data.min)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="range-labels">
                          <span>{data.min}</span>
                          <span>{data.max}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {report.recommendations && report.recommendations.length > 0 && (
              <div className="recommendations-section-enhanced">
                <h3>🎯 Actionable Recommendations</h3>
                <p className="section-description">
                  AI-generated recommendations based on analysis of {report.overall_health.total_readings} data points
                </p>
                <div className="recommendations-list">
                  {report.recommendations.map((rec, index) => {
                    const priorityIcons = {
                      'Critical': '🚨',
                      'High': '⚠️',
                      'Medium': '📋',
                      'Low': '✅'
                    };
                    return (
                      <div key={index} className="recommendation-card">
                        <div className="rec-header">
                          <span className="rec-icon">{priorityIcons[rec.priority]}</span>
                          <span 
                            className="rec-priority-badge" 
                            style={{ backgroundColor: getPriorityColor(rec.priority) }}
                          >
                            {rec.priority} Priority
                          </span>
                          <span className="rec-number">#{index + 1}</span>
                        </div>
                        <div className="rec-body">
                          <h4 className="rec-action">{rec.action}</h4>
                          <p className="rec-reason">{rec.reason}</p>
                          {rec.severity && (
                            <div className="rec-severity">
                              <span className="severity-label">Severity:</span>
                              <span className="severity-value">{rec.severity}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {report.stress_events && report.stress_events.length > 0 && (
              <div className="stress-events-section">
                <h3>Stress Events ({report.stress_events.length})</h3>
                <div className="events-list">
                  {report.stress_events.slice(0, 10).map((event, index) => (
                    <div key={index} className="event-item">
                      <div className="event-header">
                        <span className="event-time">{event.timestamp}</span>
                        <span 
                          className="event-level"
                          style={{ backgroundColor: getStressColor(event.stress_level) }}
                        >
                          {event.stress_level}
                        </span>
                      </div>
                      <div className="event-issues">
                        {event.issues.map((issue, i) => (
                          <span key={i} className="issue-tag">{issue}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {report.stress_events.length > 10 && (
                    <p className="more-events">
                      + {report.stress_events.length - 10} more events
                    </p>
                  )}
                </div>
              </div>
            )}

            {report.anomalies && report.anomalies.length > 0 && (
              <div className="anomalies-section">
                <h3>Anomalies Detected ({report.anomalies.length})</h3>
                <div className="anomalies-list">
                  {report.anomalies.slice(0, 5).map((anomaly, index) => (
                    <div key={index} className="anomaly-item">
                      <span className="anomaly-time">{anomaly.timestamp}</span>
                      <span className="anomaly-reason">{anomaly.reason}</span>
                      <div className="anomaly-values">
                        <span>T: {anomaly.temperature}°C</span>
                        <span>V: {anomaly.vibration} Hz</span>
                        <span>C: {anomaly.current} A</span>
                      </div>
                    </div>
                  ))}
                  {report.anomalies.length > 5 && (
                    <p className="more-anomalies">
                      + {report.anomalies.length - 5} more anomalies
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
