import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          height: 72px;
        }
        .navbar.scrolled {
          background: rgba(8, 14, 26, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
|          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--accent-green);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 18px;
          color: #080e1a;
          font-weight: 900;
        }
        .logo-text {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }
        .logo-text span {
          color: var(--accent-green);
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition);
          letter-spacing: 0.02em;
        }
        .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: var(--accent-green); background: var(--accent-green-glow); }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-green);
          color: #080e1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all var(--transition);
        }
        .user-avatar:hover { border-color: var(--accent-green); background: var(--accent-green-dim); }
        .user-dropdown {
          position: absolute;
          top: 56px;
          right: 24px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 8px;
          min-width: 220px;
          box-shadow: var(--shadow-card);
          animation: fadeInUp 0.2s ease;
        }
        .dropdown-user-info {
          padding: 12px 12px 16px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 8px;
        }
        .dropdown-user-name {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-primary);
        }
        .dropdown-user-email {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition);
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: var(--font-body);
        }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .dropdown-item.danger:hover { background: rgba(255,23,68,0.1); color: var(--accent-red); }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          background: none;
          border: none;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-secondary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-menu {
          display: none;
          position: fixed;
          inset: 72px 0 0;
          background: var(--bg-primary);
          padding: 24px;
          flex-direction: column;
          gap: 8px;
          z-index: 9999;
          border-top: 1px solid var(--border);
          animation: fadeIn 0.2s ease;
          
        }
        .mobile-menu.open {
         display: flex; 
         z-index: 9999;
        }
        .mobile-nav-link {
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          font-size: 16px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition);
          border: 1px solid transparent;
        }
        .mobile-nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
        .mobile-nav-link.active { color: var(--accent-green); background: var(--accent-green-glow); border-color: var(--border-accent); }
        @media (max-width: 768px) {
          .navbar-links, .navbar-actions { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">T</div>
            <span className="logo-text">Turf<span>Pro</span></span>
          </Link>

          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/turfs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Browse Turfs
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Bookings
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Admin
              </NavLink>
            )}
          </div>

          <div className="navbar-actions" style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <>
                <div
                  className="user-avatar"
                  onClick={() => setDropOpen(!dropOpen)}
                  title={user?.name}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {dropOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                      onClick={() => setDropOpen(false)}
                    />
                    <div className="user-dropdown" style={{ zIndex: 99 }}>
                      <div className="dropdown-user-info">
                        <div className="dropdown-user-name">{user?.name}</div>
                        <div className="dropdown-user-email">{user?.email}</div>
                        {isAdmin && <span className="badge badge-green" style={{ marginTop: '8px' }}>Admin</span>}
                      </div>
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropOpen(false)}>
                        📋 My Bookings
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setDropOpen(false)}>
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <div className="divider" style={{ margin: '8px 0' }} />
                      <button className="dropdown-item danger" onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end>🏠 Home</NavLink>
        <NavLink to="/turfs" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>🏟️ Browse Turfs</NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>📋 My Bookings</NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>⚙️ Admin</NavLink>
        )}
        <div className="divider" />
        {isAuthenticated ? (
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Logout
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
