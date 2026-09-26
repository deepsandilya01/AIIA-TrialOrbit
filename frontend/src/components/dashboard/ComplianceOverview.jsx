import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import api from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import './ComplianceOverview.css';

const ComplianceOverview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [complianceData, setComplianceData] = useState([]);

  const loadData = () => {
    api.getComplianceData().then(setComplianceData).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  useSocketEvent('regulatory:created', loadData);
  useSocketEvent('regulatory:updated', loadData);
  useSocketEvent('regulatory:overdue', loadData);

  return (
    <div className="card compliance-card">
      <div className="card-header">
        <h3 className="card-title flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          <span>{t('dashboard.complianceOverview', 'Regulatory & IEC Approvals')}</span>
        </h3>
        <button 
          onClick={() => navigate('/compliance')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
        >
          View All <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="compliance-table">
          <thead>
            <tr>
              <th>{t('compliance.requirement', 'Milestone Requirement')}</th>
              <th>{t('general.status', 'Status')}</th>
              <th>Due / Cleared Date</th>
              <th>Countdown</th>
            </tr>
          </thead>
          <tbody>
            {complianceData.slice(0, 4).map(item => (
              <tr key={item.id} className="clickable-row" onClick={() => navigate('/compliance')}>
                <td className="font-medium">{item.req}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td className="text-sm">{item.date}</td>
                <td>
                  {item.days !== null ? (
                    <span className={item.days < 10 ? 'text-danger font-semibold' : 'text-warning font-medium'}>
                      {item.days} days
                    </span>
                  ) : (
                    <span className="text-success text-xs font-semibold">Cleared</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceOverview;
