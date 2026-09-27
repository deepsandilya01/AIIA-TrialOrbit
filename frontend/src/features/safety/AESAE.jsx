import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Plus, ShieldCheck, Download, Search, Activity } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import ReportSAE from './ReportSAE';
import { useToast } from '../../context/ToastContext';
import usePermissions from '../../hooks/usePermissions';

const AESAE = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const { canDo } = usePermissions();

  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/pharmacovigilance')) {
      setFilterType('sae');
    } else {
      setFilterType('all');
    }
  }, [location.pathname]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getSafetyEvents();
      setEventsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSAEReported = async (payload) => {
    const created = await api.reportSAE(payload);
    setEventsList(prev => [created, ...prev]);
  };

  const handleReviewEvent = async (eventId) => {
    try {
      await api.updateSAEStatus(eventId, 'Resolved');
      loadEvents();
      success(`Event ${eventId} medical review completed and archived.`);
    } catch (e) {
      error('Failed to review event');
    }
  };

  const [exportingId, setExportingId] = useState(null);
  const handleExportCIOMS = async (eventId) => {
    try {
      setExportingId(eventId);
      const response = await api.exportSafetyReport(eventId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trialorbit-safety-event-${eventId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('TrialOrbit MVP Safety Event Report exported successfully');
    } catch (err) {
      error('Failed to export safety report');
    } finally {
      setExportingId(null);
    }
  };

  const filtered = eventsList.filter(e => {
    const pStr = typeof e.participant === 'object' && e.participant !== null 
      ? (e.participant.participantCode || e.participant._id || '') 
      : (e.participant || '');
    const sStr = typeof e.study === 'object' && e.study !== null 
      ? (e.study.protocolId || e.study._id || '') 
      : (e.study || '');
      
    const matchesSearch = (e.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.event || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sStr.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'ae') return matchesSearch && e.serious === 'No';
    if (filterType === 'sae') return matchesSearch && e.serious === 'Yes';
    return matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Safety & Pharmacovigilance</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Real-time Adverse Event (AE) and Serious Adverse Event (SAE) surveillance under CDSCO & GCP guidelines</p>
        </div>
        <div className="flex flex-wrap gap-2">

          {canDo('reportSAE') && (
            <Button variant="danger" icon={<AlertTriangle size={16} />} onClick={() => setIsReportOpen(true)}>
              Expedited SAE Report (24h)
            </Button>
          )}
        </div>
      </div>

      <div className="study-tabs mb-4" role="tablist">
        <button
          className={`tab ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Safety Events ({eventsList.length})
        </button>
        <button
          className={`tab ${filterType === 'sae' ? 'active' : ''}`}
          onClick={() => setFilterType('sae')}
        >
          Serious Adverse Events (SAE) ({eventsList.filter(e => e.serious === 'Yes').length})
        </button>
        <button
          className={`tab ${filterType === 'ae' ? 'active' : ''}`}
          onClick={() => setFilterType('ae')}
        >
          Adverse Events (AE) ({eventsList.filter(e => e.serious === 'No').length})
        </button>
      </div>

      <div className="card">
        <div className="table-controls p-3" style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search by Event, Subject, Study, or Case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="text-xs text-muted flex items-center gap-2">
            <ShieldCheck size={14} className="text-success" />
            <span>MedDRA Encoded Pharmacovigilance Feed</span>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={4} cols={8} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck size={38} className="text-success" />}
            title="No adverse events recorded"
            description="All monitored clinical participants are currently free of recorded safety signals."
            actionLabel={canDo('reportSAE') ? "File Safety Report" : undefined}
            onAction={canDo('reportSAE') ? () => setIsReportOpen(true) : undefined}
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Study</th>
                  <th>Subject</th>
                  <th>Clinical Diagnosis / Event</th>
                  <th>Severity</th>
                  <th>Seriousness</th>
                  <th>Causality</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id}>
                    <td className="font-semibold">{event.id}</td>
                    <td className="text-primary font-medium">{event.study}</td>
                    <td>{event.participant}</td>
                    <td className="font-medium">{event.event}</td>
                    <td>{event.severity}</td>
                    <td>
                      <Badge variant={event.serious === 'Yes' ? 'danger' : 'default'}>{event.serious}</Badge>
                    </td>
                    <td>
                      <span className="text-xs text-secondary">{event.causality || 'Pending Review'}</span>
                    </td>
                    <td className="text-muted text-xs">{event.date}</td>
                    <td>
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="flex gap-2">
                      {event.status === 'Resolved' ? (
                        <span className="text-xs text-muted">Archived</span>
                      ) : (
                        canDo('pvReview') ? (
                          <Button variant="outline" size="sm" onClick={() => handleReviewEvent(event.id)}>
                            Review
                          </Button>
                        ) : null
                      )}
                      <Button variant="ghost" size="sm" icon={exportingId === event.id ? <Activity size={14} className="spin" /> : <Download size={14} />} onClick={() => handleExportCIOMS(event._id || event.id)} disabled={exportingId === event.id} title="Export CIOMS MVP Report">
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canDo('reportSAE') && (
        <ReportSAE
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onSAEReported={handleSAEReported}
        />
      )}
    </div>
  );
};

export default AESAE;
