import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import TurfList from './pages/TurfList';
import TurfDetails from './pages/turfDetails';
import BookingPage from './pages/BookingPages';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

// Route guard for authenticated users
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Route guard for admins
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Centralized route definitions
export const routes = [
  { path: '/', element: <Home />, protected: false },
  { path: '/turfs', element: <TurfList />, protected: false },
  { path: '/turfs/:id', element: <TurfDetails />, protected: false },
  { path: '/turfs/:id/book', element: <BookingPage />, protected: true },
  { path: '/dashboard', element: <Dashboard />, protected: true },
  { path: '/admin', element: <AdminPanel />, protected: true, adminOnly: true },
];