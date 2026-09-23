import { useTranslation } from 'react-i18next';
import React from 'react';
import { Download } from 'lucide-react';
import { auditLogs } from '../../data/dummyData';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const AuditTrail = () => {
  const { t } = useTranslation();

  const getActionColor = (action) => {
    switch(action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'danger';
      case 'UPLOAD': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('general.auditTrail')}</h1>
          <p className="page-subtitle">CFR 21 Part 11 compliant system activity log</p>
        </div>
        <Button variant="outline">
          <Download size={18} /> Export Log
        </Button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('audit.timestamp')}</th>
                <th>{t('audit.user')}</th>
                <th>{t('audit.action')}</th>
                <th>{t('audit.entity')}</th>
                <th>Old Value</th>
                <th>{t('audit.newValue')}</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td className="text-muted font-medium">{log.time}</td>
                  <td className="font-medium">{log.user}</td>
                  <td>
                    <Badge variant={getActionColor(log.action)}>{log.action}</Badge>
                  </td>
                  <td>{log.entity}</td>
                  <td className="text-muted">{log.oldVal}</td>
                  <td className="font-medium">{log.newVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
