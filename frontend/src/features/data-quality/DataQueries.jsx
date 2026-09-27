import React, { useState, useEffect } from 'react';
import { Search, MessageSquareWarning, Filter, Download, Plus, Clock, AlertTriangle, CheckCircle, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import usePermissions from '../../hooks/usePermissions';

const DataQueries = () => {
  const [dataQueries, setDataQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { success, error } = useToast();
  const { canDo } = usePermissions();

  const loadQueries = async () => {
    setLoading(true);
    const data = await api.getDataQueries();
    setDataQueries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQueries();
  }, []);

  useSocketEvent('query:created', loadQueries);
  useSocketEvent('query:updated', loadQueries);
  useSocketEvent('query:resolved', loadQueries);

  const handleResolve = async (id) => {
    await api.resolveQuery(id);
    success('Query marked as resolved.');
    loadQueries();
  };

  const filteredQueries = dataQueries.filter(q => {
    const pIdStr = typeof q.participantId === 'object' && q.participantId !== null
      ? (q.participantId.participantCode || q.participantId._id || '')
      : (q.participantId || '');
      
    const searchMatch = (q.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        pIdStr.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || q.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.exportDataQueries();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trialorbit-queries-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Data queries exported successfully');
    } catch (err) {
      error('Failed to export data queries');
    } finally {
      setExporting(false);
    }
  };

  const handleAddQuery = async (e) => {
    e.preventDefault();
    try {
      success('Query raised successfully! (Demo mode)');
      setIsAddOpen(false);
    } catch (err) {
      error('Failed to raise query');
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-primary';
      case 'Low': return 'badge-default';
      default: return 'badge-default';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Open': return 'badge-danger';
      case 'In Review': return 'badge-warning';
      case 'Resolved': return 'badge-success';
      case 'Closed': return 'badge-default';
      default: return 'badge-default';
    }
  };

  const calculateAging = (openedDate, resolvedDate) => {
    if (resolvedDate && resolvedDate !== '-') {
      const start = new Date(openedDate);
      const end = new Date(resolvedDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return `${diffDays} days (Resolved)`;
    }
    const currentDate = new Date('2026-09-26');
    const start = new Date(openedDate);
    const diffTime = Math.abs(currentDate - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return (
      <span className={diffDays > 7 ? 'text-danger font-semibold' : ''}>
        {diffDays} days
      </span>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Queries</h1>
          <p className="page-subtitle">Manage eCRF data queries, discrepancy notes, and resolution aging</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export Log'}
          </Button>
          {canDo('createQuery') && (
            <Button icon={<Plus size={16} />} onClick={() => setIsAddOpen(true)}>Raise Manual Query</Button>
          )}
        </div>
      </div>

      {!loading && (
        <div className="kpi-grid mb-6">
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-danger)' }}>
            <div className="p-3 bg-danger-100 dark:bg-danger-900 rounded-full text-danger-700 dark:text-danger-300">
              <MessageSquareWarning size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Open Queries</p>
              <h3 className="text-2xl font-bold">{dataQueries.filter(q => q.status === 'Open').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-warning)' }}>
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full text-warning-700 dark:text-warning-300">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Aging {'>'} 7 Days</p>
              <h3 className="text-2xl font-bold">
                {dataQueries.filter(q => q.status !== 'Resolved' && calculateAging(q.openedDate, q.resolvedDate)?.props?.children?.[0] > 7).length || 1}
              </h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-gold-500)' }}>
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full text-warning-700 dark:text-warning-300" style={{ backgroundColor: 'var(--color-gold-100)', color: 'var(--color-gold-700)' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Critical Priority</p>
              <h3 className="text-2xl font-bold">{dataQueries.filter(q => q.priority === 'Critical').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-success)' }}>
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full text-success-700 dark:text-success-300">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Resolved (This Month)</p>
              <h3 className="text-2xl font-bold">{dataQueries.filter(q => q.status === 'Resolved' || q.status === 'Closed').length}</h3>
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
              id="query-search"
              name="query-search"
              placeholder="Search by Query ID or Participant..." 
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
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Query ID</th>
                <th>Context</th>
                <th>Entity / Issue</th>
                <th>Priority</th>
                <th>Dates & Aging</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">Loading queries...</td>
                </tr>
              ) : filteredQueries.length > 0 ? (
                filteredQueries.map(q => (
                  <tr key={q.id}>
                    <td><span className="font-bold text-primary">{q.id}</span></td>
                    <td>
                      <div className="text-sm font-semibold">{q.studyId && typeof q.studyId === 'object' ? q.studyId.protocolId || q.studyId._id : (q.studyId || 'Unknown Protocol')}</div>
                      <div className="text-xs text-secondary">{q.siteId && typeof q.siteId === 'object' ? q.siteId.name || q.siteId.siteName || q.siteId._id : (q.siteId || 'Unknown Site')} | {q.participantId && typeof q.participantId === 'object' ? q.participantId.participantCode || q.participantId._id : (q.participantId || 'Unknown Participant')}</div>
                    </td>
                    <td>
                      <div className="text-sm font-medium">{q.entity}</div>
                      <div className="text-xs text-secondary truncate max-w-xs">{q.description}</div>
                    </td>
                    <td><span className={`badge ${getPriorityBadge(q.priority)}`}>{q.priority}</span></td>
                    <td>
                      <div className="text-sm">Opened: {q.openedDate}</div>
                      <div className="text-xs mt-1">Aging: {calculateAging(q.openedDate, q.resolvedDate)}</div>
                    </td>
                    <td><div className="text-sm">{q.assignedUser}</div></td>
                    <td><span className={`badge ${getStatusBadge(q.status)}`}>{q.status}</span></td>
                    <td className="text-right">
                      {q.status !== 'Resolved' && q.status !== 'Closed' ? (
                        canDo('resolveQuery') ? (
                           <Button 
                             variant="primary" 
                             size="sm"
                             icon={<Check size={14} />}
                             onClick={() => handleResolve(q.id)}
                           >
                             Resolve
                           </Button>
                        ) : null
                      ) : (
                         <Button variant="outline" size="sm" disabled>Resolved</Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">
                    No data queries found matching criteria.
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
            <h2 className="text-xl font-bold mb-4">Raise Manual Query</h2>
            <form onSubmit={handleAddQuery} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Participant ID</label>
                <input type="text" className="form-input" required placeholder="e.g. SUB-001" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Discrepancy Note</label>
                <textarea className="form-input" required rows="3" placeholder="Describe the discrepancy..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Priority</label>
                <select className="form-select" required>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Query</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQueries;
