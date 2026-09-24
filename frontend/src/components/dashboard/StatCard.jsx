import React from 'react';
import { Link } from 'react-router-dom';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon, status, linkTo }) => {
  const cardContent = (
    <>
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
    </>
  );

  return linkTo ? (
    <Link to={linkTo} className="card stat-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {cardContent}
    </Link>
  ) : (
    <div className="card stat-card">
      {cardContent}
    </div>
  );
};

export default StatCard;
