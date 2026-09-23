import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MoreVertical } from 'lucide-react';
import { studies } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './Studies.css';

const Studies = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStudyClick = (id) => {
    navigate(`/studies/${id}`);
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Ongoing': return 'success';
      case 'Planned': return 'warning';
      case 'Completed': return 'info';
      case 'On Hold': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="page-container studies-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clinical Studies</h1>
          <p className="page-subtitle">Manage and monitor all institutional clinical trials</p>
        </div>
        <Button onClick={() => console.log('Open create modal')}>
          <Plus size={18} />{t('dashboard.createNewStudy')}</Button>
      </div>

      <div className="card studies-content">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search studies by ID, Title, or PI..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <Button variant="outline" className="filter-btn">
              <Filter size={16} />{t('general.filter')}</Button>
            <select className="status-select">
              <option value="all">All Statuses</option>
              <option value="ongoing">{t('studies.ongoing')}</option>
              <option value="completed">{t('studies.completed')}</option>
              <option value="planned">Planned</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('studies.studyId')}</th>
                <th>{t('studies.studyTitle')}</th>
                <th>Type</th>
                <th>{t('general.sites')}</th>
                <th>{t('general.participants')}</th>
                <th>{t('general.status')}</th>
                <th>{t('studies.progress')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {studies.map(study => (
                <tr key={study.id} className="clickable-row" onClick={() => handleStudyClick(study.id)}>
                  <td className="font-semibold text-primary">{study.id}</td>
                  <td className="font-medium max-w-xs truncate" title={study.title}>{study.title}</td>
                  <td>{study.type}</td>
                  <td>{study.sites}</td>
                  <td>{study.participants} / {study.targetParticipants}</td>
                  <td>
                    <Badge variant={getStatusVariant(study.status)}>{study.status}</Badge>
                  </td>
                  <td>
                    <div className="mini-progress">
                      <div className="mini-progress-bar bg-primary" style={{width: `${study.progress}%`}}></div>
                    </div>
                    <span className="text-xs text-muted">{study.progress}%</span>
                  </td>
                  <td>
                    <button className="icon-btn text-muted" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreVertical size={16} />
                    </button>
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

export default Studies;
