import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import './StatCard.css';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  status,
  trend,
  linkTo,
  badgeText
}) => {
  const cardContent = (
    <>
      <div className="stat-header">
        <div className="stat-title-group">
          <span className="stat-title">{title}</span>
          {badgeText && <span className="stat-badge">{badgeText}</span>}
        </div>
        <div className="stat-icon-wrapper">
          {icon}
        </div>
      </div>
      
      <div className="stat-content">
        <div className="stat-value-row">
          <h3 className="stat-value">{value}</h3>
          {trend && (
            <div className={`stat-trend ${trend.isPositive ? 'trend-up' : 'trend-neutral'}`}>
              {trend.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {status && (
          <p className={`stat-status ${status.toLowerCase().includes('requires') || status.toLowerCase().includes('critical') ? 'status-alert' : 'status-ok'}`}>
            <span className="status-dot"></span>
            {status}
          </p>
        )}
      </div>

      {linkTo && (
        <div className="stat-action-indicator" aria-hidden="true">
          <ArrowUpRight size={13} />
        </div>
      )}
    </>
  );

  return linkTo ? (
    <Link to={linkTo} className="card stat-card interactive" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {cardContent}
    </Link>
  ) : (
    <div className="card stat-card">
      {cardContent}
    </div>
  );
};

export default StatCard;
