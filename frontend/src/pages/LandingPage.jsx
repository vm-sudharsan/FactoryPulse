import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-hero">
          <h1 className="landing-title">Factory Pulse</h1>
          <h2 className="landing-subtitle">Machine Health Monitoring System</h2>
          <p className="landing-description">
            Real-time monitoring and control of industrial machines with IoT integration
          </p>

          <div className="landing-buttons">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="landing-features">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Real-Time Data</h4>
              <p>Monitor temperature, vibration, and current in real-time</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Remote Control</h4>
              <p>Turn machines ON/OFF remotely via ThingSpeak</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Role-Based Access</h4>
              <p>Owner and Operator roles with different permissions</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Smart Alerts</h4>
              <p>Color-coded status indicators for quick health assessment</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Historical Data</h4>
              <p>View trends and patterns with interactive charts</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Secure Access</h4>
              <p>JWT-based authentication for secure operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
