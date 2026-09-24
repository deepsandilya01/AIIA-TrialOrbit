import { useTranslation } from 'react-i18next';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Users, Activity } from 'lucide-react';
import { sites } from '../../data/dummyData';
import Badge from '../../components/common/Badge';

const SiteDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const site = sites.find(s => s.id === id) || sites[0];

  return (
    <div className="page-container">
      <div className="back-nav mb-4">
        <button className="icon-btn text-muted flex items-center gap-2" onClick={() => navigate('/sites')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back to Sites
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="primary" className="mb-2">Site ID: {site.id}</Badge>
            <h1 className="page-title">{site.name}</h1>
            <div className="flex items-center gap-2 text-muted mt-2">
              <MapPin size={16} /> {site.location}
            </div>
          </div>
          <Badge variant={site.status === 'Active' ? 'success' : 'warning'}>{site.status}</Badge>
        </div>
        
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
          <div className="p-4 border rounded">
            <div className="text-muted text-sm mb-1">Principal Investigator</div>
            <div className="font-medium">{site.pi}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-muted text-sm mb-1 flex items-center gap-1"><Users size={14} /> Enrollment</div>
            <div className="font-medium">{site.enrolled} / {site.target} Target</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-muted text-sm mb-1 flex items-center gap-1"><Activity size={14} /> Recent Activity</div>
            <div className="font-medium text-success">Monitoring passed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
