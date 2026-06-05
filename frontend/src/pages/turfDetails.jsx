import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { turfService } from '../services/turfService.js';
import { formatCurrency, formatTime } from '../utils/dateUtils.js';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    turfService.getTurfById(id)
      .then(setTurf)
      .catch(() => setError('Turf not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/turfs/${id}/book` } });
    } else {
      navigate(`/turfs/${id}/book`);
    }
  };

  if (loading) return <Loader fullPage text="Loading turf details..." />;
  if (error || !turf) return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="container section-pad">
          <div className="empty-state">
            <div className="empty-state-icon">🏟️</div>
            <h3>Turf not found</h3>
            <p>This turf may no longer be available.</p>
            <Link to="/turfs" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse All Turfs</Link>
          </div>
        </div>
      </main>
    </div>
  );

  const images = turf.images?.length > 0
    ? turf.images
    : ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'];

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
            <span style={{ color: 'var(--text-primary)' }}>{turf.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
            {/* Left column */}
            <div>
              {/* Image gallery */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  height: '400px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  border: '1px solid var(--border)',
                }}>
                  <img
                    src={images[activeImg]}
                    alt={turf.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'; }}
                  />
                </div>
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImg(i)}
                        style={{
                          width: '80px',
                          height: '60px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: `2px solid ${i === activeImg ? 'var(--accent-green)' : 'var(--border)'}`,
                          transition: 'all var(--transition)',
                          opacity: i === activeImg ? 1 : 0.6,
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {turf.tags?.map((tag) => (
                        <span key={tag} className="badge badge-green">{tag}</span>
                      ))}
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                      {turf.name}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
                      📍 {turf.address}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--accent-green)', lineHeight: 1 }}>
                      {formatCurrency(turf.pricePerHour)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>per hour</div>
                  </div>
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>⭐</span>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--accent-amber)' }}>{turf.rating}</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>({turf.reviewsCount} reviews)</span>
                  </div>
                  <div className="chip">🏟️ {turf.sport} · {turf.size}</div>
                  <div className="chip">🕐 {formatTime(turf.openTime)} – {formatTime(turf.closeTime)}</div>
                  <div className="chip">📊 {turf.totalBookings}+ bookings</div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.05em', marginBottom: '12px' }}>ABOUT THIS TURF</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }}>
                  {turf.description}
                </p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.05em', marginBottom: '16px' }}>AMENITIES</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {turf.amenities?.map((amenity) => (
                    <div key={amenity} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}>
                      <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.05em', marginBottom: '16px' }}>GROUND RULES</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    '⚠️ Proper sports footwear mandatory (no regular shoes)',
                    '🚫 No smoking or alcohol on premises',
                    '⏰ Please arrive 10 minutes before your booking',
                    '💳 Payment must be completed at least 2 hours before play',
                    '❌ Cancellation free up to 24 hours before booking time',
                  ].map((rule) => (
                    <div key={rule} style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — Booking card (sticky) */}
            <div style={{ position: 'sticky', top: '92px' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}>
                {/* Card header */}
                <div style={{
                  padding: '24px 24px 20px',
                  background: 'linear-gradient(135deg, var(--accent-green-glow), transparent)',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--accent-green)', lineHeight: 1 }}>
                    {formatCurrency(turf.pricePerHour)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>per hour · {turf.sport}</div>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* Key info */}
                  <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Location', value: turf.location },
                      { label: 'Sport', value: turf.sport },
                      { label: 'Size', value: turf.size },
                      { label: 'Hours', value: `${formatTime(turf.openTime)} – ${formatTime(turf.closeTime)}` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span style={{ fontWeight: '600' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="divider" />

                  {/* Rating summary */}
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--accent-amber)' }}>{turf.rating}</div>
                    <div style={{ fontSize: '20px', color: 'var(--accent-amber)', marginBottom: '4px' }}>★★★★★</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{turf.reviewsCount} player reviews</div>
                  </div>

                  <button className="btn btn-primary btn-lg" onClick={handleBookNow} style={{ width: '100%', justifyContent: 'center' }}>
                    Book This Turf →
                  </button>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', lineHeight: '1.6' }}>
                    Free cancellation up to 24 hours before your slot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TurfDetails;