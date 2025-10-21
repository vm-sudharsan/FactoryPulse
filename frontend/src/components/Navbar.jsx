import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isOwner } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Activity size={24} strokeWidth={2.5} />
          <h2>Factory Pulse</h2>
        </Link>
        
        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
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
  );
};

export default Navbar;
