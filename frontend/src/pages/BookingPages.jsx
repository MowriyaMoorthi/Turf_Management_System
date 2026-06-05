import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { turfService } from '../services/turfService.js';
import { formatCurrency, formatTime } from '../utils/dateUtils.js';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    turfService.getTurfById(id)
      .then(setTurf)
      .catch(() => setError('Turf not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage text="Loading booking page..." />;

  if (error || !turf) return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="container section-pad">
          <div className="empty-state">
            <div className="empty-state-icon">🏟️</div>
            <h3>Turf not found</h3>
            <Link to="/turfs" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Turfs</Link>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/turfs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Turfs</Link>
            <span>/</span>
            <Link to={`/turfs/${id}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{turf.name}</Link>
            <span>/</span>
            <span style={{ color: 'var(--accent-green)' }}>Book</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}>
            {/* Left — Booking form */}
            <div>
              <div style={{ marginBottom: '32px' }}>
                <div className="section-eyebrow">New Booking</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  marginBottom: '8px',
                }}>
                  BOOK YOUR SLOT
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  Select a date and time, fill your details, and confirm.
                </p>
              </div>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
              }}>
                <BookingForm turf={turf} />
              </div>
            </div>

            {/* Right — Turf summary card */}
            <div style={{ position: 'sticky', top: '92px' }}>
              {/* Turf image */}
              <div style={{
                height: '200px',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                marginBottom: '16px',
                border: '1px solid var(--border)',
              }}>
                <img
                  src={turf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=70'}
                  alt={turf.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=70'; }}
                />
              </div>

              {/* Turf info card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                marginBottom: '16px',
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.03em', marginBottom: '4px' }}>
                  {turf.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  📍 {turf.location}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Sport', value: turf.sport },
                    { label: 'Size', value: turf.size },
                    { label: 'Rate', value: `${formatCurrency(turf.pricePerHour)} / hour` },
                    { label: 'Hours', value: `${formatTime(turf.openTime)} – ${formatTime(turf.closeTime)}` },
                    { label: 'Rating', value: `⭐ ${turf.rating} (${turf.reviewsCount} reviews)` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontWeight: '600', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation policy */}
              <div style={{
                background: 'rgba(0,230,118,0.05)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius)',
                padding: '16px',
              }}>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--accent-green)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  ✓ FREE CANCELLATION
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Cancel up to 24 hours before your booking for a full refund. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;