import React from 'react';

function SkeletonLoader({ view }) {
  const renderDashboardSkeleton = () => (
    <div>
      <div className="kpi-row">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="skeleton-card skeleton-kpi skeleton-shimmer" />
        ))}
      </div>
      <div className="grid-2" style={{ marginTop: '22px' }}>
        <div className="skeleton-card">
          <div className="skeleton-title skeleton-shimmer" />
          <div className="skeleton-line skeleton-shimmer" />
          <div className="skeleton-line skeleton-shimmer" />
          <div className="skeleton-line skeleton-shimmer short" />
        </div>
        <div className="skeleton-card">
          <div className="skeleton-title skeleton-shimmer" />
          <div className="skeleton-line skeleton-shimmer" />
          <div className="skeleton-line skeleton-shimmer short" />
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="grid-2">
      <div className="skeleton-card">
        <div className="skeleton-title skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer short" />
      </div>
      <div className="skeleton-card">
        <div className="skeleton-title skeleton-shimmer" />
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className="skeleton-table-row skeleton-shimmer" />
        ))}
      </div>
    </div>
  );

  const renderTripsSkeleton = () => (
    <div className="grid-2">
      <div className="skeleton-card">
        <div className="skeleton-title skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer short" />
      </div>
      <div className="skeleton-card">
        <div className="skeleton-title skeleton-shimmer" />
        {[1, 2, 3].map(n => (
          <div key={n} className="skeleton-card skeleton-shimmer" style={{ height: '70px', marginBottom: '10px' }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="view" style={{ display: 'block' }}>
      <div className="page-head" style={{ marginBottom: '22px' }}>
        <div className="skeleton-title skeleton-shimmer" style={{ width: '150px', height: '24px', marginBottom: 0 }} />
      </div>
      {view === 'dashboard' && renderDashboardSkeleton()}
      {view === 'trips' && renderTripsSkeleton()}
      {view !== 'dashboard' && view !== 'trips' && renderTableSkeleton()}
    </div>
  );
}

export default SkeletonLoader;
