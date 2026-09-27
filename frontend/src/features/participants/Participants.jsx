import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, UserPlus, Eye, Users } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import usePermissions from '../../hooks/usePermissions';
import { useToast } from '../../context/ToastContext';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [studies, setStudies] = useState([]);
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { canDo } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pts, stds, sts] = await Promise.all([
        api.getParticipants(),
        api.getStudies(),
        api.getSites()
      ]);
      setParticipants(Array.isArray(pts) ? pts : (pts?.participants || []));
      setStudies(Array.isArray(stds) ? stds : []);
      setSites(Array.isArray(sts) ? sts : []);
    } catch (err) {
      console.error('Failed to load participants data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p => {
    const code = (p.participantCode || p.id || '').toLowerCase();
    const matchesSearch = code.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.exportParticipants();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trialorbit-participants-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Participants exported successfully');
    } catch (err) {
      error('Failed to export participants');
    } finally {
      setExporting(false);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    try {
      // Stub for actual creation API, which requires form data handling
      success('Participant registered successfully! (Demo mode)');
      setIsAddOpen(false);
    } catch (err) {
      error('Failed to register participant');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Screening': return 'badge-primary';
      case 'Withdrawn': return 'badge-danger';
      case 'Screen Failure': return 'badge-warning';
      case 'Lost to Follow-up': return 'badge-default';
      default: return 'badge-default';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Participants Registry</h1>
          <p className="page-subtitle">Track participant screening, enrollment, and lifecycle status</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export Line Listing'}
          </Button>
          {canDo('createParticipant') && (
            <Button icon={<UserPlus size={16} />} onClick={() => setIsAddOpen(true)}>Register Participant</Button>
          )}
        </div>
      </div>

      <div className="card mb-6">
        <div className="p-4 border-b border-subtle flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary-700 dark:text-primary-300">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Total Registry</p>
              <h3 className="text-xl font-bold">{participants.length} Subjects</h3>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="search-bar w-full md:w-64">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Search participant code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select w-full md:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Screening">Screening</option>
              <option value="Screen Failure">Screen Failure</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Lost to Follow-up">Lost to Follow-up</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Study / Site</th>
                <th>Demographics</th>
                <th>Status / Dates</th>
                <th>Eligibility & Consent</th>
                <th>Visit Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-secondary">Loading participants...</td>
                </tr>
              ) : filteredParticipants.length > 0 ? (
                filteredParticipants.map(p => {
                  const studyInfo = studies.find(s => s.id === p.studyId);
                  const siteInfo = sites.find(s => s.id === p.siteId);

                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="font-bold text-primary">{p.id}</span>
                      </td>
                      <td>
                        <div className="text-sm font-semibold">{typeof p.studyId === 'object' ? p.studyId.protocolId || p.studyId._id : p.studyId}</div>
                        <div className="text-xs text-secondary">{typeof p.siteId === 'object' ? p.siteId.name || p.siteId.siteName || p.siteId._id : p.siteId}</div>
                      </td>
                      <td>
                        <div className="text-sm">{p.gender}, {p.age}y</div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(p.status)} mb-1`}>{p.status}</span>
                        <div className="text-xs text-secondary">Enrolled: {p.enrollmentDate}</div>
                      </td>
                      <td>
                        <div className="text-sm font-medium">{p.eligibility}</div>
                        <div className="text-xs text-secondary">{p.consentStatus}</div>
                      </td>
                      <td>
                        <div className={`text-sm ${(p.visitStatus || '').includes('Overdue') ? 'text-danger font-semibold' : ''}`}>
                          {p.visitStatus || '—'}
                        </div>
                      </td>
                      <td className="text-right">
                        <Button variant="outline" size="sm" icon={<Eye size={14} />} onClick={() => navigate(`/participants/${p.id}`)}>View</Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-secondary">
                    No participants found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isAddOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card" style={{ maxWidth: '500px', padding: '1.5rem' }}>
            <h2 className="text-xl font-bold mb-4">Register Participant</h2>
            <form onSubmit={handleAddParticipant} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Participant Initials</label>
                <input type="text" className="form-input" required placeholder="e.g. JD" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Study</label>
                <select className="form-select" required>
                  <option value="">Select Study</option>
                  {studies.map(s => <option key={s.id} value={s.id}>{s.protocolId}</option>)}
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Register</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants;
