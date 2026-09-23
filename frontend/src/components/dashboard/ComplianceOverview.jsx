import { useTranslation } from 'react-i18next';
import React from 'react';
import Badge from '../common/Badge';
import { complianceData } from '../../data/dummyData';
import './ComplianceOverview.css';

const ComplianceOverview = () => {
  const { t } = useTranslation();

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Approved':
      case 'Registered':
      case 'Completed':
        return 'success';
      case 'Due Soon':
        return 'warning';
      case 'Pending':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="card compliance-card">
      <div className="card-header">
        <h3 className="card-title">{t('dashboard.complianceOverview')}</h3>
      </div>
      
      <div className="table-responsive">
        <table className="compliance-table">
          <thead>
            <tr>
              <th>{t('compliance.requirement')}</th>
              <th>{t('general.status')}</th>
              <th>{t('compliance.dueDate')}</th>
              <th>Days Remaining</th>
            </tr>
          </thead>
          <tbody>
            {complianceData.map(item => (
              <tr key={item.id}>
                <td className="font-medium">{item.req}</td>
                <td>
                  <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                </td>
                <td>{item.date}</td>
                <td>
                  {item.days !== null ? (
                    <span className={item.days < 10 ? 'text-danger font-medium' : ''}>
                      {item.days} days
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
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
