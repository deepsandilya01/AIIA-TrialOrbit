import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Download, Search, History, Shield, Filter } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';

const AuditTrail = () => {
  const { t } = useTranslation();
  const { success } = useToast();

  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'danger';
      case 'UPLOAD': return 'gold';
      default: return 'default';
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Role,Action,Entity,Old Value,New Value,IP Address\n" +
      logsList.map(l => `"${l.time}","${l.user}","${l.role || 'Investigator'}","${l.action}","${l.entity}","${l.oldVal}","${l.newVal}","${l.ip || '10.24.1.42'}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aiia_trialorbit_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Audit trail log successfully exported for institutional records.');
  };

  const filtered = logsList.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.newVal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="page-title">{t('general.auditTrail', 'Electronic Audit Trail')}</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Immutable, time-stamped system activity tracking designed according to 21 CFR Part 11 electronic records criteria</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExportCSV}>
          Export CSV Log
        </Button>
      </div>

      <div className="card">
        <div className="table-controls p-3" style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search by User, Modified Entity, or Value..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-muted" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="UPLOAD">UPLOAD</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={7} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<History size={38} className="text-muted" />}
            title="No audit events found"
            description="No log records match your current filter parameters."
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp (IST)</th>
                  <th>User / Investigator</th>
                  <th>Assigned Role</th>
                  <th>Action</th>
                  <th>Clinical Entity</th>
                  <th>Previous State</th>
                  <th>New State</th>
                  <th>IP Node</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id}>
                    <td className="text-muted text-xs font-mono">{log.time}</td>
                    <td className="font-medium text-primary">{log.user}</td>
                    <td><span className="text-xs text-muted">{log.role || 'Investigator'}</span></td>
                    <td>
                      <Badge variant={getActionColor(log.action)}>{log.action}</Badge>
                    </td>
                    <td className="font-medium">{log.entity}</td>
                    <td className="text-muted text-xs">{log.oldVal}</td>
                    <td className="font-semibold text-xs">{log.newVal}</td>
                    <td className="text-muted text-xs font-mono">{log.ip || '10.24.1.42'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          * Audit records are append-only. Cryptographic verification hash: <code>sha256-e9b4...8f2a</code> (Simulated demonstration mode).
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
