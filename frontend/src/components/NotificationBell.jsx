import { useState, useContext, useEffect, useRef } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { formatDate } from '../utils/helpers';
import { Bell, X, Check, AlertTriangle, AlertCircle } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, acknowledgeNotification } = useContext(NotificationContext);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleAcknowledge = async (e, notificationId) => {
    e.stopPropagation();
    await acknowledgeNotification(notificationId);
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'critical') {
      return <AlertCircle size={18} color="#f44336" />;
    } else if (severity === 'warning') {
      return <AlertTriangle size={18} color="#ff9800" />;
    }
    return null;
  };

  const getSeverityColor = (severity) => {
    if (severity === 'critical') {
      return '#ffebee';
    } else if (severity === 'warning') {
      return '#fff3e0';
    }
    return '#f5f5f5';
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <button 
              className="notification-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  style={{ backgroundColor: getSeverityColor(notification.severity) }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-item-header">
                    <div className="notification-item-title">
                      {getSeverityIcon(notification.severity)}
                      <span className="notification-machine-name">
                        {notification.machineName}
                      </span>
                    </div>
                    <span className={`notification-severity ${notification.severity}`}>
                      {notification.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="notification-message">{notification.message}</p>

                  {notification.sensorData && (
                    <div className="notification-sensor-data">
                      <span>{notification.sensorData.temperature?.toFixed(1)}°C</span>
                      <span>{notification.sensorData.vibration?.toFixed(1)} Hz</span>
                      <span>{notification.sensorData.current?.toFixed(1)} A</span>
                    </div>
                  )}

                  <div className="notification-item-footer">
                    <span className="notification-time">
                      {formatDate(notification.createdAt)}
                    </span>
                    
                    {!notification.isAcknowledged && notification.severity === 'critical' && (
                      <button
                        className="notification-acknowledge-btn"
                        onClick={(e) => handleAcknowledge(e, notification.id)}
                      >
                        <Check size={14} />
                        Acknowledge
                      </button>
                    )}
                    
                    {notification.isAcknowledged && (
                      <span className="notification-acknowledged">
                        ✓ Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
