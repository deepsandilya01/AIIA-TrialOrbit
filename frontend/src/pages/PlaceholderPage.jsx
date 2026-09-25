import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  const title = location.pathname
    .substring(1)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">Module under construction (PS 26046 implementation)</p>
        </div>
      </div>
      <div className="card empty-state" style={{ padding: '4rem', textAlign: 'center' }}>
        <h3 className="empty-title">Coming Soon</h3>
        <p className="empty-desc">This module is currently being implemented according to the AIIA TrialOrbit requirements.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
