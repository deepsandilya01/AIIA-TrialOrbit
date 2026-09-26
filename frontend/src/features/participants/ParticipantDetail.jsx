import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileSignature, Clock, CheckCircle, ShieldAlert, FileWarning, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import { api } from '../../services/api';
import usePermissions from '../../hooks/usePermissions';

const ParticipantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { canDo } = usePermissions();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const participant = await api.getParticipantById(id);
    const studies = await api.getStudies();
    const sites = await api.getSites();
    const visits = await api.getVisits();
    const queries = await api.getDataQueries();
    const aes = await api.getSafetyEvents();
    
    setData({
      participant,
      study: studies.find(s => s.id === participant.studyId),
      site: sites.find(s => s.id === participant.siteId),
      visits: visits.filter(v => v.participantId === id),
      queries: queries.filter(q => q.participantId === id),
      aes: aes.filter(a => a.participant === id)
    });
    setLoading(false);
  };

  if (loading || !data) return <div className="page-container p-8 text-center">Loading participant record...</div>;
  
  const { participant, study, site, visits, queries, aes } = data;

  return (
    <div className="page-container">
      <div className="back-nav mb-3">
        <button className="back-btn" onClick={() => navigate('/participants')}>
          <ArrowLeft size={16} /> Back to Participants
        </button>
      </div>

      <div className="card mb-6">
        <div className="card-header bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Subject: {participant.id}</h2>
              <p className="text-sm text-secondary">
                Study: <span className="font-semibold">{study?.id || participant.studyId}</span> • Site: <span className="font-semibold">{site?.name || participant.siteId}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-muted mb-1">Age / Gender</p>
              <p className="font-semibold">{participant.age} / {participant.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Status</p>
              <p className="font-semibold">{participant.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Screening</p>
              <p className="font-semibold">{participant.screeningStatus}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Enrollment Date</p>
              <p className="font-semibold">{participant.enrollmentDate || 'Pending'}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Visit Status</p>
              <p className="font-semibold">{participant.visitStatus || 'None'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lifecycle Timeline */}
      <div className="card mb-6">
        <div className="card-header bg-gray-50 dark:bg-slate-800 border-b border-subtle">
           <h3 className="card-title flex items-center gap-2"><Clock size={18}/> Enrollment Lifecycle</h3>
        </div>
        <div className="card-body p-6">
           <div className="flex items-center justify-between text-sm font-semibold text-secondary">
             <div className="flex flex-col items-center">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${participant.screeningStatus !== 'Pending' ? 'bg-success text-white' : 'bg-gray-300'}`}>✓</div>
               <span>Screened</span>
             </div>
             <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full ${participant.eligibility !== 'Pending' ? 'bg-success' : ''}`}></div></div>
             <div className="flex flex-col items-center">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${participant.eligibility !== 'Pending' ? (participant.eligibility.includes('Eligible') && !participant.eligibility.includes('Ineligible') ? 'bg-success text-white' : 'bg-danger text-white') : 'bg-gray-300'}`}>✓</div>
               <span>Eligible</span>
             </div>
             <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full ${participant.enrollmentStatus === 'Enrolled' ? 'bg-success' : ''}`}></div></div>
             <div className="flex flex-col items-center">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${participant.enrollmentStatus === 'Enrolled' ? 'bg-success text-white' : 'bg-gray-300'}`}>✓</div>
               <span>Enrolled</span>
             </div>
             <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full ${participant.status === 'Completed' || participant.status === 'Withdrawn' ? 'bg-success' : ''}`}></div></div>
             <div className="flex flex-col items-center">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${participant.status === 'Completed' ? 'bg-success text-white' : participant.status === 'Withdrawn' ? 'bg-warning text-white' : 'bg-gray-300'}`}>✓</div>
               <span>{participant.status === 'Withdrawn' ? 'Withdrawn' : 'Completed'}</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Consent Section */}
        <div className="card border-primary-200">
          <div className="card-header bg-primary-50 dark:bg-slate-800 border-b border-primary-200">
            <h3 className="card-title text-primary-800 dark:text-primary-300 flex items-center gap-2">
              <FileSignature size={18} /> Consent
            </h3>
          </div>
          <div className="card-body">
             <div className="mb-4">
               <p className="text-sm font-semibold">Main Informed Consent ({participant.consentStatus || 'Pending'})</p>
               <p className="text-xs text-muted">Method: eConsent (Tablet)</p>
               <p className="text-xs text-muted">Obtained: {participant.consentDate || '2026-08-15'}</p>
             </div>
             {canDo('editParticipant') && (
               <Button variant="outline" size="sm" className="w-full">Re-consent Subject</Button>
             )}
          </div>
        </div>

        {/* Visit Timeline Section */}
        <div className="card border-info-200">
          <div className="card-header bg-info-50 dark:bg-slate-800 border-b border-info-200">
            <h3 className="card-title text-info-800 dark:text-info-300 flex items-center gap-2">
              <Calendar size={18} /> Visit Timeline
            </h3>
          </div>
          <div className="card-body p-0 max-h-64 overflow-y-auto">
            {visits.length > 0 ? visits.map(v => (
              <div key={v.id} className="p-3 border-b border-subtle flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{v.type}</p>
                  <p className="text-xs text-muted">{v.scheduledDate}</p>
                </div>
                <span className={`badge ${v.status.includes('Completed') ? 'badge-success' : 'badge-default'}`}>{v.status}</span>
              </div>
            )) : <p className="p-4 text-sm text-center text-secondary">No visits scheduled</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Data Quality Section */}
        <div className="card border-warning-200">
          <div className="card-header bg-warning-50 dark:bg-slate-800 border-b border-warning-200">
            <h3 className="card-title text-warning-800 dark:text-warning-300 flex items-center gap-2">
              <FileWarning size={18} /> Data Queries
            </h3>
          </div>
          <div className="card-body p-0 max-h-64 overflow-y-auto">
            {queries.length > 0 ? queries.map(q => (
              <div key={q.id} className="p-3 border-b border-subtle flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{q.id}</span>
                  <span className={`badge ${q.status === 'Resolved' ? 'badge-success' : 'badge-danger'}`}>{q.status}</span>
                </div>
                <p className="text-xs truncate">{q.description}</p>
              </div>
            )) : <p className="p-4 text-sm text-center text-secondary">No active queries</p>}
          </div>
        </div>

        {/* Safety Section */}
        <div className="card border-danger-200">
          <div className="card-header bg-danger-50 dark:bg-slate-800 border-b border-danger-200">
            <h3 className="card-title text-danger-800 dark:text-danger-300 flex items-center gap-2">
              <ShieldAlert size={18} /> Safety (AE/SAE)
            </h3>
          </div>
          <div className="card-body p-0 max-h-64 overflow-y-auto">
             {aes.length > 0 ? aes.map(a => (
              <div key={a.id} className="p-3 border-b border-subtle flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm text-danger">{a.id}</span>
                  <span className={`badge ${a.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
                </div>
                <p className="text-xs truncate">{a.event}</p>
              </div>
            )) : <p className="p-4 text-sm text-center text-secondary">No safety events reported</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetail;
