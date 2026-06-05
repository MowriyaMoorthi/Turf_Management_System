import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validators } from '../utils/validation.js';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

 if (isAuthenticated) {
  return <Navigate to="/dashboard" replace />;
}

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    const emailErr = validators.email(form.email);
    if (emailErr) e.email = emailErr;
    const phoneErr = validators.phone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    const pwErr = validators.password(form.password);
    if (pwErr) e.password = pwErr;
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (result.success) navigate('/dashboard', { replace: true });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const pwStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Too short', color: 'var(--accent-red)', width: '20%' };
    if (pw.length < 8) return { label: 'Weak', color: 'var(--accent-amber)', width: '40%' };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'Fair', color: 'var(--accent-amber)', width: '65%' };
    return { label: 'Strong', color: 'var(--accent-green)', width: '100%' };
  };

  const strength = pwStrength(form.password);

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
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,230,118,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', animation: 'fadeInUp 0.4s ease' }}>
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
            JOIN TURFPRO
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
            Create a free account and start booking in minutes
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={inputChange}
                className="form-input"
                placeholder="Alex Johnson"
                autoComplete="name"
              />
              {errors.name && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.name}</div>}
            </div>

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
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={inputChange}
                className="form-input"
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
              {errors.phone && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.phone}</div>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={inputChange}
                className="form-input"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '2px', transition: 'all 0.3s ease' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: strength.color, marginTop: '4px' }}>{strength.label}</div>
                </div>
              )}
              {errors.password && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                name="confirmPassword"
                type={showPw ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={inputChange}
                className="form-input"
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="divider" style={{ margin: '28px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-green)', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
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

export default Register;