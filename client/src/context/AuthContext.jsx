// ============================================================
// context/AuthContext.jsx - Global Authentication State
// ============================================================

import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Create the context (this is what components will consume)
export const AuthContext = createContext(null);

// AuthProvider wraps the whole app to provide auth state everywhere
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Current user object
  const [token, setToken] = useState(null);      // JWT token
  const [loading, setLoading] = useState(true);  // Loading state on mount

  // On app start, restore auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN: save token and user to state + localStorage
  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }, []);

  // REGISTER: register then auto-login
  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }, []);

  // LOGOUT: clear all auth data
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Update the user in state and localStorage (e.g., after profile update)
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we've checked localStorage */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
