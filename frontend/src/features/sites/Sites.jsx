import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin } from 'lucide-react';
import { sites } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Sites = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Research Sites</h1>
          <p className="page-subtitle">Manage all participating clinical trial sites</p>
        </div>
        <Button>
          <Plus size={18} /> Add New Site
        </Button>
      </div>

      <div className="card">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search sites by Name, Location, or PI..." className="search-input" />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('sites.siteId')}</th>
                <th>{t('sites.siteName')}</th>
                <th>{t('sites.location')}</th>
                <th>{t('studies.principalInvestigator')}</th>
                <th>Current Enrollment</th>
                <th>{t('general.status')}</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id} className="clickable-row" onClick={() => navigate(`/sites/${site.id}`)}>
                  <td className="font-semibold text-primary">{site.id}</td>
                  <td className="font-medium">{site.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted" /> {site.location}
                    </div>
                  </td>
                  <td>{site.pi}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{site.enrolled}</span>
                      <span className="text-muted text-xs">/ {site.target} Target</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={site.status === 'Active' ? 'success' : 'warning'}>{site.status}</Badge>
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

export default Sites;
