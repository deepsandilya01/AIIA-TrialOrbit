import { useTranslation } from 'react-i18next';
import React from 'react';
import { alerts } from '../../data/dummyData';
import './RecentAlerts.css';

const RecentAlerts = () => {
  const { t } = useTranslation();

  return (
    <div className="card alerts-card">
      <div className="card-header">
        <h3 className="card-title">{t('dashboard.recentAlerts')}</h3>
      </div>
      
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className="alert-item">
            <div className={`alert-dot ${alert.type === 'Critical' ? 'dot-danger' : 'dot-warning'}`}></div>
            <div className="alert-content">
              <p className="alert-text">{alert.text}</p>
              <div className="alert-meta">
                <span className="alert-study">Study {alert.study}</span>
                <span className="alert-date">{alert.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;
