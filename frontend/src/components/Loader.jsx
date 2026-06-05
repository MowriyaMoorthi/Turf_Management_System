import React from 'react';

const Loader = ({ size = 'md', text = '', fullPage = false }) => {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const s = sizes[size] || sizes.md;

  const spinner = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="2.5" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--accent-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        zIndex: 9999,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      {spinner}
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = () => (
  <div
    className="card"
    style={{ padding: '0', overflow: 'hidden', animation: 'pulse 1.5s ease infinite' }}
  >
    <style>{`
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    `}</style>
    <div style={{ height: '200px', background: 'var(--bg-card-hover)' }} />
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ height: '20px', background: 'var(--bg-card-hover)', borderRadius: '4px', width: '70%' }} />
      <div style={{ height: '14px', background: 'var(--bg-card-hover)', borderRadius: '4px', width: '50%' }} />
      <div style={{ height: '14px', background: 'var(--bg-card-hover)', borderRadius: '4px', width: '90%' }} />
    </div>
  </div>
);

export default Loader;