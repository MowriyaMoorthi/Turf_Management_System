import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService.js';
import { bookingService } from '../services/bookingService.js';
import { formatCurrency, formatDate, formatTime, getStatusConfig, timeAgo } from '../utils/dateUtils.js';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ADMIN_TABS = ['Overview', 'Bookings', 'Turfs', 'Add Turf'];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allTurfs, setAllTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [turfForm, setTurfForm] = useState({
    name: '', location: '', address: '', sport: 'Football',
    size: '7v7', pricePerHour: '', openTime: '06:00', closeTime: '22:00',
    description: '', amenities: '', images: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tStats, bStats, bookings, turfs] = await Promise.all([
        turfService.getTurfStats(),
        bookingService.getBookingStats(),
        bookingService.getAllBookings(),
        turfService.getAllTurfs(),
      ]);
      setStats(tStats);
      setBookingStats(bStats);
      setAllBookings(bookings);
      setAllTurfs(turfs);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      if (newStatus === 'cancelled') await bookingService.cancelBooking(bookingId);
      toast.success('Booking updated');
      loadData();
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const handleToggleTurf = async (id, isActive) => {
    try {
      await turfService.updateTurf(id, { isActive: !isActive });
      toast.success(`Turf ${isActive ? 'deactivated' : 'activated'}`);
      loadData();
    } catch {
      toast.error('Failed to update turf');
    }
  };

  const handleDeleteTurf = async (id) => {
    if (!window.confirm('Are you sure you want to delete this turf?')) return;
    try {
      await turfService.deleteTurf(id);
      toast.success('Turf deleted');
      loadData();
    } catch {
      toast.error('Failed to delete turf');
    }
  };

  const handleAddTurf = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amenitiesArr = turfForm.amenities.split(',').map(a => a.trim()).filter(Boolean);
      const imagesArr = turfForm.images.split(',').map(i => i.trim()).filter(Boolean);
      await turfService.createTurf({
        ...turfForm,
        pricePerHour: Number(turfForm.pricePerHour),
        amenities: amenitiesArr,
        images: imagesArr,
        tags: [],
      });
      toast.success('Turf added successfully!');
      setTurfForm({ name: '', location: '', address: '', sport: 'Football', size: '7v7', pricePerHour: '', openTime: '06:00', closeTime: '22:00', description: '', amenities: '', images: '' });
      setActiveTab('Turfs');
      loadData();
    } catch {
      toast.error('Failed to add turf');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookingFilter === 'all'
    ? allBookings
    : allBookings.filter(b => b.status === bookingFilter);

  if (loading) return <Loader fullPage text="Loading admin panel..." />;

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div className="section-eyebrow">Admin</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '0.02em' }}>
              ADMIN PANEL
            </h1>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
            {ADMIN_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: activeTab === tab ? 'var(--accent-green)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab ? '2px solid var(--accent-green)' : '2px solid transparent',
                  transition: 'all var(--transition)',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.03em',
                  marginBottom: '-1px',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {activeTab === 'Overview' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              {/* KPI grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                {[
                  { label: 'Total Turfs', value: stats?.total, icon: '🏟️', color: 'var(--text-primary)' },
                  { label: 'Active Turfs', value: stats?.active, icon: '✅', color: 'var(--accent-green)' },
                  { label: 'Total Bookings', value: bookingStats?.total, icon: '📋', color: 'var(--text-primary)' },
                  { label: 'Confirmed', value: bookingStats?.confirmed, icon: '🔔', color: 'var(--accent-green)' },
                  { label: 'Completed', value: bookingStats?.completed, icon: '✅', color: 'var(--accent-amber)' },
                  { label: 'Revenue', value: formatCurrency(bookingStats?.revenue || 0), icon: '💰', color: 'var(--accent-green)' },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '24px',
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color, lineHeight: 1 }}>{value ?? '–'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Recent bookings */}
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.05em', marginBottom: '16px' }}>RECENT BOOKINGS</h2>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                      {['Customer', 'Turf', 'Date & Time', 'Amount', 'Status'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.slice(0, 8).map((b, i) => {
                      const sc = getStatusConfig(b.status);
                      return (
                        <tr key={b.id} style={{ borderBottom: i < 7 ? '1px solid var(--border)' : 'none', transition: 'background var(--transition)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '600' }}>{b.userName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{b.turf?.name}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div>{formatDate(b.date)}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatTime(b.startTime)} – {formatTime(b.endTime)}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-green)' }}>{formatCurrency(b.totalAmount)}</td>
                          <td style={{ padding: '14px 16px' }}><span className={`badge ${sc.class}`}>{sc.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeTab === 'Bookings' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              {/* Filter */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`btn btn-sm ${bookingFilter === f ? 'btn-primary' : 'btn-outline'}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {f} ({f === 'all' ? allBookings.length : allBookings.filter(b => b.status === f).length})
                  </button>
                ))}
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                      {['#', 'Customer', 'Turf', 'Date & Time', 'Hrs', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, i) => {
                      const sc = getStatusConfig(b.status);
                      return (
                        <tr key={b.id} style={{ borderBottom: i < filteredBookings.length - 1 ? '1px solid var(--border)' : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>{b.id}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600' }}>{b.userName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.userPhone}</div>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>{b.turf?.name}</td>
                          <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                            <div>{formatDate(b.date)}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatTime(b.startTime)}</div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{b.hours}h</td>
                          <td style={{ padding: '12px', fontWeight: '700', color: 'var(--accent-green)', whiteSpace: 'nowrap' }}>{formatCurrency(b.totalAmount)}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{b.paymentMethod}</td>
                          <td style={{ padding: '12px' }}><span className={`badge ${sc.class}`}>{sc.label}</span></td>
                          <td style={{ padding: '12px' }}>
                            {b.status === 'confirmed' && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleStatusChange(b.id, 'cancelled')}
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredBookings.length === 0 && (
                  <div className="empty-state" style={{ padding: '40px' }}>
                    <div className="empty-state-icon">📋</div>
                    <h3>No bookings found</h3>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TURFS ── */}
          {activeTab === 'Turfs' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{allTurfs.length} turfs total</p>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('Add Turf')}>
                  + Add New Turf
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {allTurfs.map((turf, i) => (
                  <div
                    key={turf.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '20px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                      animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '80px', height: '64px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={turf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200&q=60'}
                        alt={turf.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200&q=60'; }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.03em' }}>{turf.name}</h3>
                        <span className={`badge ${turf.isActive ? 'badge-green' : 'badge-red'}`}>
                          {turf.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {turf.sport} · {turf.size} · {turf.location}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span>⭐ {turf.rating} ({turf.reviewsCount})</span>
                        <span>{formatCurrency(turf.pricePerHour)}/hr</span>
                        <span>{turf.totalBookings} bookings</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <Link to={`/turfs/${turf.id}`} className="btn btn-ghost btn-sm">View</Link>
                      <button
                        className={`btn btn-sm ${turf.isActive ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => handleToggleTurf(turf.id, turf.isActive)}
                      >
                        {turf.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTurf(turf.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADD TURF ── */}
          {activeTab === 'Add Turf' && (
            <div style={{ animation: 'fadeInUp 0.3s ease', maxWidth: '720px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.05em', marginBottom: '24px' }}>
                ADD NEW TURF
              </h2>

              <form onSubmit={handleAddTurf} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Turf Name *</label>
                    <input className="form-input" required value={turfForm.name} onChange={e => setTurfForm(f => ({ ...f, name: e.target.value }))} placeholder="Champions Arena" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sport *</label>
                    <select className="form-input" value={turfForm.sport} onChange={e => setTurfForm(f => ({ ...f, sport: e.target.value }))}>
                      {['Football', 'Cricket', 'Badminton', 'Tennis', 'Futsal', 'Volleyball'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location (Area) *</label>
                    <input className="form-input" required value={turfForm.location} onChange={e => setTurfForm(f => ({ ...f, location: e.target.value }))} placeholder="Velachery, Chennai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Size / Format *</label>
                    <input className="form-input" required value={turfForm.size} onChange={e => setTurfForm(f => ({ ...f, size: e.target.value }))} placeholder="7v7, Full Pitch, 4 Courts" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Full Address *</label>
                    <input className="form-input" required value={turfForm.address} onChange={e => setTurfForm(f => ({ ...f, address: e.target.value }))} placeholder="14B Sports Complex, Chennai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price per Hour (₹) *</label>
                    <input className="form-input" type="number" required min="100" value={turfForm.pricePerHour} onChange={e => setTurfForm(f => ({ ...f, pricePerHour: e.target.value }))} placeholder="1200" />
                  </div>
                  <div className="form-group" />
                  <div className="form-group">
                    <label className="form-label">Opening Time</label>
                    <input className="form-input" type="time" value={turfForm.openTime} onChange={e => setTurfForm(f => ({ ...f, openTime: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Closing Time</label>
                    <input className="form-input" type="time" value={turfForm.closeTime} onChange={e => setTurfForm(f => ({ ...f, closeTime: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={turfForm.description} onChange={e => setTurfForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the turf facilities..." style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Amenities (comma-separated)</label>
                    <input className="form-input" value={turfForm.amenities} onChange={e => setTurfForm(f => ({ ...f, amenities: e.target.value }))} placeholder="Floodlights, Parking, Changing Rooms, Washrooms" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Image URLs (comma-separated)</label>
                    <input className="form-input" value={turfForm.images} onChange={e => setTurfForm(f => ({ ...f, images: e.target.value }))} placeholder="https://example.com/img1.jpg, https://..." />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setActiveTab('Turfs')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                    {submitting ? 'Adding...' : '+ Add Turf'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;