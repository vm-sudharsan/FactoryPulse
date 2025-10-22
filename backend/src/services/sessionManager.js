/**
 * Session Manager Service
 * Tracks active user sessions to control data fetching
 * Only fetches data from ThingSpeak when at least one user is logged in
 */

class SessionManager {
  constructor() {
    this.activeSessions = new Set(); // Store active session tokens
    this.sessionMetadata = new Map(); // Store session details (userId, loginTime, etc.)
  }

  /**
   * Add a new active session
   * @param {string} token - JWT token
   * @param {object} userInfo - User information (id, email, role)
   */
  addSession(token, userInfo) {
    this.activeSessions.add(token);
    this.sessionMetadata.set(token, {
      userId: userInfo.id,
      email: userInfo.email,
      role: userInfo.role,
      loginTime: new Date(),
      lastActivity: new Date()
    });
    
    console.log(`✅ Session added for user: ${userInfo.email}`);
    console.log(`📊 Active sessions: ${this.activeSessions.size}`);
  }

  /**
   * Remove a session (on logout or token expiration)
   * @param {string} token - JWT token
   */
  removeSession(token) {
    const metadata = this.sessionMetadata.get(token);
    if (metadata) {
      console.log(`🔴 Session removed for user: ${metadata.email}`);
    }
    
    this.activeSessions.delete(token);
    this.sessionMetadata.delete(token);
    
    console.log(`📊 Active sessions: ${this.activeSessions.size}`);
  }

  /**
   * Update last activity time for a session
   * @param {string} token - JWT token
   */
  updateActivity(token) {
    const metadata = this.sessionMetadata.get(token);
    if (metadata) {
      metadata.lastActivity = new Date();
      this.sessionMetadata.set(token, metadata);
    }
  }

  /**
   * Check if there are any active sessions
   * @returns {boolean}
   */
  hasActiveSessions() {
    return this.activeSessions.size > 0;
  }

  /**
   * Get count of active sessions
   * @returns {number}
   */
  getActiveSessionCount() {
    return this.activeSessions.size;
  }

  /**
   * Get all active session details
   * @returns {Array}
   */
  getActiveSessions() {
    return Array.from(this.sessionMetadata.values());
  }

  /**
   * Check if a specific token is active
   * @param {string} token - JWT token
   * @returns {boolean}
   */
  isSessionActive(token) {
    return this.activeSessions.has(token);
  }

  /**
   * Clear all sessions (for server restart or emergency)
   */
  clearAllSessions() {
    const count = this.activeSessions.size;
    this.activeSessions.clear();
    this.sessionMetadata.clear();
    console.log(`🧹 Cleared ${count} sessions`);
  }

  /**
   * Clean up inactive sessions (sessions with no activity for X minutes)
   * @param {number} inactiveMinutes - Minutes of inactivity before cleanup
   */
  cleanupInactiveSessions(inactiveMinutes = 30) {
    const now = new Date();
    const inactiveThreshold = inactiveMinutes * 60 * 1000;
    
    let cleanedCount = 0;
    
    for (const [token, metadata] of this.sessionMetadata.entries()) {
      const timeSinceActivity = now - metadata.lastActivity;
      
      if (timeSinceActivity > inactiveThreshold) {
        this.removeSession(token);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} inactive sessions`);
    }
  }

  /**
   * Get session statistics
   * @returns {object}
   */
  getStatistics() {
    const sessions = Array.from(this.sessionMetadata.values());
    
    return {
      totalActiveSessions: this.activeSessions.size,
      sessions: sessions.map(s => ({
        userId: s.userId,
        email: s.email,
        role: s.role,
        loginTime: s.loginTime,
        lastActivity: s.lastActivity,
        duration: Math.floor((new Date() - s.loginTime) / 1000) // seconds
      }))
    };
  }
}

// Export singleton instance
module.exports = new SessionManager();
