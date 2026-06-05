import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('turfpro_user');
    const storedToken = localStorage.getItem('turfpro_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('turfpro_user');
        localStorage.removeItem('turfpro_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const { user: userData, token } = response;
      localStorage.setItem('turfpro_token', token);
      localStorage.setItem('turfpro_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Welcome back, ' + userData.name + '!');
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      const { user: newUser, token } = response;
      localStorage.setItem('turfpro_token', token);
      localStorage.setItem('turfpro_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
      return { success: true, user: newUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('turfpro_token');
    localStorage.removeItem('turfpro_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, isOwner, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
