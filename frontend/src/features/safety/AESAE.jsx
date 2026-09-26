import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, ShieldCheck, Download, Search } from 'lucide-react';
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
  const { success } = useToast();
  const { canDo } = usePermissions();

  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);

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

  const handleReviewEvent = (eventId) => {
    setEventsList(prev => prev.map(e => e.id === eventId ? { ...e, status: 'Resolved' } : e));
    success(`Event ${eventId} medical review completed and archived.`);
  };

  const handleExportCIOMS = () => {
    success('Safety line listings (CIOMS-I template) exported to PDF.');
  };

  const filtered = eventsList.filter(e => {
    const matchesSearch = e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.study.toLowerCase().includes(searchTerm.toLowerCase());
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
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExportCIOMS}>
            CIOMS Line Listing
          </Button>
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
                    <td>
                      {event.status === 'Resolved' ? (
                        <span className="text-xs text-muted">Archived</span>
                      ) : (
                        canDo('pvReview') ? (
                          <Button variant="outline" size="sm" onClick={() => handleReviewEvent(event.id)}>
                            Review
                          </Button>
                        ) : null
                      )}
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
