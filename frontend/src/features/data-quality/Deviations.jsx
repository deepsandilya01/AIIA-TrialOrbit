import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Download, Plus, CheckCircle, ShieldAlert, Check } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import usePermissions from '../../hooks/usePermissions';

const Deviations = () => {
  const [protocolDeviations, setDeviations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();
  const { canDo } = usePermissions();

  useEffect(() => {
    loadDeviations();
  }, []);

  const loadDeviations = async () => {
    setLoading(true);
    const data = await api.getProtocolDeviations();
    setDeviations(data);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await api.updateDeviationStatus(id, 'Resolved');
    success('Deviation resolved and CAPA closed successfully.');
    loadDeviations();
  };

  const filteredDeviations = protocolDeviations.filter(d => {
    const pStr = typeof d.participant === 'object' && d.participant !== null 
      ? (d.participant.participantCode || d.participant._id || '') 
      : (d.participant || '');
    const searchMatch = (d.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        pStr.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || d.status.includes(statusFilter) || (statusFilter === 'Open' && !d.status.includes('Resolved') && !d.status.includes('Approved'));
    return searchMatch && statusMatch;
  });

  const getClassificationBadge = (classification) => {
    switch(classification) {
      case 'Major': return 'badge-danger';
      case 'Moderate': return 'badge-warning';
      case 'Minor': return 'badge-primary';
      default: return 'badge-default';
    }
  };

  const getStatusBadge = (status) => {
    if (status.includes('Resolved') || status.includes('Approved')) return 'badge-success';
    if (status.includes('Action Taken')) return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Protocol Deviations</h1>
          <p className="page-subtitle">Track protocol deviations, non-compliances, and corrective actions (CAPA)</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Download size={16} />}>Export Log</Button>
          {canDo('createDeviation') && (
            <Button icon={<Plus size={16} />}>Log Deviation</Button>
          )}
        </div>
      </div>

      {!loading && (
        <div className="kpi-grid mb-6">
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-danger)' }}>
            <div className="p-3 bg-danger-100 dark:bg-danger-900 rounded-full text-danger-700 dark:text-danger-300">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Major Deviations</p>
              <h3 className="text-2xl font-bold">{protocolDeviations.filter(d => d.classification === 'Major').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-warning)' }}>
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full text-warning-700 dark:text-warning-300">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Moderate Deviations</p>
              <h3 className="text-2xl font-bold">{protocolDeviations.filter(d => d.classification === 'Moderate').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-700 dark:text-primary-300">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Minor Deviations</p>
              <h3 className="text-2xl font-bold">{protocolDeviations.filter(d => d.classification === 'Minor').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-success)' }}>
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full text-success-700 dark:text-success-300">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">CAPA Closed</p>
              <h3 className="text-2xl font-bold">{protocolDeviations.filter(d => d.status.includes('Resolved') || d.status.includes('Approved')).length}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="card mb-6">
        <div className="p-4 border-b border-subtle flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-slate-800">
          <div className="search-bar w-full md:w-80">
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by Deviation ID or Participant..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              className="form-select w-full md:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open / Pending</option>
              <option value="Resolved">Resolved / Approved</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Deviation ID</th>
                <th>Study / Site / Subject</th>
                <th>Classification</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">Loading deviations...</td>
                </tr>
              ) : filteredDeviations.length > 0 ? (
                filteredDeviations.map(d => (
                  <tr key={d.id}>
                    <td><span className="font-bold text-primary">{d.id}</span></td>
                    <td>
                      <div className="text-sm font-semibold">{d.study}</div>
                      <div className="text-xs text-secondary">{d.site} | {d.participant}</div>
                    </td>
                    <td><span className={`badge ${getClassificationBadge(d.classification)}`}>{d.classification}</span></td>
                    <td><span className="font-medium text-sm">{d.deviationType}</span></td>
                    <td><div className="text-sm truncate max-w-xs" title={d.description}>{d.description}</div></td>
                    <td><div className="text-sm">{d.date}</div></td>
                    <td><span className={`badge ${getStatusBadge(d.status)}`}>{d.status}</span></td>
                    <td className="text-right">
                      {!d.status.includes('Resolved') && !d.status.includes('Approved') ? (
                        canDo('updateDeviation') ? (
                          <Button 
                            variant="primary" 
                            size="sm"
                            icon={<Check size={14} />}
                            onClick={() => handleApprove(d.id)}
                          >
                            Approve
                          </Button>
                        ) : null
                      ) : (
                        <Button variant="outline" size="sm" disabled>Approved</Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">
                    No protocol deviations found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deviations;
