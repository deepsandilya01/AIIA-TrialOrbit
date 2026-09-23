import { useTranslation } from 'react-i18next';
import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { studies } from '../../data/dummyData';
import './StudyProgress.css';

const StudyProgress = () => {
  const { t } = useTranslation();

  return (
    <div className="card study-progress-card">
      <div className="card-header">
        <h3 className="card-title">{t('dashboard.studyProgress')}</h3>
        <button className="view-all-btn">
          View All Studies <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="progress-table">
          <thead>
            <tr>
              <th>{t('studies.studyId')}</th>
              <th>Title</th>
              <th>Enrollment Progress</th>
            </tr>
          </thead>
          <tbody>
            {studies.map(study => (
              <tr key={study.id}>
                <td className="study-id">{study.id}</td>
                <td className="study-title">{study.title}</td>
                <td className="progress-cell">
                  <div className="progress-wrapper">
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${study.progress < 40 ? 'bg-danger' : 'bg-primary'}`} 
                        style={{ width: `${study.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{study.progress}%</span>
                    {study.progress < 40 && (
                      <AlertTriangle size={16} className="text-warning" />
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
