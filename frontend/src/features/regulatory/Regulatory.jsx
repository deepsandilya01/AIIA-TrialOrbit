import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, Plus, Download, Edit, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import usePermissions from '../../hooks/usePermissions';

const Regulatory = () => {
  const [milestones, setMilestones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { success, error } = useToast();
  const { canDo } = usePermissions();
  const location = useLocation();

  useEffect(() => {
    // Determine filter based on URL route
    if (location.pathname.includes('/ethics')) {
      setTypeFilter('IEC Approval');
    } else if (location.pathname.includes('/ctri')) {
      setTypeFilter('CTRI Registration');
    } else {
      setTypeFilter('All');
    }
  }, [location.pathname]);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setLoading(true);
    const data = await api.getMilestones();
    setMilestones(data);
    setLoading(false);
  };

  const handleMarkComplete = async (id) => {
    await api.completeMilestone(id);
    success('Regulatory milestone marked as completed successfully.');
    loadMilestones();
  };

  const filteredMilestones = milestones.filter(m => {
    const sStr = typeof m.study === 'object' && m.study !== null 
      ? (m.study.protocolId || m.study._id || '') 
      : (m.study || '');
    const matchSearch = (m.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        sStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchType = typeFilter === 'All' || m.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.exportMilestones();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trialorbit-milestones-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Regulatory milestones exported successfully');
    } catch (err) {
      error('Failed to export milestones');
    } finally {
      setExporting(false);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      success('Regulatory milestone created successfully! (Demo mode)');
      setIsAddOpen(false);
    } catch (err) {
      error('Failed to create milestone');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return 'badge-success';
      case 'Due': return 'badge-warning';
      case 'Overdue': return 'badge-danger pulse';
      case 'Upcoming': return 'badge-default';
      default: return 'badge-default';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Regulatory & Ethics Milestones</h1>
          <p className="page-subtitle">Track IEC approvals, CTRI registrations, and critical governance timelines</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export Timeline'}
          </Button>
          {canDo('createMilestone') && (
            <Button icon={<Plus size={16} />} onClick={() => setIsAddOpen(true)}>New Milestone</Button>
          )}
        </div>
      </div>

      {!loading && (
        <div className="kpi-grid mb-6">
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-danger)' }}>
            <div className="p-3 bg-danger-100 dark:bg-danger-900 rounded-full text-danger-700 dark:text-danger-300">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Overdue Approvals</p>
              <h3 className="text-2xl font-bold">{milestones.filter(m => m.status === 'Overdue').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-warning)' }}>
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full text-warning-700 dark:text-warning-300">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Due Next 30 Days</p>
              <h3 className="text-2xl font-bold">{milestones.filter(m => m.status === 'Due').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-success)' }}>
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full text-success-700 dark:text-success-300">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Completed (YTD)</p>
              <h3 className="text-2xl font-bold">{milestones.filter(m => m.status === 'Completed').length}</h3>
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
              placeholder="Search by ID or Study..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <select 
              className="form-select w-full md:w-48"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="IEC Approval">IEC Approval</option>
              <option value="CTRI Registration">CTRI Registration</option>
              <option value="CTRI Update">CTRI Update</option>
              <option value="Other Regulatory">Other Regulatory</option>
            </select>
            <select 
              className="form-select w-full md:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Due">Due</option>
              <option value="Overdue">Overdue</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Milestone ID</th>
                <th>Study / Protocol</th>
                <th>Type</th>
                <th>Reference No.</th>
                <th>Due Date</th>
                <th>Responsible Role</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">Loading milestones...</td>
                </tr>
              ) : filteredMilestones.length > 0 ? (
                filteredMilestones.map(m => (
                  <tr key={m.id} className={m.status === 'Overdue' ? 'bg-danger-100 dark:bg-danger-900' : ''}>
                    <td><span className="font-bold text-primary">{m.id}</span></td>
                    <td className="font-semibold">{m.study}</td>
                    <td>{m.type}</td>
                    <td><code className="text-sm bg-gray-100 dark:bg-slate-700 px-1 rounded">{m.refNo || 'Pending'}</code></td>
                    <td className={m.status === 'Overdue' ? 'text-danger font-bold' : ''}>{m.dueDate}</td>
                    <td className="text-sm text-secondary">{m.role}</td>
                    <td><span className={`badge ${getStatusBadge(m.status)}`}>{m.status}</span></td>
                    <td className="text-right">
                      {m.status !== 'Completed' ? (
                        canDo('updateMilestone') ? (
                          <Button 
                            variant="primary" 
                            size="sm"
                            icon={<Check size={14} />}
                            onClick={() => handleMarkComplete(m.id)}
                          >
                            Complete
                          </Button>
                        ) : null
                      ) : (
                        <Button variant="outline" size="sm" disabled>Completed</Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">
                    No regulatory milestones found matching criteria.
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
            <h2 className="text-xl font-bold mb-4">New Regulatory Milestone</h2>
            <form onSubmit={handleAddMilestone} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Study ID</label>
                <input type="text" className="form-input" required placeholder="e.g. STU-101" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select className="form-select" required>
                  <option value="IEC Approval">IEC Approval</option>
                  <option value="CTRI Registration">CTRI Registration</option>
                  <option value="DCGI Submission">DCGI Submission</option>
                  <option value="Site Initiation">Site Initiation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Due Date</label>
                <input type="date" className="form-input" required />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Create Milestone</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Regulatory;
