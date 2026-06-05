import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ padding: '48px 24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--accent-green)',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                color: '#080e1a',
              }}>T</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.05em' }}>
                Turf<span style={{ color: 'var(--accent-green)' }}>Pro</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', maxWidth: '220px' }}>
              The premium platform for sports turf booking and management in Chennai.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/turfs', label: 'Browse Turfs' },
                { to: '/dashboard', label: 'My Bookings' },
                { to: '/login', label: 'Login' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color var(--transition)',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-green)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sports */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Sports
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Football', 'Cricket', 'Badminton', 'Tennis', 'Futsal', 'Volleyball'].map((sport) => (
                <Link
                  key={sport}
                  to={`/turfs?sport=${sport}`}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color var(--transition)',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-green)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {sport}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                📍 Chennai, Tamil Nadu
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                📞 +91 98765 43210
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                ✉️ support@turfpro.in
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                🕐 Open 24/7 for booking
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} TurfPro. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
              <span
                key={item}
                style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;