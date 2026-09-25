import React, { useState, useEffect } from 'react';
import { Search, CalendarCheck, Clock, CheckCircle, AlertCircle, Download, Check } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    setLoading(true);
    const data = await api.getVisits();
    setVisits(data);
    setLoading(false);
  };

  const handleMarkComplete = async (id) => {
    await api.markVisitCompleted(id);
    success('Visit marked as completed successfully.');
    loadVisits();
  };

  const filteredVisits = visits.filter(v => {
    const searchMatch = 
      v.participantId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || v.status.includes(statusFilter);
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status) => {
    if (status.includes('Completed')) return 'badge-success';
    if (status === 'Overdue') return 'badge-danger';
    if (status === 'Due') return 'badge-warning';
    return 'badge-primary';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visit Management</h1>
          <p className="page-subtitle">Track upcoming, due, and completed participant visits across all sites</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Download size={16} />}>Export Schedule</Button>
          <Button icon={<CalendarCheck size={16} />}>Schedule Visit</Button>
        </div>
      </div>

      {!loading && (
        <div className="kpi-grid mb-6">
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-700 dark:text-primary-300">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Total Scheduled</p>
              <h3 className="text-2xl font-bold">{visits.length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-success)' }}>
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full text-success-700 dark:text-success-300">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Completed</p>
              <h3 className="text-2xl font-bold">{visits.filter(v => v.status.includes('Completed')).length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-warning)' }}>
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full text-warning-700 dark:text-warning-300">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Due Soon (7 days)</p>
              <h3 className="text-2xl font-bold">{visits.filter(v => v.status === 'Due' || v.status === 'Upcoming').length}</h3>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-danger)' }}>
            <div className="p-3 bg-danger-100 dark:bg-danger-900 rounded-full text-danger-700 dark:text-danger-300">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Overdue</p>
              <h3 className="text-2xl font-bold">{visits.filter(v => v.status === 'Overdue').length}</h3>
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
              placeholder="Search by participant or visit ID..." 
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
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Due">Due</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Visit ID</th>
                <th>Participant</th>
                <th>Study / Site</th>
                <th>Visit Type</th>
                <th>Scheduled Date</th>
                <th>Completed Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-secondary">Loading visits...</td>
                </tr>
              ) : filteredVisits.length > 0 ? (
                filteredVisits.map(v => (
                  <tr key={v.id}>
                    <td><span className="font-medium text-secondary">{v.id}</span></td>
                    <td><span className="font-bold text-primary">{v.participantId}</span></td>
                    <td>
                      <div className="text-sm font-semibold">{v.studyId}</div>
                      <div className="text-xs text-secondary">{v.siteId}</div>
                    </td>
                    <td>{v.type}</td>
                    <td>{v.scheduledDate}</td>
                    <td>{v.completedDate || '-'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(v.status)}`}>{v.status}</span>
                    </td>
                    <td className="text-right">
                      {!v.status.includes('Completed') ? (
                         <Button 
                           variant="primary" 
                           size="sm" 
                           icon={<Check size={14} />}
                           onClick={() => handleMarkComplete(v.id)}
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
                    No visits found matching your criteria.
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

export default Visits;
