import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isOwner } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <h2>🏭 Factory Pulse</h2>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          
          {isOwner() && (
            <>
              <Link to="/admin/machines" className="navbar-link">Manage Machines</Link>
              <Link to="/admin/operators" className="navbar-link">Manage Operators</Link>
            </>
          )}
          
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
