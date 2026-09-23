import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon, status }) => {
  return (
    <div className="card stat-card">
      <div className="stat-header">
        <div className="stat-title-group">
          <span className="stat-title">{title}</span>
        </div>
        <div className="stat-icon-wrapper">
          {icon}
        </div>
      </div>
      
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {status && (
          <p className={`stat-status ${status.includes('Requires') ? 'text-danger' : 'text-success'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
