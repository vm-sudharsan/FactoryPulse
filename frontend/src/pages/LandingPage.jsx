import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/landing.css';

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
      title: 'Real-Time Monitoring',
      description: 'Monitor temperature, vibration, and current sensor data in real-time with instant updates every 5 seconds.'
    },
    {
      title: 'Remote Machine Control',
      description: 'Turn machines ON/OFF remotely from anywhere via secure ThingSpeak IoT integration.'
    },
    {
      title: 'Smart Notifications',
      description: 'Receive intelligent alerts when sensor readings exceed configured thresholds with automatic queue management.'
    },
    {
      title: 'Machine-Specific Thresholds',
      description: 'Configure unique warning and critical thresholds for each machine based on its specifications.'
    },
    {
      title: 'Auto-Shutdown Protection',
      description: 'Critical alerts trigger automatic machine shutdown after 2 minutes if not acknowledged, preventing damage.'
    },
    {
      title: 'Historical Analytics',
      description: 'View comprehensive sensor data trends and patterns with interactive charts and historical analysis.'
    },
    {
      title: 'Role-Based Access Control',
      description: 'Owner and Operator roles with granular permissions for secure multi-user management.'
    },
    {
      title: 'Responsive Dashboard',
      description: 'Access your monitoring system from any device with a fully responsive, mobile-friendly interface.'
    },
    {
      title: 'Secure Authentication',
      description: 'JWT-based authentication ensures your data and operations remain secure and protected.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Industrial Machine Health
              <span className="hero-highlight"> Monitoring System</span>
            </h1>
            <p className="hero-description">
              Monitor, control, and analyze your industrial machines in real-time with IoT-powered intelligence. 
              Get instant alerts, prevent downtime, and optimize performance with Factory Pulse.
            </p>
            <div className="hero-buttons">
              <button
                className="btn-hero btn-hero-primary"
                onClick={() => navigate('/login')}
              >
                Start Monitoring
              </button>
              <button
                className="btn-hero btn-hero-secondary"
                onClick={() => navigate('/signup')}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features for Industrial Monitoring</h2>
            <p className="section-subtitle">
              Everything you need to monitor and manage your industrial machines effectively
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join Factory Pulse today and transform how you monitor your industrial machines
          </p>
          <button
            className="btn-cta"
            onClick={() => navigate('/signup')}
          >
            Start Monitoring Now
          </button>
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
              <button onClick={() => navigate('/login')} className="footer-link">Login</button>
              <button onClick={() => navigate('/signup')} className="footer-link">Sign Up</button>
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
