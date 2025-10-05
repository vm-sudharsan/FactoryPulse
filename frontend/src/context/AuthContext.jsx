import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    const storedToken = authService.getToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const signup = async (name, email, password, role) => {
    const data = await authService.signup(name, email, password, role);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isOwner = () => {
    return user?.role === 'owner';
  };

  const isOperator = () => {
    return user?.role === 'operator';
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isOwner,
    isOperator,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
