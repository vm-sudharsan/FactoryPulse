import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { Activity, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isOwner } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Activity size={24} strokeWidth={2.5} />
            <h2>Factory Pulse</h2>
          </Link>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="navbar-menu desktop-menu">
          <Link 
            to="/dashboard" 
            className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/ai-analysis" 
            className={`navbar-link ${isActive('/ai-analysis') ? 'active' : ''}`}
          >
            AI Analysis
          </Link>
          
          {isOwner() && (
            <>
              <Link 
                to="/admin/machines" 
                className={`navbar-link ${isActive('/admin/machines') ? 'active' : ''}`}
              >
                Manage Machines
              </Link>
              <Link 
                to="/admin/operators" 
                className={`navbar-link ${isActive('/admin/operators') ? 'active' : ''}`}
              >
                Manage Operators
              </Link>
            </>
          )}
          
          <NotificationBell />
          
          <div className="navbar-user">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">({user?.role})</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Drawer */}
    <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
    <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
      <div className="mobile-menu-header">
        <div className="mobile-user-info">
          <div className="mobile-user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="mobile-user-details">
            <span className="mobile-user-name">{user?.name}</span>
            <span className="mobile-user-role">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="mobile-menu-content">
        <Link 
          to="/dashboard" 
          className={`mobile-menu-item ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <Activity size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/ai-analysis" 
          className={`mobile-menu-item ${isActive('/ai-analysis') ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <Activity size={20} />
          <span>AI Analysis</span>
        </Link>
        
        {isOwner() && (
          <>
            <Link 
              to="/admin/machines" 
              className={`mobile-menu-item ${isActive('/admin/machines') ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <Activity size={20} />
              <span>Manage Machines</span>
            </Link>
            <Link 
              to="/admin/operators" 
              className={`mobile-menu-item ${isActive('/admin/operators') ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <Activity size={20} />
              <span>Manage Operators</span>
            </Link>
          </>
        )}
      </div>

      <div className="mobile-menu-footer">
        <button onClick={handleLogout} className="mobile-logout-btn">
          <X size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </>
  );
};

export default Navbar;
