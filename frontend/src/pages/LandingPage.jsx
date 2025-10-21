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
  Wifi
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
                  <div className="preview-card">
                    <Thermometer size={24} />
                    <div className="preview-label">Temperature</div>
                    <div className="preview-value">45.2°C</div>
                  </div>
                  <div className="preview-card">
                    <Radio size={24} />
                    <div className="preview-label">Vibration</div>
                    <div className="preview-value">2.8 Hz</div>
                  </div>
                  <div className="preview-card">
                    <Zap size={24} />
                    <div className="preview-label">Current</div>
                    <div className="preview-value">12.5 A</div>
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
              <h3>Factory Pulse</h3>
              <p>Industrial Machine Health Monitoring System</p>
            </div>
            <div className="footer-links">
              <button onClick={() => navigate('/auth')} className="footer-link">Sign In</button>
              <button onClick={() => navigate('/auth')} className="footer-link">Get Started</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Factory Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
