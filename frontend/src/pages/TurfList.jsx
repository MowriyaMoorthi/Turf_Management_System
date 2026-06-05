import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { turfService, SPORTS, LOCATIONS } from '../services/turfService.js';
import TurfCard from '../components/TurfCard';
import { SkeletonCard } from '../components/Loader';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const TurfList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    sport: searchParams.get('sport') || 'All',
    location: searchParams.get('location') || 'All',
    sort: 'rating',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTurfs();
  }, [filters]);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const data = await turfService.getAllTurfs(filters);
      setTurfs(data);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.sport !== 'All') params.sport = newFilters.sport;
    if (newFilters.location !== 'All') params.location = newFilters.location;
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = { search: '', sport: 'All', location: 'All', sort: 'rating', maxPrice: '' };
    setFilters(reset);
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.sport !== 'All' || filters.location !== 'All' || filters.maxPrice;

  return (
    <div className="page-wrapper">
      <main className="main-content">
        {/* Page header */}
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px' }}>
          <div className="container">
            <div className="section-eyebrow">Discover</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>ALL TURFS</h1>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', maxWidth: '720px' }}>
              <input
                type="text"
                placeholder="Search by name, sport, or area..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="form-input"
                style={{ flex: 1, minWidth: '200px' }}
              />
              <button
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                ⚙ Filters {hasActiveFilters && '•'}
              </button>
            </div>

            {/* Filter row */}
            {showFilters && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
                flexWrap: 'wrap',
                animation: 'fadeInUp 0.2s ease',
              }}>
                <select
                  className="form-input"
                  style={{ width: 'auto' }}
                  value={filters.sport}
                  onChange={(e) => updateFilter('sport', e.target.value)}
                >
                  {SPORTS.map((s) => <option key={s}>{s}</option>)}
                </select>

                <select
                  className="form-input"
                  style={{ width: 'auto' }}
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                >
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>

                <select
                  className="form-input"
                  style={{ width: 'auto' }}
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>

                <input
                  type="number"
                  placeholder="Max ₹/hr"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="form-input"
                  style={{ width: '120px' }}
                  min="0"
                />

                {hasActiveFilters && (
                  <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                    ✕ Clear All
                  </button>
                )}
              </div>
            )}

            {/* Active filter chips */}
            {hasActiveFilters && !showFilters && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active:</span>
                {filters.sport !== 'All' && <span className="badge badge-green">{filters.sport}</span>}
                {filters.location !== 'All' && <span className="badge badge-green">{filters.location}</span>}
                {filters.search && <span className="badge badge-green">"{filters.search}"</span>}
                <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ fontSize: '12px', padding: '4px 8px' }}>
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="container section-pad">
          {/* Result count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {loading ? 'Searching...' : `${turfs.length} turf${turfs.length !== 1 ? 's' : ''} found`}
            </p>
            {!showFilters && (
              <select
                className="form-input"
                style={{ width: 'auto', fontSize: '13px', padding: '8px 12px' }}
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
            </div>
          ) : turfs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏟️</div>
              <h3>No turfs found</h3>
              <p>Try adjusting your filters or search in a different area.</p>
              <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {turfs.map((turf, i) => (
                <TurfCard key={turf.id} turf={turf} style={{ animationDelay: `${(i % 6) * 0.08}s` }} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TurfList;