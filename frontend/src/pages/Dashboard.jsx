import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService.js';
import { formatDate, formatTime, formatCurrency, getStatusConfig, timeAgo } from '../utils/dateUtils.js';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const TABS = ['Upcoming', 'Past', 'Cancelled'];

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Highlight new booking if redirected from BookingPage
  useEffect(() => {
    if (location.state?.newBooking) {
      toast.success('Your booking is confirmed! 🎉');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await bookingService.getUserBookings(user.id);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A full refund will be processed.')) return;
    setCancellingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled. Refund initiated.');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date(now.toDateString()));
  const past = bookings.filter(b => b.status === 'completed' || (b.status === 'confirmed' && new Date(b.date) < new Date(now.toDateString())));
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  const tabData = { Upcoming: upcoming, Past: past, Cancelled: cancelled };
  const displayed = tabData[activeTab] || [];

  const totalSpent = bookings
    .filter(b => b.paymentStatus === 'paid' && b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div className="section-eyebrow">My Account</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              MY BOOKINGS
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: 'Total Bookings', value: bookings.length, icon: '📋' },
              { label: 'Upcoming', value: upcoming.length, icon: '📅', accent: true },
              { label: 'Completed', value: past.length, icon: '✅' },
              { label: 'Total Spent', value: formatCurrency(totalSpent), icon: '💰' },
            ].map(({ label, value, icon, accent }) => (
              <div key={label} style={{
                background: accent ? 'var(--accent-green-glow)' : 'var(--bg-card)',
                border: `1px solid ${accent ? 'var(--border-accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '20px',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: accent ? 'var(--accent-green)' : 'var(--text-primary)', lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* Bookings list */}
            <div>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '4px', border: '1px solid var(--border)', width: 'fit-content' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 'calc(var(--radius) - 4px)',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all var(--transition)',
                      background: activeTab === tab ? 'var(--accent-green)' : 'transparent',
                      color: activeTab === tab ? '#080e1a' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {tab}
                    <span style={{ marginLeft: '6px', fontSize: '12px', opacity: 0.8 }}>
                      ({tabData[tab].length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Booking cards */}
              {loading ? (
                <Loader text="Loading bookings..." />
              ) : displayed.length === 0 ? (
                <div className="empty-state" style={{ padding: '60px 24px' }}>
                  <div className="empty-state-icon">
                    {activeTab === 'Upcoming' ? '📅' : activeTab === 'Past' ? '✅' : '❌'}
                  </div>
                  <h3>No {activeTab.toLowerCase()} bookings</h3>
                  <p style={{ marginBottom: '20px' }}>
                    {activeTab === 'Upcoming' ? "You don't have any upcoming bookings." : `No ${activeTab.toLowerCase()} bookings yet.`}
                  </p>
                  {activeTab === 'Upcoming' && (
                    <Link to="/turfs" className="btn btn-primary">Browse Turfs</Link>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {displayed.map((booking, i) => {
                    const statusCfg = getStatusConfig(booking.status);
                    const isUpcoming = booking.status === 'confirmed' && new Date(booking.date) >= new Date(now.toDateString());

                    return (
                      <div
                        key={booking.id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          overflow: 'hidden',
                          animation: `fadeInUp 0.3s ease ${i * 0.06}s both`,
                          transition: 'border-color var(--transition)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        {/* Card top */}
                        <div style={{ display: 'flex', alignItems: 'stretch' }}>
                          {/* Turf image */}
                          <div style={{ width: '120px', flexShrink: 0, overflow: 'hidden' }}>
                            <img
                              src={booking.turf?.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&q=60'}
                              alt={booking.turf?.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&q=60'; }}
                            />
                          </div>

                          {/* Details */}
                          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                              <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.03em', marginBottom: '2px' }}>
                                  {booking.turf?.name}
                                </h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                  📍 {booking.turf?.location} · {booking.turf?.sport}
                                </p>
                              </div>
                              <span className={`badge ${statusCfg.class}`}>
                                {statusCfg.label}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Date</div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{formatDate(booking.date)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Time</div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Amount</div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-green)' }}>{formatCurrency(booking.totalAmount)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Payment</div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{booking.paymentMethod}</div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                              <Link to={`/turfs/${booking.turfId}`} className="btn btn-ghost btn-sm" style={{ fontSize: '13px' }}>
                                View Turf
                              </Link>
                              {isUpcoming && (
                                <>
                                  <Link to={`/turfs/${booking.turfId}/book`} className="btn btn-outline btn-sm">
                                    Rebook
                                  </Link>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleCancel(booking.id)}
                                    disabled={cancellingId === booking.id}
                                  >
                                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                  </button>
                                </>
                              )}
                              <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
                                Booked {timeAgo(booking.bookedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Notes bar */}
                        {booking.notes && (
                          <div style={{
                            padding: '10px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            borderTop: '1px solid var(--border)',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                          }}>
                            📝 {booking.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '92px' }}>
              {/* Profile card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#080e1a',
                    flexShrink: 0,
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>{user?.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</div>
                    {user?.role === 'admin' && <span className="badge badge-green" style={{ marginTop: '4px' }}>Admin</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                  {[
                    { label: 'Phone', value: user?.phone || 'Not set' },
                    { label: 'Member since', value: user?.joinedAt || 'N/A' },
                    { label: 'Total bookings', value: bookings.length },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontWeight: '500' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '24px',
              }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.06em', marginBottom: '14px' }}>QUICK ACTIONS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/turfs" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    + New Booking
                  </Link>
                  <Link to="/turfs" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                    Browse Turfs
                  </Link>
                </div>
              </div>

              {/* Upcoming reminder */}
              {upcoming.length > 0 && (
                <div style={{
                  background: 'var(--accent-green-glow)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius)',
                  padding: '20px',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-green)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    ⏰ NEXT SESSION
                  </div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{upcoming[0]?.turf?.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {formatDate(upcoming[0]?.date)} · {formatTime(upcoming[0]?.startTime)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;