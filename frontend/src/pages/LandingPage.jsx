import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, 
  Shield, 
  Bell, 
  Settings, 
  Power, 
  TrendingUp, 
  Users, 
  Lock,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Cpu,
  Cloud,
  Eye,
  Thermometer,
  Radio,
  AlertTriangle,
  BarChart,
  Smartphone,
  Server,
  Wifi,
  Brain,
  FileText,
  Download,
  Target
} from 'lucide-react';
import '../styles/landing-new.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Eye />,
      title: 'Real-Time Monitoring',
      description: 'Track temperature, vibration, and current sensor data live with 5-second updates for instant insights.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Power />,
      title: 'Remote Control',
      description: 'Control machines ON/OFF remotely from anywhere with secure ThingSpeak IoT integration.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Bell />,
      title: 'Smart Alerts',
      description: 'Get instant notifications when sensor readings exceed thresholds with intelligent queue management.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Settings />,
      title: 'Custom Thresholds',
      description: 'Set unique warning and critical limits for each machine based on specific requirements.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: <Shield />,
      title: 'Auto-Protection',
      description: 'Automatic machine shutdown after 2 minutes on critical alerts prevents equipment damage.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <TrendingUp />,
      title: 'Analytics Dashboard',
      description: 'Visualize sensor trends and patterns with interactive charts and historical data analysis.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime Reliability' },
    { value: '5s', label: 'Update Frequency' },
    { value: '24/7', label: 'Monitoring' },
    { value: '100%', label: 'Secure' }
  ];

  const capabilities = [
    {
      icon: <Thermometer />,
      title: 'Temperature Monitoring',
      description: 'Track machine temperature in real-time',
      color: '#ef4444'
    },
    {
      icon: <Radio />,
      title: 'Vibration Analysis',
      description: 'Monitor vibration levels continuously',
      color: '#8b5cf6'
    },
    {
      icon: <Zap />,
      title: 'Current Tracking',
      description: 'Measure electrical current consumption',
      color: '#f59e0b'
    },
    {
      icon: <AlertTriangle />,
      title: 'Alert System',
      description: 'Instant notifications on threshold breach',
      color: '#10b981'
    },
    {
      icon: <BarChart />,
      title: 'Data Analytics',
      description: 'Historical trends and insights',
      color: '#3b82f6'
    },
    {
      icon: <Smartphone />,
      title: 'Mobile Access',
      description: 'Monitor from any device, anywhere',
      color: '#ec4899'
    }
  ];

  const steps = [
    {
      icon: <Server />,
      title: 'Connect Machines',
      description: 'Integrate IoT sensors with your industrial equipment for comprehensive monitoring.'
    },
    {
      icon: <Wifi />,
      title: 'Sync Data',
      description: 'Automatic cloud synchronization every 5 seconds via ThingSpeak platform.'
    },
    {
      icon: <Eye />,
      title: 'Monitor Live',
      description: 'View real-time dashboards and receive instant alerts on anomalies.'
    },
    {
      icon: <Gauge />,
      title: 'Control Remotely',
      description: 'Take action remotely with automated safety and shutdown features.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Activity size={28} strokeWidth={2.5} />
            <span>Factory Pulse</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#ai-analysis">AI Analysis</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#capabilities">Capabilities</a>
          </div>
          <button className="btn-nav" onClick={() => navigate('/auth')}>
            Start Monitoring
            <ArrowRight size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content-wrapper">
            <div className="hero-text">
              <h1 className="hero-title">
                Real-Time Machine Health Monitoring
                <span className="hero-subtitle">for Industrial Excellence</span>
              </h1>
              <p className="hero-description">
                Factory Pulse provides comprehensive IoT-powered monitoring for your industrial machines. 
                Track temperature, vibration, and current sensors in real-time. Receive instant alerts when 
                thresholds are breached. Control machines remotely from anywhere. Prevent costly downtime 
                with automated safety features and intelligent analytics.
              </p>
              
              <div className="hero-features-list">
                <div className="hero-feature-item">
                  <CheckCircle2 size={20} />
                  <span>5-second real-time updates</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle2 size={20} />
                  <span>Remote machine control via ThingSpeak</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle2 size={20} />
                  <span>Automatic shutdown on critical alerts</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle2 size={20} />
                  <span>Historical data analytics & trends</span>
                </div>
              </div>

              <div className="hero-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate('/auth')}
                >
                  Start Monitoring
                  <ArrowRight size={20} />
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </button>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <div className="trust-value">99.9%</div>
                  <div className="trust-label">Uptime</div>
                </div>
                <div className="trust-item">
                  <div className="trust-value">5s</div>
                  <div className="trust-label">Update Rate</div>
                </div>
                <div className="trust-item">
                  <div className="trust-value">24/7</div>
                  <div className="trust-label">Monitoring</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="preview-title">Live Dashboard</div>
                </div>
                <div className="preview-content">
                  <div className="preview-card-row">
                    <div className="preview-card">
                      <Thermometer size={24} />
                      <div className="preview-label">Temperature</div>
                      <div className="preview-value">45.2°C</div>
                      <div className="preview-status">Normal</div>
                      <div className="preview-threshold">Threshold: 60°C</div>
                    </div>
                    <div className="preview-mini-chart">
                      <div className="mini-chart-header">
                        <span className="mini-chart-label">24h Trend</span>
                        <TrendingUp size={14} />
                      </div>
                      <svg className="sparkline" viewBox="0 0 120 40" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#14b8a6"
                          strokeWidth="2"
                          points="0,35 15,32 30,28 45,30 60,25 75,22 90,20 105,18 120,15"
                        />
                        <polyline
                          fill="url(#gradient-temp)"
                          stroke="none"
                          points="0,35 15,32 30,28 45,30 60,25 75,22 90,20 105,18 120,15 120,40 0,40"
                        />
                        <defs>
                          <linearGradient id="gradient-temp" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mini-chart-stats">
                        <span className="stat-item">Min: 42°C</span>
                        <span className="stat-item">Avg: 44°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="preview-card-row">
                    <div className="preview-card">
                      <Radio size={24} />
                      <div className="preview-label">Vibration</div>
                      <div className="preview-value">2.8 Hz</div>
                      <div className="preview-status">Optimal</div>
                      <div className="preview-threshold">Threshold: 5 Hz</div>
                    </div>
                    <div className="preview-mini-chart">
                      <div className="mini-chart-header">
                        <span className="mini-chart-label">24h Trend</span>
                        <Activity size={14} />
                      </div>
                      <svg className="sparkline" viewBox="0 0 120 40" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          points="0,30 15,28 30,32 45,29 60,31 75,28 90,30 105,27 120,29"
                        />
                        <polyline
                          fill="url(#gradient-vib)"
                          stroke="none"
                          points="0,30 15,28 30,32 45,29 60,31 75,28 90,30 105,27 120,29 120,40 0,40"
                        />
                        <defs>
                          <linearGradient id="gradient-vib" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mini-chart-stats">
                        <span className="stat-item">Min: 2.5 Hz</span>
                        <span className="stat-item">Avg: 2.7 Hz</span>
                      </div>
                    </div>
                  </div>

                  <div className="preview-card-row">
                    <div className="preview-card">
                      <Zap size={24} />
                      <div className="preview-label">Current</div>
                      <div className="preview-value">12.5 A</div>
                      <div className="preview-status">Active</div>
                      <div className="preview-threshold">Threshold: 15 A</div>
                    </div>
                    <div className="preview-mini-chart">
                      <div className="mini-chart-header">
                        <span className="mini-chart-label">24h Trend</span>
                        <Zap size={14} />
                      </div>
                      <svg className="sparkline" viewBox="0 0 120 40" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                          points="0,25 15,22 30,20 45,23 60,18 75,20 90,17 105,19 120,16"
                        />
                        <polyline
                          fill="url(#gradient-curr)"
                          stroke="none"
                          points="0,25 15,22 30,20 45,23 60,18 75,20 90,17 105,19 120,16 120,40 0,40"
                        />
                        <defs>
                          <linearGradient id="gradient-curr" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mini-chart-stats">
                        <span className="stat-item">Min: 11.8 A</span>
                        <span className="stat-item">Avg: 12.2 A</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="preview-info">
                  <div className="preview-info-item">
                    <span className="info-label">Last Update:</span>
                    <span className="info-value">2 seconds ago</span>
                  </div>
                  <div className="preview-info-item">
                    <span className="info-label">Sensors Active:</span>
                    <span className="info-value">3/3</span>
                  </div>
                  <div className="preview-info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value status-online">● Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="capabilities-section">
        <div className="capabilities-container">
          <div className="section-header">
            <h2 className="section-title">What We Monitor</h2>
            <p className="section-subtitle">
              Comprehensive real-time tracking of critical machine parameters
            </p>
          </div>

          <div className="capabilities-grid">
            {capabilities.map((capability, index) => (
              <div key={index} className="capability-card">
                <div className="capability-icon-wrapper">
                  <div className="capability-icon" style={{ color: capability.color }}>
                    {capability.icon}
                  </div>
                </div>
                <h3 className="capability-title">{capability.title}</h3>
                <p className="capability-description">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Monitoring Features</h2>
            <p className="section-subtitle">
              Everything you need for complete industrial machine health monitoring
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple setup process to protect your industrial equipment
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Analysis Section */}
      <section id="ai-analysis" className="ai-analysis-section">
        <div className="ai-analysis-container">
          <div className="section-header">
            <div className="ai-badge">
              <Brain size={20} />
              <span>NEW: AI-Powered Analysis</span>
            </div>
            <h2 className="section-title">Intelligent Machine Health Analysis</h2>
            <p className="section-subtitle">
              Advanced ML algorithms analyze your machine data and generate comprehensive health reports with actionable insights
            </p>
          </div>

          <div className="ai-features-grid">
            <div className="ai-feature-card">
              <div className="ai-feature-icon">
                <Brain size={32} />
              </div>
              <h3 className="ai-feature-title">Machine Learning Analysis</h3>
              <p className="ai-feature-description">
                Upload CSV sensor data and let our AI analyze patterns, detect anomalies, and calculate precise health scores based on machine-specific thresholds.
              </p>
              <ul className="ai-feature-list">
                <li><CheckCircle2 size={16} /> Threshold-based health scoring</li>
                <li><CheckCircle2 size={16} /> Anomaly detection algorithms</li>
                <li><CheckCircle2 size={16} /> Stress pattern analysis</li>
                <li><CheckCircle2 size={16} /> Trend prediction</li>
              </ul>
            </div>

            <div className="ai-feature-card">
              <div className="ai-feature-icon">
                <FileText size={32} />
              </div>
              <h3 className="ai-feature-title">Professional Reports</h3>
              <p className="ai-feature-description">
                Generate detailed analysis reports with statistical insights, health assessments, and maintenance recommendations tailored to each machine.
              </p>
              <ul className="ai-feature-list">
                <li><CheckCircle2 size={16} /> Comprehensive health metrics</li>
                <li><CheckCircle2 size={16} /> Statistical analysis tables</li>
                <li><CheckCircle2 size={16} /> Threshold configuration display</li>
                <li><CheckCircle2 size={16} /> Historical trend visualization</li>
              </ul>
            </div>

            <div className="ai-feature-card">
              <div className="ai-feature-icon">
                <Target size={32} />
              </div>
              <h3 className="ai-feature-title">Actionable Recommendations</h3>
              <p className="ai-feature-description">
                Receive priority-based maintenance recommendations with specific timelines and actions based on actual threshold violations and machine condition.
              </p>
              <ul className="ai-feature-list">
                <li><CheckCircle2 size={16} /> Critical/High/Medium/Low priorities</li>
                <li><CheckCircle2 size={16} /> Specific action timelines</li>
                <li><CheckCircle2 size={16} /> Threshold-aware guidance</li>
                <li><CheckCircle2 size={16} /> Root cause identification</li>
              </ul>
            </div>

            <div className="ai-feature-card">
              <div className="ai-feature-icon">
                <Download size={32} />
              </div>
              <h3 className="ai-feature-title">Export & Share</h3>
              <p className="ai-feature-description">
                Download professional reports in PDF or Word format with Factory Pulse branding. All reports are saved to database with unique IDs for tracking.
              </p>
              <ul className="ai-feature-list">
                <li><CheckCircle2 size={16} /> PDF & Word export options</li>
                <li><CheckCircle2 size={16} /> Factory Pulse branding</li>
                <li><CheckCircle2 size={16} /> Database storage with Report ID</li>
                <li><CheckCircle2 size={16} /> Print-optimized layouts</li>
              </ul>
            </div>
          </div>

          <div className="ai-stats-row">
            <div className="ai-stat-card">
              <div className="ai-stat-value">97%+</div>
              <div className="ai-stat-label">Accuracy</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-value">&lt;10s</div>
              <div className="ai-stat-label">Analysis Time</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-value">100%</div>
              <div className="ai-stat-label">Machine-Specific</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-value">24/7</div>
              <div className="ai-stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to level up your factory monitoring?</h2>
            <p className="cta-description">
              Join Factory Pulse today and experience real-time industrial intelligence
            </p>
            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate('/auth')}
              >
                Start Monitoring
                <ArrowRight size={20} />
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Activity size={32} strokeWidth={2.5} />
                <h3>Factory Pulse</h3>
              </div>
              <p className="footer-description">
                Real-time IoT-powered monitoring system for industrial excellence. 
                Track temperature, vibration, and current sensors with instant alerts 
                and intelligent analytics. Transform your factory operations with 
                automated safety features and remote machine control.
              </p>
            </div>
            <div className="footer-links">
              <button onClick={() => navigate('/auth')} className="footer-link">Sign In</button>
              <button onClick={() => navigate('/auth')} className="footer-link">Get Started</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
