import { useTranslation } from 'react-i18next';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, FileText, Activity, AlertTriangle, Users } from 'lucide-react';
import { studies, sites, recruitmentTrend, aesaeData } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './StudyDetails.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudyDetails = () => {
  const { t } = useTranslation();

  const { id } = useParams();
  const navigate = useNavigate();
  
  const study = studies.find(s => s.id === id) || studies[0];
  const studySites = sites; // Using all dummy sites for prototype
  
  return (
    <div className="page-container study-details">
      <div className="back-nav">
        <button className="back-btn" onClick={() => navigate('/studies')}>
          <ArrowLeft size={16} /> Back to Studies
        </button>
      </div>
      
      <div className="study-header-card card">
        <div className="study-header-main">
          <div className="study-title-section">
            <Badge variant="primary" className="mb-2">Study ID: {study.id}</Badge>
            <h1 className="study-main-title">{study.title}</h1>
            <div className="study-tags">
              <span className="tag">Type: {study.type}</span>
              <span className="tag">Sponsor: {study.sponsor}</span>
              <span className="tag">PI: {study.pi}</span>
            </div>
          </div>
          <div className="study-actions">
            <Badge variant="success" className="status-badge-lg">{study.status}</Badge>
            <Button variant="outline"><Edit size={16} /> Edit Details</Button>
          </div>
        </div>
        
        <div className="study-stats-bar">
          <div className="stat-item">
            <span className="stat-label">{t('studies.startDate')}</span>
            <span className="stat-value">{study.startDate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('studies.endDate')}</span>
            <span className="stat-value">{study.endDate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('dashboard.activeSites')}</span>
            <span className="stat-value">{study.sites}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('studies.enrollment')}</span>
            <span className="stat-value">{study.participants} / {study.targetParticipants}</span>
            <div className="progress-mini mt-1">
              <div className="progress-bar-mini" style={{width: `${study.progress}%`}}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="study-tabs">
        <div className="tab active">Overview</div>
        <div className="tab">{t('general.sites')}</div>
        <div className="tab">{t('general.recruitment')}</div>
        <div className="tab">{t('general.compliance')}</div>
        <div className="tab">AE / SAE</div>
        <div className="tab">Activity</div>
      </div>
      
      <div className="study-content-grid">
        <div className="main-col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><Activity size={18} /> Recruitment Trend</h3>
            </div>
            <div className="chart-wrapper p-4" style={{height: '300px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recruitmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#0B4A8E" strokeWidth={3} name="Actual Enrolled" />
                  <Line type="monotone" dataKey="target" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title"><Building2 size={18} /> Participating Sites</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('sites.siteName')}</th>
                  <th>PI</th>
                  <th>Enrolled / Target</th>
                  <th>{t('general.status')}</th>
                </tr>
              </thead>
              <tbody>
                {studySites.slice(0, 3).map(site => (
                  <tr key={site.id}>
                    <td className="font-medium">{site.name}</td>
                    <td>{site.pi}</td>
                    <td>{site.enrolled} / {site.target}</td>
                    <td><Badge variant={site.status === 'Active' ? 'success' : 'warning'}>{site.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="side-col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><AlertTriangle size={18} />{t('dashboard.safetyOverview')}</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted">Total AEs</span>
                <span className="font-bold text-lg">14</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <span className="text-muted">Total SAEs</span>
                <span className="font-bold text-lg text-danger">2</span>
              </div>
              
              <h4 className="font-medium mb-2 text-sm text-muted uppercase">Recent Events</h4>
              <div className="flex flex-col gap-3">
                {aesaeData.slice(0, 3).map(event => (
                  <div key={event.id} className="flex justify-between items-start text-sm">
                    <div>
                      <div className="font-medium">{event.event}</div>
                      <div className="text-muted">{event.date} • {event.participant}</div>
                    </div>
                    <Badge variant={event.serious === 'Yes' ? 'danger' : 'warning'}>{event.id}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title"><FileText size={18} /> Essential Documents</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="text-sm font-medium">Study Protocol v2.1</span>
                </div>
                <span className="text-xs text-success">{t('compliance.approved')}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="text-sm font-medium">IEC Approval Letter</span>
                </div>
                <span className="text-xs text-success">{t('compliance.approved')}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="text-sm font-medium">Informed Consent Form</span>
                </div>
                <span className="text-xs text-warning">{t('safety.underReview')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDetails;
