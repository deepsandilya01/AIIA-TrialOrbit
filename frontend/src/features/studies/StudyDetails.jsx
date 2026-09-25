import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, FileText, Activity, AlertTriangle, Users, 
  Building2, CheckCircle2, Shield, Calendar, Download, Plus
} from 'lucide-react';
import { studies, sites, recruitmentTrend, aesaeData, complianceData, auditLogs } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import { useToast } from '../../context/ToastContext';
import './StudyDetails.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudyDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const study = studies.find(s => s.id === id) || studies[0];
  const studySites = sites;

  const handleExportSummary = () => {
    success(`Study ${study.id} summary dossier exported in PDF format.`);
  };

  return (
    <div className="page-container study-details">
      <div className="back-nav mb-3">
        <button className="back-btn" onClick={() => navigate('/studies')}>
          <ArrowLeft size={16} /> Back to Studies
        </button>
      </div>
      
      <div className="study-header-card card">
        <div className="study-header-main">
          <div className="study-title-section">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="primary">Study ID: {study.id}</Badge>
              {study.ctriNumber && <Badge variant="default">{study.ctriNumber}</Badge>}
              <DemoBadge />
            </div>
            <h1 className="study-main-title">{study.title}</h1>
            <div className="study-tags">
              <span className="tag"><strong>Type:</strong> {study.type}</span>
              <span className="tag"><strong>Sponsor:</strong> {study.sponsor}</span>
              <span className="tag"><strong>PI:</strong> {study.pi}</span>
              <span className="tag"><strong>Area:</strong> {study.therapeuticArea || 'Clinical Research'}</span>
            </div>
          </div>
          <div className="study-actions">
            <StatusBadge status={study.status} pulse />
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExportSummary}>
              Export Dossier
            </Button>
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
            <span className="stat-value">{study.sites} Sites</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t('studies.enrollment')}</span>
            <span className="stat-value">{study.participants} / {study.targetParticipants}</span>
            <div className="progress-mini mt-1">
              <div className="progress-bar-mini" style={{width: `${study.progress}%`}}></div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-label">Data Quality</span>
            <span className="stat-value text-success">{study.dataQualityScore || 96.5}%</span>
          </div>
        </div>
      </div>
      
      {/* Interactive Tabs */}
      <div className="study-tabs" role="tablist">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          role="tab"
          aria-selected={activeTab === 'overview'}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'sites' ? 'active' : ''}`}
          onClick={() => setActiveTab('sites')}
          role="tab"
          aria-selected={activeTab === 'sites'}
        >
          {t('general.sites')} ({studySites.length})
        </button>
        <button 
          className={`tab ${activeTab === 'recruitment' ? 'active' : ''}`}
          onClick={() => setActiveTab('recruitment')}
          role="tab"
          aria-selected={activeTab === 'recruitment'}
        >
          {t('general.recruitment')}
        </button>
        <button 
          className={`tab ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
          role="tab"
          aria-selected={activeTab === 'compliance'}
        >
          {t('general.compliance')}
        </button>
        <button 
          className={`tab ${activeTab === 'safety' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety')}
          role="tab"
          aria-selected={activeTab === 'safety'}
        >
          AE / SAE ({aesaeData.length})
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
          role="tab"
          aria-selected={activeTab === 'activity'}
        >
          Audit History
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div className="study-content-grid">
          <div className="main-col">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><Activity size={18} /> Recruitment Trend & Target Trajectory</h3>
              </div>
              <div className="chart-wrapper p-4" style={{height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recruitmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="var(--primary-color)" strokeWidth={3} name="Actual Enrolled" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" stroke="var(--accent-color)" strokeWidth={2} strokeDasharray="5 5" name="Target Plan" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header">
                <h3 className="card-title"><Building2 size={18} /> Participating Sites Allocation</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('sites')}>View All</Button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('sites.siteName')}</th>
                      <th>Principal Investigator</th>
                      <th>Enrolled / Target</th>
                      <th>GCP Compliance</th>
                      <th>{t('general.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studySites.slice(0, 3).map(site => (
                      <tr key={site.id} className="clickable-row" onClick={() => navigate(`/sites/${site.id}`)}>
                        <td className="font-medium text-primary">{site.name}</td>
                        <td>{site.pi}</td>
                        <td>{site.enrolled} / {site.target}</td>
                        <td>
                          <span className="font-semibold text-success">{site.complianceRate || 95}%</span>
                        </td>
                        <td><StatusBadge status={site.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="side-col">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title"><AlertTriangle size={18} /> Pharmacovigilance Summary</h3>
              </div>
              <div className="card-body">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-muted">Total Documented AEs</span>
                  <span className="font-bold text-lg">14</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-muted">Expedited SAEs (CDSCO)</span>
                  <span className="font-bold text-lg text-danger">2</span>
                </div>
                
                <h4 className="font-semibold mb-2 text-xs text-muted uppercase tracking-wider">Latest Safety Case Files</h4>
                <div className="flex flex-col gap-3">
                  {aesaeData.slice(0, 3).map(event => (
                    <div key={event.id} className="flex justify-between items-start text-sm p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div>
                        <div className="font-medium">{event.event}</div>
                        <div className="text-muted text-xs">{event.date} • Subject {event.participant}</div>
                      </div>
                      <Badge variant={event.serious === 'Yes' ? 'danger' : 'warning'}>{event.id}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header">
                <h3 className="card-title"><FileText size={18} /> Regulatory Trial Master File (TMF)</h3>
              </div>
              <div className="card-body flex flex-col gap-3">
                <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="text-sm font-medium">Study Protocol v2.1</span>
                  </div>
                  <Badge variant="success">Approved</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="text-sm font-medium">IEC Human Ethics Letter</span>
                  </div>
                  <Badge variant="success">Approved</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="text-sm font-medium">Informed Consent Form (Bilingual)</span>
                  </div>
                  <Badge variant="warning">Under Review</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sites' && (
        <div className="card mt-2">
          <div className="card-header">
            <h3 className="card-title"><Building2 size={18} /> Study Participating Trial Sites</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Site ID</th>
                  <th>Facility Name</th>
                  <th>Location</th>
                  <th>Principal Investigator</th>
                  <th>Enrolled / Target</th>
                  <th>Compliance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {studySites.map(site => (
                  <tr key={site.id} className="clickable-row" onClick={() => navigate(`/sites/${site.id}`)}>
                    <td className="font-semibold text-primary">{site.id}</td>
                    <td className="font-medium">{site.name}</td>
                    <td>{site.location}</td>
                    <td>{site.pi}</td>
                    <td>{site.enrolled} / {site.target}</td>
                    <td><span className="text-success font-semibold">{site.complianceRate || 92}%</span></td>
                    <td><StatusBadge status={site.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="card mt-2">
          <div className="card-header">
            <h3 className="card-title"><Users size={18} /> Cohort Progression & Screening Ratio</h3>
          </div>
          <div className="card-body">
            <div className="recruitment-stats-grid">
              <div className="p-3 border rounded">
                <span className="text-xs text-muted">Total Screened</span>
                <div className="text-xl font-bold">{Math.round(study.participants * 1.45)}</div>
              </div>
              <div className="p-3 border rounded">
                <span className="text-xs text-muted">Enrolled Subjects</span>
                <div className="text-xl font-bold text-primary">{study.participants}</div>
              </div>
              <div className="p-3 border rounded">
                <span className="text-xs text-muted">Target Cohort</span>
                <div className="text-xl font-bold">{study.targetParticipants}</div>
              </div>
              <div className="p-3 border rounded">
                <span className="text-xs text-muted">Completion Rate</span>
                <div className="text-xl font-bold text-success">{study.progress}%</div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recruitmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="var(--primary-color)" strokeWidth={3} name="Enrolled" />
                  <Line type="monotone" dataKey="target" stroke="var(--accent-color)" strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="card mt-2">
          <div className="card-header">
            <h3 className="card-title"><Shield size={18} /> Regulatory & Ethics Milestones</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Milestone Requirement</th>
                  <th>Oversight Authority</th>
                  <th>Target Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complianceData.map(item => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.req}</td>
                    <td className="text-muted">{item.authority}</td>
                    <td>{item.date}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'safety' && (
        <div className="card mt-2">
          <div className="card-header">
            <h3 className="card-title"><AlertTriangle size={18} /> Documented Safety Events</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Subject</th>
                  <th>Adverse Event</th>
                  <th>Severity</th>
                  <th>Serious</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {aesaeData.map(item => (
                  <tr key={item.id}>
                    <td className="font-semibold">{item.id}</td>
                    <td>{item.participant}</td>
                    <td className="font-medium">{item.event}</td>
                    <td>{item.severity}</td>
                    <td><Badge variant={item.serious === 'Yes' ? 'danger' : 'default'}>{item.serious}</Badge></td>
                    <td>{item.date}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card mt-2">
          <div className="card-header">
            <h3 className="card-title"><Calendar size={18} /> CFR 21 Part 11 Electronic Audit Log</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Investigator / User</th>
                  <th>Action</th>
                  <th>Record Entity</th>
                  <th>New State</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td className="text-muted text-xs">{log.time}</td>
                    <td className="font-medium">{log.user}</td>
                    <td><Badge variant="primary">{log.action}</Badge></td>
                    <td>{log.entity}</td>
                    <td className="font-semibold text-primary">{log.newVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyDetails;
