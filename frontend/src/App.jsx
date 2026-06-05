import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Styles
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Route guards
import { ProtectedRoute, AdminRoute } from './routes.jsx';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import TurfList from './pages/TurfList';
import TurfDetails from './pages/turfDetails';
import BookingPage from './pages/BookingPages';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';

// Layout wrapper — with Navbar + Footer
const WithLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Auth layout — no Navbar/Footer
const AuthLayout = ({ children }) => <>{children}</>;

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111d33',
              color: '#f0f4ff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
            },
            success: {
              iconTheme: { primary: '#00e676', secondary: '#080e1a' },
            },
            error: {
              iconTheme: { primary: '#ff1744', secondary: '#fff' },
            },
            duration: 3500,
          }}
        />

        <Routes>
          {/* Public pages */}
          <Route path="/"          element={<WithLayout><Home /></WithLayout>} />
          <Route path="/turfs"     element={<WithLayout><TurfList /></WithLayout>} />
          <Route path="/turfs/:id" element={<WithLayout><TurfDetails /></WithLayout>} />

          {/* Protected pages */}
          <Route
            path="/turfs/:id/book"
            element={
              <ProtectedRoute>
                <WithLayout><BookingPage /></WithLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WithLayout><Dashboard /></WithLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <WithLayout><AdminPanel /></WithLayout>
              </AdminRoute>
            }
          />

          {/* Auth pages */}
          <Route path="/login"    element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;