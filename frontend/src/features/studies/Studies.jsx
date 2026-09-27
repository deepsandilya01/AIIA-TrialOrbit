import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, FlaskConical, Download } from 'lucide-react';
import api from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import CreateStudy from './CreateStudy';
import { useToast } from '../../context/ToastContext';
import usePermissions from '../../hooks/usePermissions';
import './Studies.css';

const Studies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success } = useToast();
  const { canDo } = usePermissions();

  const [studiesList, setStudiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadStudies = async () => {
    setLoading(true);
    try {
      const data = await api.getStudies();
      setStudiesList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, []);

  useSocketEvent('study:created', loadStudies);
  useSocketEvent('study:updated', loadStudies);
  useSocketEvent('study:lifecycle_changed', loadStudies);

  const handleStudyCreated = async (newStudy) => {
    const created = await api.createStudy(newStudy);
    setStudiesList(prev => [created, ...prev]);
  };

  const handleExportList = () => {
    if (studiesList.length === 0) { success('No studies to export.'); return; }
    const headers = ['Study ID', 'Title', 'Phase', 'PI', 'Status', 'Target Participants', 'Enrolled', 'Progress %', 'Start Date'];
    const rows = studiesList.map(s => [
      s.id || '', s.title || '', s.phase || '', s.pi || '',
      s.status || '', s.targetParticipants || '', s.participants || '',
      s.progress || 0, s.startDate || ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trialorbit-studies-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    success(`Exported ${studiesList.length} studies to CSV.`);
  };

  const filteredStudies = studiesList.filter(s => {
    const matchesSearch = (s.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ((s.pi || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || (s.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container studies-page">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="page-title">Clinical Study Portfolio</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Centralized oversight of all institutional Ayurvedic and integrative clinical research protocols</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExportList}>
            Export Roster
          </Button>
          {canDo('createStudy') && (
            <Button onClick={() => setIsCreateModalOpen(true)} icon={<Plus size={16} />}>
              Initialize Study
            </Button>
          )}
        </div>
      </div>

      <div className="card studies-content">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search studies by ID, Title, or Principal Investigator..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select 
              className="status-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Study Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="planned">Planned</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : filteredStudies.length === 0 ? (
          <EmptyState
            icon={<FlaskConical size={38} className="text-muted" />}
            title="Your study portfolio is empty"
            description={searchTerm ? "No studies match your current search query." : "No clinical trials have been initialized yet."}
            actionLabel={canDo('createStudy') ? "Initialize First Study" : undefined}
            onAction={canDo('createStudy') ? () => setIsCreateModalOpen(true) : undefined}
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Study ID</th>
                  <th>Protocol Title</th>
                  <th>Phase / Type</th>
                  <th>Principal Investigator</th>
                  <th>Sites</th>
                  <th>Cohort Progress</th>
                  <th>Data Quality</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudies.map(study => (
                  <tr key={study.id} className="clickable-row" onClick={() => navigate(`/studies/${study.id}`)}>
                    <td className="font-semibold text-primary">{study.id}</td>
                    <td>
                      <div className="font-medium max-w-xs truncate" title={study.title}>{study.title}</div>
                      <div className="text-xs text-muted">{study.ctriNumber || 'CTRI In Progress'}</div>
                    </td>
                    <td>
                      <span className="badge badge-default">{study.phase || study.type?.split(',')[0]}</span>
                    </td>
                    <td>{study.pi}</td>
                    <td>{study.sites}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="mini-progress" style={{ width: '80px', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${study.progress}%`, 
                              height: '100%', 
                              backgroundColor: study.progress > 70 ? 'var(--success)' : 'var(--primary-color)' 
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{study.participants}/{study.targetParticipants}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold text-success">{study.dataQualityScore || 96}%</span>
                    </td>
                    <td>
                      <StatusBadge status={study.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canDo('createStudy') && (
        <CreateStudy
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onStudyCreated={handleStudyCreated}
        />
      )}
    </div>
  );
};

export default Studies;
