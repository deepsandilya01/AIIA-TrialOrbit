import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Users, Activity, ShieldCheck, Calendar, Download, Phone, Mail } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { SkeletonForm } from '../../components/common/LoadingSkeleton';

const SiteDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  
  const [site, setSite] = useState(null);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSiteById(id),
      api.getStudies()
    ]).then(([s, st]) => {
      setSite(s);
      setStudies(st);
      setSite(s);
      setLoading(false);
    }).catch(console.error);
  }, [id]);

  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.exportSiteDossier(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trialorbit-site-${id}-dossier.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Site dossier exported successfully');
    } catch (err) {
      error('Failed to export site dossier');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="page-container"><SkeletonForm rows={5} /></div>;
  if (!site) return <div className="page-container">Site not found.</div>;

  return (
    <div className="page-container">
      <div className="back-nav mb-3">
        <button className="back-btn" onClick={() => navigate('/sites')}>
          <ArrowLeft size={16} /> Back to Sites
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">Site ID: {site.id}</Badge>
                <DemoBadge />
              </div>
              <h1 className="page-title">{site.name}</h1>
              <div className="flex items-center gap-2 text-muted mt-1 text-sm">
                <MapPin size={15} /> {site.location} • Activated: {site.activationDate || '2025-01-10'}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={site.status} pulse />
              <Button variant="outline" size="sm" icon={exporting ? <Activity size={14} className="spin" /> : <Download size={14} />} onClick={handleExport} disabled={exporting}>
                {exporting ? 'Exporting...' : 'Export Audit Dossier'}
              </Button>
            </div>
          </div>
          
          <div className="kpi-grid" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <div className="p-3 border rounded bg-secondary">
              <div className="text-muted text-xs mb-1 font-semibold uppercase">Principal Investigator</div>
              <div className="font-semibold text-primary">{site.pi}</div>
              <div className="text-xs text-muted mt-1">Lead Medical Oversight</div>
            </div>
            <div className="p-3 border rounded bg-secondary">
              <div className="text-muted text-xs mb-1 font-semibold uppercase flex items-center gap-1">
                <Users size={13} /> Cohort Enrollment
              </div>
              <div className="font-semibold text-primary">{site.enrolled} / {site.target} Subjects</div>
              <div className="text-xs text-success mt-1">{Math.round((site.enrolled / site.target) * 100)}% of Allocation</div>
            </div>
            <div className="p-3 border rounded bg-secondary">
              <div className="text-muted text-xs mb-1 font-semibold uppercase flex items-center gap-1">
                <ShieldCheck size={13} /> GCP Inspection Index
              </div>
              <div className="font-semibold text-success">{site.complianceRate || 94}% Compliance</div>
              <div className="text-xs text-muted mt-1">Last audit: 12 days ago</div>
            </div>
            <div className="p-3 border rounded bg-secondary">
              <div className="text-muted text-xs mb-1 font-semibold uppercase flex items-center gap-1">
                <Activity size={13} /> Monitoring Status
              </div>
              <div className="font-semibold text-primary">Interim SDV Cleared</div>
              <div className="text-xs text-muted mt-1">Next CRA Visit: 15 Oct 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><Building2 size={18} /> Active Protocol Allocations at this Facility</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Protocol ID</th>
                <th>Title</th>
                <th>Phase</th>
                <th>Site Enrollment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studies.slice(0, 2).map(study => (
                <tr key={study.id} className="clickable-row" onClick={() => navigate(`/studies/${study.id}`)}>
                  <td className="font-semibold text-primary">{study.id}</td>
                  <td className="font-medium">{study.title}</td>
                  <td><span className="badge badge-default">{study.phase || 'Phase II'}</span></td>
                  <td>{Math.round(site.enrolled * 0.6)} / {Math.round(site.target * 0.6)}</td>
                  <td><StatusBadge status={study.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;
