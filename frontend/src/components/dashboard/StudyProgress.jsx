import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { studies } from '../../data/dummyData';
import StatusBadge from '../common/StatusBadge';
import './StudyProgress.css';

const StudyProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="card study-progress-card">
      <div className="card-header">
        <h3 className="card-title">{t('dashboard.studyProgress', 'Active Protocol Recruitment Progress')}</h3>
        <button className="view-all-btn" onClick={() => navigate('/studies')}>
          View All Studies <ArrowRight size={14} />
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="progress-table">
          <thead>
            <tr>
              <th>{t('studies.studyId', 'Study ID')}</th>
              <th>Protocol Title</th>
              <th>Status</th>
              <th>Enrollment Progress</th>
            </tr>
          </thead>
          <tbody>
            {studies.slice(0, 4).map(study => (
              <tr key={study.id} className="clickable-row" onClick={() => navigate(`/studies/${study.id}`)}>
                <td className="study-id font-semibold text-primary">{study.id}</td>
                <td className="study-title font-medium truncate" style={{ maxWidth: '240px' }} title={study.title}>
                  {study.title}
                </td>
                <td>
                  <StatusBadge status={study.status} />
                </td>
                <td className="progress-cell">
                  <div className="progress-wrapper">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${study.progress}%`,
                          backgroundColor: study.progress < 40 ? 'var(--warning)' : 'var(--primary-color)'
                        }}
                      ></div>
                    </div>
                    <span className="progress-text font-semibold">{study.progress}%</span>
                    <span className="text-xs text-muted">({study.participants}/{study.targetParticipants})</span>
                    {study.progress < 40 && (
                      <AlertTriangle size={14} className="text-warning" title="Recruitment below 40% milestone" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudyProgress;
