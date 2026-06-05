import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { turfService, SPORTS } from '../services/turfService.js';
import TurfCard from '../components/TurfCard';
import { SkeletonCard } from '../components/Loader';
import { formatCurrency } from '../utils/dateUtils.js';

const STATS = [
  { value: '50+', label: 'Premium Turfs' },
  { value: '10K+', label: 'Happy Players' },
  { value: '6', label: 'Sports Supported' },
  { value: '4.8★', label: 'Average Rating' },
];

const TESTIMONIALS = [
  { name: 'Priya K.', sport: 'Badminton', text: 'Booking took 30 seconds. The turf was spotless and the floodlights were perfect for our evening session.' },
  { name: 'Rahul M.', sport: 'Football', text: 'Champions Arena is the best 7v7 turf in Chennai. We book every weekend for our corporate league.' },
  { name: 'Deepa S.', sport: 'Cricket', text: 'Amazing ground, very well-maintained pitch. The digital scoreboard really elevated our match day.' },
];

const Home = () => {
  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    turfService.getAllTurfs()
      .then((turfs) => setFeaturedTurfs(turfs.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedSport !== 'All') params.set('sport', selectedSport);
    navigate(`/turfs?${params.toString()}`);
  };

  return (
    <div className="page-wrapper">
      <main className="main-content">
        {/* ── HERO ── */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          {/* Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,230,118,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 20% 80%, rgba(0,50,200,0.06) 0%, transparent 60%)
            `,
          }} />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px' }}>
            <div style={{ maxWidth: '760px' }}>
              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', animation: 'fadeInUp 0.5s ease' }}>
                <span className="badge badge-green">🏟️ Chennai's #1 Turf Platform</span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 9vw, 112px)',
                lineHeight: '0.92',
                letterSpacing: '0.01em',
                color: 'var(--text-primary)',
                marginBottom: '28px',
                animation: 'fadeInUp 0.5s ease 0.1s both',
              }}>
                BOOK.
                <br />
                <span style={{ color: 'var(--accent-green)' }}>PLAY.</span>
                <br />
                WIN.
              </h1>

              <p style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                maxWidth: '520px',
                marginBottom: '40px',
                animation: 'fadeInUp 0.5s ease 0.2s both',
              }}>
                Find and book premium sports turfs in Chennai instantly.
                Football, cricket, badminton, tennis — we've got your game covered.
              </p>

              {/* Search bar */}
              <form
                onSubmit={handleSearch}
                style={{
                  display: 'flex',
                  gap: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '8px',
                  maxWidth: '640px',
                  animation: 'fadeInUp 0.5s ease 0.3s both',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type="text"
                  placeholder="Search turf, sport, or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    padding: '8px 12px',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  style={{
                    background: 'var(--bg-card-hover)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 14px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {SPORTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button type="submit" className="btn btn-primary">
                  Search →
                </button>
              </form>

              {/* Quick actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                flexWrap: 'wrap',
                animation: 'fadeInUp 0.5s ease 0.4s both',
              }}>
                {SPORTS.filter(s => s !== 'All').slice(0, 4).map((sport) => (
                  <Link
                    key={sport}
                    to={`/turfs?sport=${sport}`}
                    className="chip"
                    style={{ fontSize: '13px', cursor: 'pointer', transition: 'all var(--transition)', textDecoration: 'none' }}
                  >
                    {sport}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div style={{
            position: 'absolute',
            right: '-100px',
            bottom: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '1px solid rgba(0,230,118,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'spin 30s linear infinite',
          }}>
            <div style={{
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              border: '1px solid rgba(0,230,118,0.05)',
            }} />
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '48px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '40px' }}>
              {STATS.map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--accent-green)', lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED TURFS ── */}
        <section className="section-pad">
          <div className="container">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="section-eyebrow">Featured</div>
                <h2 className="section-title">TOP TURFS</h2>
              </div>
              <Link to="/turfs" className="btn btn-outline">View All →</Link>
            </div>

            {loading ? (
              <div className="grid-3">
                {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
              </div>
            ) : (
              <div className="grid-3">
                {featuredTurfs.map((turf, i) => (
                  <TurfCard key={turf.id} turf={turf} style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section-pad" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
              <div className="section-eyebrow">Process</div>
              <h2 className="section-title">HOW IT WORKS</h2>
              <p className="section-subtitle" style={{ margin: '16px auto 0', textAlign: 'center' }}>
                Book your turf in under 2 minutes. It's that simple.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              {[
                { step: '01', icon: '🔍', title: 'Browse', desc: 'Search and filter turfs by sport, location, and price across Chennai.' },
                { step: '02', icon: '📅', title: 'Pick Your Slot', desc: 'Choose your preferred date and time from available slots.' },
                { step: '03', icon: '💳', title: 'Pay Securely', desc: 'Complete your booking with UPI, card, or cash on arrival.' },
                { step: '04', icon: '🏆', title: 'Play!', desc: 'Show up, play your game, and enjoy the premium facilities.' },
              ].map(({ step, icon, title, desc }, i) => (
                <div
                  key={step}
                  className="card"
                  style={{
                    padding: '32px 24px',
                    animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '20px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '48px',
                    color: 'rgba(0,230,118,0.06)',
                    lineHeight: 1,
                  }}>
                    {step}
                  </div>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    {title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPORTS ── */}
        <section className="section-pad">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Explore</div>
              <h2 className="section-title">BY SPORT</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Football', icon: '⚽', from: '₹800/hr' },
                { name: 'Cricket', icon: '🏏', from: '₹1,200/hr' },
                { name: 'Badminton', icon: '🏸', from: '₹600/hr' },
                { name: 'Tennis', icon: '🎾', from: '₹900/hr' },
                { name: 'Futsal', icon: '⚽', from: '₹700/hr' },
                { name: 'Volleyball', icon: '🏐', from: '₹700/hr' },
              ].map(({ name, icon, from }, i) => (
                <Link
                  key={name}
                  to={`/turfs?sport=${name}`}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all var(--transition)',
                    animationDelay: `${i * 0.08}s`,
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-green)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-green)' }}>from {from}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section-pad" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
              <div className="section-eyebrow">Reviews</div>
              <h2 className="section-title">WHAT PLAYERS SAY</h2>
            </div>

            <div className="grid-3">
              {TESTIMONIALS.map(({ name, sport, text }, i) => (
                <div
                  key={name}
                  className="card"
                  style={{ padding: '28px', animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--accent-amber)' }}>★★★★★</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '20px' }}>
                    "{text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'var(--accent-green)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: '700', color: '#080e1a',
                    }}>
                      {name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sport} player</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          padding: '100px 0',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,230,118,0.06) 0%, transparent 70%)',
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 7vw, 80px)',
              letterSpacing: '0.02em',
              lineHeight: '1',
              marginBottom: '20px',
            }}>
              READY TO PLAY?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px', lineHeight: '1.7' }}>
              Join thousands of players booking their perfect game every day.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/turfs" className="btn btn-primary btn-lg">Browse All Turfs</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Create Free Account</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;