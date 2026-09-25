import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { alerts } from '../../data/dummyData';
import { AlertTriangle, Bell, ArrowRight } from 'lucide-react';
import './RecentAlerts.css';

const RecentAlerts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="card alerts-card">
      <div className="card-header">
        <h3 className="card-title flex items-center gap-2">
          <Bell size={16} className="text-warning" />
          <span>{t('dashboard.recentAlerts', 'Real-Time Surveillance Alerts')}</span>
        </h3>
        <button 
          onClick={() => navigate('/alerts')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
        >
          View All <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="alerts-list">
        {alerts.slice(0, 4).map(alert => (
          <div key={alert.id} className="alert-item clickable-row" onClick={() => navigate('/alerts')}>
            <div className={`alert-dot ${alert.type === 'Critical' ? 'dot-danger' : 'dot-warning'}`}></div>
            <div className="alert-content">
              <p className="alert-text">{alert.text}</p>
              <div className="alert-meta">
                <span className="alert-study">Protocol {alert.study}</span>
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
