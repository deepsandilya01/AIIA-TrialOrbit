import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, Plus, Download, Edit, Check } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const Regulatory = () => {
  const [milestones, setMilestones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

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
    const matchSearch = m.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        m.study.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchType = typeFilter === 'All' || m.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

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
          <Button variant="outline" icon={<Download size={16} />}>Export Timeline</Button>
          <Button icon={<Plus size={16} />}>New Milestone</Button>
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
                        <Button 
                          variant="primary" 
                          size="sm"
                          icon={<Check size={14} />}
                          onClick={() => handleMarkComplete(m.id)}
                        >
                          Complete
                        </Button>
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
    </div>
  );
};

export default Regulatory;
