import React, { useState } from 'react';
import { Search, FlaskConical, MapPin, Users, Award, ExternalLink } from 'lucide-react';
import { studies } from '../data/dummyData';
import StatusBadge from '../components/common/StatusBadge';
import DemoBadge from '../components/common/DemoBadge';
import EmptyState from '../components/common/EmptyState';
import './PublicPages.css';

const PublicStudies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredStudies = studies.filter(study => {
    const matchesSearch = 
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      study.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (study.therapeuticArea && study.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (study.ctriNumber && study.ctriNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || study.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="public-page">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="page-title">Public Clinical Trial Registry</h1>
        <DemoBadge />
      </div>
      <p className="page-subtitle">Browse transparent public registries of institutional Ayurvedic clinical trials, protocol phases, and ethics clearances.</p>
      
      <div className="studies-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by ID, Protocol Title, Therapeutic Area, or CTRI..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
          style={{ width: '180px' }}
        >
          <option value="All">All Statuses</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Recruiting">Recruiting</option>
          <option value="Completed">Completed</option>
          <option value="Planned">Planned</option>
        </select>
      </div>

      <div className="public-studies-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredStudies.length > 0 ? (
          filteredStudies.map(study => (
            <div key={study.id} className="study-list-card card p-4">
              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{study.id}</span>
                  {study.ctriNumber && <span className="badge badge-default text-xs">{study.ctriNumber}</span>}
                  <span className="badge badge-primary text-xs">{study.phase || 'Phase II'}</span>
                </div>
                <StatusBadge status={study.status} />
              </div>

              <h3 className="study-list-title font-semibold" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {study.title}
              </h3>
              
              <p className="text-xs text-secondary mb-3">
                <strong>Therapeutic Area:</strong> {study.therapeuticArea || 'Clinical Research'} • <strong>Sponsor:</strong> {study.sponsor}
              </p>

              <div className="study-list-details flex items-center gap-4 text-xs text-muted border-t pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="flex items-center gap-1"><MapPin size={13} /> {study.sites} Research Sites</span>
                <span className="flex items-center gap-1"><Users size={13} /> {study.participants} / {study.targetParticipants} Enrolled Subjects</span>
                <span className="flex items-center gap-1"><Award size={13} /> IEC Clearance Active</span>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<FlaskConical size={38} className="text-muted" />}
            title="No studies match your criteria"
            description="Try adjusting your keyword or status filter to see other registered clinical protocols."
          />
        )}
      </div>
      
      <div className="demo-notice" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        * Transparent registry view. No protected health information (PHI) is accessible on this public gateway.
      </div>
    </div>
  );
};

export default PublicStudies;
