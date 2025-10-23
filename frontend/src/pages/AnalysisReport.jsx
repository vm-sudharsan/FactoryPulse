import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import '../styles/analysisReport.css';

const AnalysisReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);

  if (!report || !report.success) {
    navigate('/ai-analysis');
    return null;
  }

  const getHealthColor = (score) => {
    if (score >= 85) return '#4caf50';
    if (score >= 70) return '#8bc34a';
    if (score >= 50) return '#ff9800';
    if (score >= 30) return '#ff5722';
    return '#f44336';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return '#d32f2f';
    if (priority === 'High') return '#f44336';
    if (priority === 'Medium') return '#ff9800';
    return '#4caf50';
  };

  const handlePrint = () => {
    window.print();
  };

  const generateWordDocument = async () => {
    try {
      const reportId = report.reportId || `RPT-${Date.now()}`;
      const currentDate = new Date().toLocaleString();
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header with Factory Pulse branding
            new Paragraph({
              text: "FACTORY PULSE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: "Machine Health Analysis Report",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // Report metadata
            new Paragraph({
              children: [
                new TextRun({ text: "Report ID: ", bold: true }),
                new TextRun(reportId)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Generated: ", bold: true }),
                new TextRun(currentDate)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Machine: ", bold: true }),
                new TextRun(report.overall_health.machine_name)
              ],
              spacing: { after: 400 }
            }),
            
            // Health Assessment
            new Paragraph({
              text: "Overall Health Assessment",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Health Score: ", bold: true }),
                new TextRun(`${report.overall_health.score}% (${report.overall_health.status})`)
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Total Data Points: ", bold: true }),
                new TextRun(report.overall_health.total_readings.toString())
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Critical Events: ", bold: true }),
                new TextRun(report.summary.critical_events.toString())
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Warning Events: ", bold: true }),
                new TextRun((report.summary.total_stress_events - report.summary.critical_events).toString())
              ],
              spacing: { after: 400 }
            }),
            
            // Recommendations
            new Paragraph({
              text: "Recommendations",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 }
            }),
            ...report.recommendations.map((rec, index) => 
              new Paragraph({
                children: [
                  new TextRun({ text: `${index + 1}. [${rec.priority}] `, bold: true }),
                  new TextRun({ text: rec.action + " - ", bold: true }),
                  new TextRun(rec.reason)
                ],
                spacing: { after: 200 }
              })
            ),
            
            // Footer
            new Paragraph({
              text: "\n\nGenerated by Factory Pulse AI Analysis System",
              alignment: AlignmentType.CENTER,
              spacing: { before: 400 }
            })
          ]
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const fileName = `${report.overall_health.machine_name}_Analysis_Report_${new Date().toISOString().split('T')[0]}.docx`;
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to generate Word document.');
    }
  };

  const handleDownload = async () => {
    if (downloadFormat === 'word') {
      await generateWordDocument();
      return;
    }
    
    try {
      const reportElement = document.querySelector('.report-container');
      const actionBar = document.querySelector('.report-actions-bar');
      
      // Hide action bar temporarily
      if (actionBar) actionBar.style.display = 'none';
      
      // Capture the report as canvas
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Show action bar again
      if (actionBar) actionBar.style.display = 'flex';
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Save PDF
      const fileName = `${report.overall_health.machine_name}_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try printing instead.');
    }
  };

  return (
    <div className="analysis-report-page">
      <Navbar />
      
      <div className="report-container">
        {/* Report Actions Bar */}
        <div className="report-actions-bar no-print">
          <button className="btn-back" onClick={() => navigate('/ai-analysis')}>
            <ArrowLeft size={18} />
            Back to Analysis
          </button>
          <div className="action-buttons">
            <div className="download-dropdown">
              <button className="btn-action" onClick={handleDownload}>
                <Download size={18} />
                Download as {downloadFormat.toUpperCase()}
              </button>
              <button 
                className="btn-dropdown-toggle" 
                onClick={() => setShowFormatDropdown(!showFormatDropdown)}
              >
                <ChevronDown size={16} />
              </button>
              {showFormatDropdown && (
                <div className="format-dropdown-menu">
                  <div 
                    className={`format-option ${downloadFormat === 'pdf' ? 'active' : ''}`}
                    onClick={() => {
                      setDownloadFormat('pdf');
                      setShowFormatDropdown(false);
                    }}
                  >
                    PDF Document
                  </div>
                  <div 
                    className={`format-option ${downloadFormat === 'word' ? 'active' : ''}`}
                    onClick={() => {
                      setDownloadFormat('word');
                      setShowFormatDropdown(false);
                    }}
                  >
                    Word Document
                  </div>
                </div>
              )}
            </div>
            <button className="btn-action" onClick={handlePrint}>
              <Printer size={18} />
              Print Report
            </button>
          </div>
        </div>

        {/* Report Header */}
        <div className="report-header">
          <div className="report-branding">
            <div className="factory-pulse-logo">
              <div className="logo-icon">FP</div>
              <div className="logo-text">
                <span className="brand-name">FACTORY PULSE</span>
                <span className="brand-tagline">AI-Powered Machine Health Monitoring</span>
              </div>
            </div>
          </div>
          <div className="report-title">
            <h1>Machine Health Analysis Report</h1>
            <div className="report-meta">
              <div className="meta-item">
                <span className="meta-label">Machine:</span>
                <span className="machine-name">{report.overall_health.machine_name}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Report ID:</span>
                <span className="report-id">{report.reportId || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Generated:</span>
                <span className="report-date">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Score Section */}
        <div className="report-section">
          <h2 className="section-title">Overall Health Assessment</h2>
          <div className="health-score-container">
            <div className="score-display">
              <div 
                className="score-circle-large" 
                style={{ 
                  borderColor: getHealthColor(report.overall_health.score),
                  background: `conic-gradient(${getHealthColor(report.overall_health.score)} ${report.overall_health.score * 3.6}deg, #e0e0e0 0deg)`
                }}
              >
                <div className="score-inner">
                  <span className="score-number">{report.overall_health.score}%</span>
                  <span className="score-status">{report.overall_health.status}</span>
                </div>
              </div>
            </div>
            <div className="health-metrics">
              <div className="metric-item">
                <span className="metric-label">Total Data Points</span>
                <span className="metric-value">{report.overall_health.total_readings}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Critical Events</span>
                <span className="metric-value critical">{report.summary.critical_events}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Warning Events</span>
                <span className="metric-value warning">
                  {report.summary.total_stress_events - report.summary.critical_events}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Anomalies Detected</span>
                <span className="metric-value">{report.summary.anomalies_detected}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Health Trend</span>
                <span className="metric-value">{report.summary.health_trend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Machine Configuration */}
        <div className="report-section">
          <h2 className="section-title">Machine Configuration</h2>
          <div className="config-grid">
            <div className="config-card">
              <h3>Temperature Thresholds</h3>
              <div className="threshold-values">
                <div className="threshold-item">
                  <span className="threshold-label">Warning Level</span>
                  <span className="threshold-value">{report.machine_thresholds.temperature.warning}°C</span>
                </div>
                <div className="threshold-item">
                  <span className="threshold-label">Critical Level</span>
                  <span className="threshold-value critical">{report.machine_thresholds.temperature.critical}°C</span>
                </div>
              </div>
            </div>
            <div className="config-card">
              <h3>Vibration Thresholds</h3>
              <div className="threshold-values">
                <div className="threshold-item">
                  <span className="threshold-label">Warning Level</span>
                  <span className="threshold-value">{report.machine_thresholds.vibration.warning} Hz</span>
                </div>
                <div className="threshold-item">
                  <span className="threshold-label">Critical Level</span>
                  <span className="threshold-value critical">{report.machine_thresholds.vibration.critical} Hz</span>
                </div>
              </div>
            </div>
            <div className="config-card">
              <h3>Current Thresholds</h3>
              <div className="threshold-values">
                <div className="threshold-item">
                  <span className="threshold-label">Warning Level</span>
                  <span className="threshold-value">{report.machine_thresholds.current.warning} A</span>
                </div>
                <div className="threshold-item">
                  <span className="threshold-label">Critical Level</span>
                  <span className="threshold-value critical">{report.machine_thresholds.current.critical} A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Analysis */}
        <div className="report-section">
          <h2 className="section-title">Statistical Analysis</h2>
          <p className="section-subtitle">Comprehensive statistical breakdown of sensor readings</p>
          
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Minimum</th>
                  <th>Maximum</th>
                  <th>Average</th>
                  <th>Std Deviation</th>
                  <th>Trend</th>
                  <th>Range Visualization</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.trends).map(([sensor, data]) => {
                  const sensorLabels = {
                    temperature: { name: 'Temperature', unit: '°C' },
                    vibration: { name: 'Vibration', unit: 'Hz' },
                    current: { name: 'Current', unit: 'A' }
                  };
                  const label = sensorLabels[sensor];
                  
                  return (
                    <tr key={sensor}>
                      <td className="param-name">{label.name}</td>
                      <td className="stat-number">{data.min} {label.unit}</td>
                      <td className="stat-number">{data.max} {label.unit}</td>
                      <td className="stat-number highlight">{data.average} {label.unit}</td>
                      <td className="stat-number">{data.std}</td>
                      <td>
                        <span className={`trend-badge trend-${data.trend.toLowerCase()}`}>
                          {data.trend}
                        </span>
                      </td>
                      <td className="range-cell">
                        <div className="mini-range-bar">
                          <div className="mini-range-fill" style={{
                            width: `${((data.average - data.min) / (data.max - data.min)) * 100}%`
                          }}></div>
                          <div className="mini-range-marker" style={{
                            left: `${((data.average - data.min) / (data.max - data.min)) * 100}%`
                          }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="report-section">
          <h2 className="section-title">Analysis Summary</h2>
          <div className="summary-content">
            <p className="summary-text">
              Analysis of <strong>{report.overall_health.total_readings} data points</strong> from{' '}
              <strong>{report.overall_health.machine_name}</strong> reveals an overall health score of{' '}
              <strong style={{ color: getHealthColor(report.overall_health.score) }}>
                {report.overall_health.score}%
              </strong>, classified as <strong>{report.overall_health.status}</strong>.
            </p>
            
            {report.summary.critical_events > 0 && (
              <p className="summary-text alert">
                <strong>Critical Alert:</strong> {report.summary.critical_events} critical event(s) detected,
                indicating severe threshold violations that require immediate attention.
              </p>
            )}
            
            {report.summary.total_stress_events > report.summary.critical_events && (
              <p className="summary-text warning">
                <strong>Warning:</strong> {report.summary.total_stress_events - report.summary.critical_events} warning-level
                event(s) detected, suggesting the machine is operating near threshold limits.
              </p>
            )}
            
            <p className="summary-text">
              The health trend is <strong>{report.summary.health_trend}</strong>.{' '}
              {report.summary.anomalies_detected > 0 && (
                <span>
                  Additionally, <strong>{report.summary.anomalies_detected} anomalies</strong> were detected
                  in the sensor readings, indicating unusual operational patterns.
                </span>
              )}
            </p>

            <div className="sensor-summary">
              <h3>Sensor Performance</h3>
              {Object.entries(report.trends).map(([sensor, data]) => (
                <p key={sensor} className="sensor-summary-item">
                  <strong>{sensor.charAt(0).toUpperCase() + sensor.slice(1)}:</strong>{' '}
                  Ranged from {data.min} to {data.max} (average: {data.average}), showing a{' '}
                  <strong className={`trend-${data.trend.toLowerCase()}`}>{data.trend}</strong> trend.
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="report-section">
          <h2 className="section-title">Recommendations</h2>
          <div className="recommendations-list">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="rec-header">
                  <span 
                    className="rec-priority" 
                    style={{ backgroundColor: getPriorityColor(rec.priority) }}
                  >
                    {rec.priority}
                  </span>
                  <span className="rec-number">#{index + 1}</span>
                </div>
                <div className="rec-content">
                  <h4>{rec.action}</h4>
                  <p>{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="report-footer">
          <p>This report was automatically generated by the Factory Pulse AI Analysis System</p>
          <p>Report ID: {Date.now().toString(36).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
