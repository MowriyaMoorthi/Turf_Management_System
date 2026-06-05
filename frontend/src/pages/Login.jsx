import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validators } from '../utils/validation.js';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const validate = () => {
    const e = {};
    const emailErr = validators.email(form.email);
    if (emailErr) e.email = emailErr;
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
  };

  const fillDemo = (role) => {
    if (role === 'user') setForm({ email: 'user@turfpro.com', password: 'password123' });
    else setForm({ email: 'admin@turfpro.com', password: 'admin123' });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px',
      position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,230,118,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', animation: 'fadeInUp 0.4s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '44px', height: '44px', background: 'var(--accent-green)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: '22px', color: '#080e1a',
            }}>T</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Turf<span style={{ color: 'var(--accent-green)' }}>Pro</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '0.04em', marginBottom: '6px' }}>
            WELCOME BACK
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
            Sign in to manage your bookings
          </p>

          {/* Demo credentials */}
          <div style={{
            background: 'rgba(0,230,118,0.06)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-green)', letterSpacing: '0.08em', marginBottom: '10px' }}>
              DEMO ACCOUNTS
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => fillDemo('user')}
                style={{ fontSize: '12px' }}
              >
                Fill User Demo
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => fillDemo('admin')}
                style={{ fontSize: '12px' }}
              >
                Fill Admin Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={inputChange}
                className="form-input"
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.email}</div>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={inputChange}
                className="form-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider" style={{ margin: '28px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-green)', fontWeight: '600', textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;