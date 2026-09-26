import React, { useState, useEffect } from 'react';
import { Search, MessageSquareWarning, Filter, Download, Plus, Clock, AlertTriangle, CheckCircle, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const DataQueries = () => {
  const [dataQueries, setDataQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    loadQueries();
  }, []);

  useSocketEvent('query:created', loadQueries);
  useSocketEvent('query:updated', loadQueries);
  useSocketEvent('query:resolved', loadQueries);

  const loadQueries = async () => {
    setLoading(true);
    const data = await api.getDataQueries();
    setDataQueries(data);
    setLoading(false);
  };

  const handleResolve = async (id) => {
    await api.resolveQuery(id);
    success('Query marked as resolved.');
    loadQueries();
  };

  const filteredQueries = dataQueries.filter(q => {
    const searchMatch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        q.participantId.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || q.status === statusFilter;
    return searchMatch && statusMatch;
  });

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
          <Button variant="outline" icon={<Download size={16} />}>Export Log</Button>
          <Button icon={<Plus size={16} />}>Raise Manual Query</Button>
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
                      <div className="text-sm font-semibold">{q.studyId}</div>
                      <div className="text-xs text-secondary">{q.siteId} | {q.participantId}</div>
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
                         <Button 
                           variant="primary" 
                           size="sm"
                           icon={<Check size={14} />}
                           onClick={() => handleResolve(q.id)}
                         >
                           Resolve
                         </Button>
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
    </div>
  );
};

export default DataQueries;
