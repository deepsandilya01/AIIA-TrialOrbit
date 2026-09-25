import React from 'react';
import './LoadingSkeleton.css';

export const SkeletonLine = ({ width = '100%', height = '16px', className = '' }) => (
  <div className={`skeleton-pulse ${className}`} style={{ width, height, borderRadius: '4px' }} />
);

export const SkeletonCard = ({ height = '120px', className = '' }) => (
  <div className={`card skeleton-card ${className}`} style={{ height }}>
    <div className="skeleton-pulse" style={{ width: '40%', height: '14px', marginBottom: '12px' }} />
    <div className="skeleton-pulse" style={{ width: '70%', height: '24px', marginBottom: '8px' }} />
    <div className="skeleton-pulse" style={{ width: '50%', height: '12px' }} />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={`card ${className}`} style={{ overflow: 'hidden' }}>
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton-pulse" style={{ flex: 1, height: '16px' }} />
      ))}
    </div>
    <div style={{ padding: '16px' }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: r !== rows - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skeleton-pulse" style={{ flex: c === 0 ? 1.5 : 1, height: '14px' }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default {
  Line: SkeletonLine,
  Card: SkeletonCard,
  Table: SkeletonTable
};
