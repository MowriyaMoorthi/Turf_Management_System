import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/dateUtils.js';

const SPORT_ICONS = {
  Football: '⚽', Cricket: '🏏', Badminton: '🏸',
  Tennis: '🎾', Futsal: '⚽', Volleyball: '🏐',
};

const TurfCard = ({ turf, style = {} }) => {
  const [imgError, setImgError] = useState(false);

  // MongoDB returns _id — handle both
  const id = turf?._id?.toString() || turf?.id;

  const { name, location, sport, size, pricePerHour, rating, reviewsCount, images, amenities = [], tags = [] } = turf;

  const image = !imgError && images?.[0]
    ? images[0]
    : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=70';

  return (
    <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', animation: 'fadeInUp 0.4s ease both', ...style }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={image}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(8,14,26,0.85)', backdropFilter: 'blur(8px)', borderRadius: '100px', padding: '4px 12px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)' }}>
          <span>{SPORT_ICONS[sport] || '🏟️'}</span>
          <span>{sport}</span>
        </div>
        {tags.length > 0 && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span className="badge badge-green" style={{ fontSize: '11px', padding: '3px 8px' }}>{tags[0]}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.03em', color: 'var(--text-primary)', marginBottom: '4px' }}>{name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📍 {location}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⭐</span>
            <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--accent-amber)' }}>{rating}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({reviewsCount})</span>
          </div>
          <div className="chip">{size}</div>
        </div>

        {amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {amenities.slice(0, 3).map(a => (
              <span key={a} className="chip" style={{ fontSize: '11px' }}>✓ {a}</span>
            ))}
            {amenities.length > 3 && (
              <span className="chip" style={{ fontSize: '11px', color: 'var(--accent-green)' }}>+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--accent-green)' }}>
              {formatCurrency(pricePerHour)}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/hour</span>
          </div>
          {id ? (
            <Link to={`/turfs/${id}`} className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>
              Book Now
            </Link>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--accent-red)' }}>ID missing</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
