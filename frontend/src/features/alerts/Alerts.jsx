import { useTranslation } from 'react-i18next';
import React from 'react';
import { Bell, Filter } from 'lucide-react';
import { alerts } from '../../data/dummyData';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const Alerts = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Alerts</h1>
          <p className="page-subtitle">Notifications, tasks and critical warnings</p>
        </div>
        <Button variant="outline">
          <Filter size={18} /> Filter Alerts
        </Button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Message</th>
                <th>{t('alerts.study')}</th>
                <th>{t('general.date')}</th>
                <th>{t('audit.action')}</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id}>
                  <td>
                    <Badge variant={alert.type === 'Critical' ? 'danger' : 'warning'}>{alert.type}</Badge>
                  </td>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className={alert.type === 'Critical' ? 'text-danger' : 'text-warning'} />
                      {alert.text}
                    </div>
                  </td>
                  <td className="text-primary font-medium">{alert.study}</td>
                  <td className="text-muted">{alert.date}</td>
                  <td>
                    <Button variant="outline" size="sm">Acknowledge</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
