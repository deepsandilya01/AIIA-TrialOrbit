import React, { useState } from 'react';
import './PublicPages.css';

const PublicStudies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const studies = [
    { id: 'AIIA-001', title: 'Ayurvedic Intervention Study for Diabetes Type II', status: 'Recruiting', phase: 'Phase II', sites: 3 },
    { id: 'AIIA-002', title: 'Clinical Evaluation of Ashwagandha extract in stress', status: 'Active', phase: 'Phase III', sites: 5 },
    { id: 'AIIA-003', title: 'Multi-Centre Study on Rheumatoid Arthritis', status: 'Monitoring', phase: 'Phase IV', sites: 12 },
    { id: 'AIIA-004', title: 'Pediatric Respiratory Health Observational Study', status: 'Completed', phase: 'Observational', sites: 2 },
    { id: 'AIIA-005', title: 'Standardization of Panchakarma Therapies', status: 'Planning', phase: 'Phase I', sites: 1 },
  ];

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          study.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || study.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="public-page">
      <h1 className="page-title">Research Studies</h1>
      <p className="page-subtitle">Browse public information about ongoing and past clinical trials.</p>
      
      <div className="studies-controls">
        <input 
          type="text" 
          placeholder="Search by ID or Title..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="All">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="Recruiting">Recruiting</option>
          <option value="Active">Active</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="public-studies-list">
        {filteredStudies.length > 0 ? (
          filteredStudies.map(study => (
            <div key={study.id} className="study-list-card card">
              <div className="study-list-header">
                <span className="study-id">{study.id}</span>
                <span className={`status-badge ${study.status.toLowerCase()}`}>{study.status}</span>
              </div>
              <h3 className="study-list-title">{study.title}</h3>
              <div className="study-list-details">
                <span><strong>Phase:</strong> {study.phase}</span>
                <span><strong>Participating Sites:</strong> {study.sites}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results card">
            <p>No studies found matching your criteria.</p>
          </div>
        )}
      </div>
      
      <div className="demo-notice" style={{ marginTop: '2rem' }}>
        * No sensitive patient or clinical data is exposed on this portal.
      </div>
    </div>
  );
};

export default PublicStudies;
