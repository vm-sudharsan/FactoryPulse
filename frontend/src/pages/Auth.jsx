import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  CheckCircle2,
  Shield,
  Zap,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import '../styles/auth-new.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(signupName, signupEmail, signupPassword, 'owner');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-page-new">
      {/* Sliding Toggle Switch */}
      <div className="auth-toggle-container">
        <div className="auth-toggle">
          <button
            className={`toggle-option ${isLogin ? 'active' : ''}`}
            onClick={() => !isLogin && toggleMode()}
          >
            Sign In
          </button>
          <button
            className={`toggle-option ${!isLogin ? 'active' : ''}`}
            onClick={() => isLogin && toggleMode()}
          >
            Sign Up
          </button>
          <div className={`toggle-slider ${isLogin ? 'left' : 'right'}`}></div>
        </div>
      </div>

      <div className={`auth-wrapper ${isLogin ? 'login-mode' : 'signup-mode'}`}>
        {/* Left Panel - Welcome Section */}
        <div className="auth-panel welcome-panel">
          <div className="welcome-content">
            <div className="brand-header">
              <Activity size={40} strokeWidth={2.5} />
              <h1>Factory Pulse</h1>
            </div>

            {isLogin ? (
              <div className="welcome-info">
                <h2>Welcome Back!</h2>
                <p>Sign in to continue monitoring your factory operations</p>
                
                <div className="welcome-features">
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Access your dashboard instantly</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>View real-time machine data</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Manage alerts and notifications</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Control devices remotely</span>
                  </div>
                </div>

                <div className="welcome-cta">
                  <p className="welcome-cta-text">Don't have an account?</p>
                  <button className="welcome-signin-btn" onClick={toggleMode}>
                    SIGN UP
                  </button>
                </div>
              </div>
            ) : (
              <div className="welcome-info">
                <h2>Start Monitoring</h2>
                <p>Join Factory Pulse and transform your industrial operations</p>
                
                <div className="welcome-features">
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Real-time sensor monitoring</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Instant alert notifications</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Remote machine control</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>Advanced analytics dashboard</span>
                  </div>
                  <div className="welcome-feature">
                    <CheckCircle2 size={18} />
                    <span>24/7 system monitoring</span>
                  </div>
                </div>

                <div className="welcome-cta">
                  <p className="welcome-cta-text">Already have an account?</p>
                  <button className="welcome-signin-btn" onClick={toggleMode}>
                    SIGN IN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="auth-panel form-panel">
          <div className="form-content">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back to Home
            </button>

            {isLogin ? (
              <div className="form-container">
                <div className="form-header">
                  <h2>Sign In to Account</h2>
                  <p>or use your email for registration</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleLoginSubmit} className="auth-form-new">
                  <div className="input-group">
                    <label htmlFor="login-email">Email Address</label>
                    <div className="input-wrapper">
                      <Mail size={20} />
                      <input
                        type="email"
                        id="login-email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="input-wrapper">
                      <Lock size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight size={20} />
                  </button>
                </form>

                <div className="form-footer">
                  <p>New to Factory Pulse?</p>
                  <button onClick={toggleMode} className="link-btn">
                    Create an account →
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-container">
                <div className="form-header">
                  <h2>Create Account</h2>
                  <p>or use your email for registration</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSignupSubmit} className="auth-form-new">
                  <div className="input-group">
                    <label htmlFor="signup-name">Full Name</label>
                    <div className="input-wrapper">
                      <User size={20} />
                      <input
                        type="text"
                        id="signup-name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="signup-email">Email Address</label>
                    <div className="input-wrapper">
                      <Mail size={20} />
                      <input
                        type="email"
                        id="signup-email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="signup-password">Password</label>
                    <div className="input-wrapper">
                      <Lock size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="signup-password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-wrapper">
                      <Lock size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                    <ArrowRight size={20} />
                  </button>
                </form>

                <div className="form-footer">
                  <p>Already have an account?</p>
                  <button onClick={toggleMode} className="link-btn">
                    Sign in instead →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
