import { useTranslation } from 'react-i18next';
import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { aesaeData } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const AESAE = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Adverse Events & Safety</h1>
          <p className="page-subtitle">Manage and report AEs and SAEs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus size={18} />{t('safety.reportAe')}</Button>
          <Button variant="primary" className="bg-danger" style={{backgroundColor: '#DC2626'}}>
            <AlertTriangle size={18} />{t('safety.reportSae')}</Button>
        </div>
      </div>

      <div className="study-tabs">
        <div className="tab active">All Events</div>
        <div className="tab">Adverse Events (AE)</div>
        <div className="tab">Serious Adverse Events (SAE)</div>
      </div>

      <div className="card mt-4">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>{t('alerts.study')}</th>
                <th>Participant</th>
                <th>{t('safety.event')}</th>
                <th>{t('safety.severity')}</th>
                <th>{t('safety.serious')}</th>
                <th>{t('general.date')}</th>
                <th>{t('general.status')}</th>
                <th>{t('audit.action')}</th>
              </tr>
            </thead>
            <tbody>
              {aesaeData.map((event, index) => (
                <tr key={index}>
                  <td className="font-semibold">{event.id}</td>
                  <td className="text-primary">{event.study}</td>
                  <td>{event.participant}</td>
                  <td className="font-medium">{event.event}</td>
                  <td>{event.severity}</td>
                  <td>
                    <Badge variant={event.serious === 'Yes' ? 'danger' : 'default'}>{event.serious}</Badge>
                  </td>
                  <td>{event.date}</td>
                  <td>
                    <Badge variant={event.status === 'Resolved' ? 'success' : (event.status === 'Ongoing' ? 'warning' : 'danger')}>
                      {event.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline" size="sm">Review</Button>
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

export default AESAE;
