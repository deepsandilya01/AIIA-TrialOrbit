import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, Building2, Download, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';

const Sites = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success } = useToast();

  const [sitesList, setSitesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSites = () => {
    api.getSites().then(data => {
      setSitesList(data);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    loadSites();
  }, []);

  useSocketEvent('site:created', loadSites);
  useSocketEvent('site:updated', loadSites);
  useSocketEvent('site:status_changed', loadSites);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    location: '',
    pi: '',
    target: 100
  });

  const handleCreateSite = (e) => {
    e.preventDefault();
    if (!newSite.name.trim() || !newSite.pi.trim()) return;

    const created = {
      id: `S-0${sitesList.length + 1}`,
      name: newSite.name,
      location: newSite.location || 'India',
      pi: newSite.pi,
      status: 'Active',
      enrolled: 0,
      target: parseInt(newSite.target, 10) || 100,
      complianceRate: 100
    };
    setSitesList([...sitesList, created]);
    success(`Site ${created.name} registered and initiated for trial participation.`);
    setIsAddOpen(false);
    setNewSite({ name: '', location: '', pi: '', target: 100 });
  };

  const filtered = sitesList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Participating Clinical Trial Sites</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Governance, activation readiness, and recruitment progress across multi-centre research sites</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => success('Exported site network directory.')}>
            Export Directory
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => setIsAddOpen(true)}>
            Add Research Site
          </Button>
        </div>
      </div>

      <div className="card">
        <div className="table-controls p-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-bar" style={{ maxWidth: '400px', width: '100%' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search sites by Name, City/State, PI, or Code..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Site Code</th>
                <th>Institutional Facility Name</th>
                <th>Location</th>
                <th>Principal Investigator</th>
                <th>Enrollment vs Target</th>
                <th>GCP Compliance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: 0 }}><SkeletonTable rows={4} cols={7} /></td></tr>
              ) : filtered.map(site => (
                <tr key={site.id} className="clickable-row" onClick={() => navigate(`/sites/${site.id}`)}>
                  <td className="font-semibold text-primary">{site.id}</td>
                  <td className="font-medium">{site.name}</td>
                  <td>
                    <div className="flex items-center gap-1 text-muted text-xs">
                      <MapPin size={13} /> {site.location}
                    </div>
                  </td>
                  <td>{site.pi}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{site.enrolledCount || 0}</span>
                      <span className="text-muted text-xs">/ {site.targetEnrollment || site.target || 100}</span>
                      <div style={{ width: '60px', height: '5px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, Math.round(((site.enrolledCount || 0) / (site.targetEnrollment || site.target || 100)) * 100))}%`, height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-success">{site.complianceRate || 94}%</span>
                  </td>
                  <td>
                    <StatusBadge status={site.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Site Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Onboard New Clinical Research Site"
        subtitle="Register institutional healthcare facility, investigator team, and target cohort"
      >
        <form onSubmit={handleCreateSite} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Facility / Hospital Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Regional Ayurveda Research Institute"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div>
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                City / State
              </label>
              <input
                type="text"
                placeholder="e.g., Lucknow, Uttar Pradesh"
                value={newSite.location}
                onChange={(e) => setNewSite({ ...newSite, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                Assigned Target Subjects
              </label>
              <input
                type="number"
                min="10"
                value={newSite.target}
                onChange={(e) => setNewSite({ ...newSite, target: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Site Principal Investigator <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Dr. Full Name"
              value={newSite.pi}
              onChange={(e) => setNewSite({ ...newSite, pi: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Building2 size={16} />}>
              Register Site
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sites;
