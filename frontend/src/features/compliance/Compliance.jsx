import { useTranslation } from 'react-i18next';
import React from 'react';
import { FileCheck, UploadCloud, Download } from 'lucide-react';
import { complianceData } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Compliance = () => {
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
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Management</h1>
          <p className="page-subtitle">Track regulatory submissions, approvals, and monitorings</p>
        </div>
        <Button>
          <UploadCloud size={18} />{t('compliance.uploadDocument')}</Button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('compliance.requirement')}</th>
                <th>{t('general.status')}</th>
                <th>{t('compliance.dueDate')}</th>
                <th>Days Remaining</th>
                <th>{t('audit.action')}</th>
              </tr>
            </thead>
            <tbody>
              {complianceData.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-primary" />
                      <span className="font-medium">{item.req}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    {item.days !== null ? (
                      <span className={item.days < 10 ? 'text-danger font-bold' : ''}>
                        {item.days} days
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <Button variant="outline" size="sm">
                      <Download size={14} />{t('compliance.download')}</Button>
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

export default Compliance;
