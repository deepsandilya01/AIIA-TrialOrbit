import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, UserPlus, Eye, Users } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [studies, setStudies] = useState([]);
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pts, stds, sts] = await Promise.all([
      api.getParticipants(),
      api.getStudies(),
      api.getSites()
    ]);
    setParticipants(pts);
    setStudies(stds);
    setSites(sts);
    setLoading(false);
  };
  
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
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
          <Button variant="outline" icon={<Download size={16} />}>Export Line Listing</Button>
          <Button icon={<UserPlus size={16} />}>Register Participant</Button>
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
                        <div className="text-sm font-semibold">{p.studyId}</div>
                        <div className="text-xs text-secondary">{p.siteId}</div>
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
                        <div className={`text-sm ${p.visitStatus.includes('Overdue') ? 'text-danger font-semibold' : ''}`}>
                          {p.visitStatus}
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
    </div>
  );
};

export default Participants;
