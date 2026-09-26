import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Bell, Filter, CheckCircle2, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import api from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';

const Alerts = () => {
  const { t } = useTranslation();
  const { success, error: toastError } = useToast();

  const [alertsList, setAlertsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts();
      setAlertsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useSocketEvent('alert:created', loadAlerts);
  useSocketEvent('alert:updated', loadAlerts);
  useSocketEvent('alert:acknowledged', loadAlerts);

  const handleAcknowledge = async (id) => {
    try {
      const updated = await api.acknowledgeAlert(id);
      if (updated) {
        setAlertsList(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
      }
      success('Alert acknowledged and logged in institutional audit trail.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to acknowledge alert. Please try again.';
      toastError(msg);
      console.error('Alert acknowledge failed:', err);
    }
  };

  const filtered = alertsList.filter(a => {
    const matchesResolved = showResolved ? true : !a.resolved;
    const matchesSeverity = filterSeverity === 'all' || (a.type || '').toLowerCase() === filterSeverity.toLowerCase();
    return matchesResolved && matchesSeverity;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Automated Monitoring Alerts</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Real-time surveillance triggers across protocol compliance, recruitment velocity, and safety deadlines</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-semibold flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showResolved} 
              onChange={(e) => setShowResolved(e.target.checked)} 
              style={{ width: '16px', height: '16px', flexShrink: 0 }}
            />
            Show Acknowledged Signals
          </label>
        </div>
      </div>

      <div className="study-tabs mb-4">
        <button className={`tab ${filterSeverity === 'all' ? 'active' : ''}`} onClick={() => setFilterSeverity('all')}>
          All Signals
        </button>
        <button className={`tab ${filterSeverity === 'critical' ? 'active' : ''}`} onClick={() => setFilterSeverity('critical')}>
          Critical ({alertsList.filter(a => !a.resolved && a.type === 'Critical').length})
        </button>
        <button className={`tab ${filterSeverity === 'warning' ? 'active' : ''}`} onClick={() => setFilterSeverity('warning')}>
          Warnings ({alertsList.filter(a => !a.resolved && a.type === 'Warning').length})
        </button>
        <button className={`tab ${filterSeverity === 'info' ? 'active' : ''}`} onClick={() => setFilterSeverity('info')}>
          Informational
        </button>
      </div>

      <div className="card">
        {loading ? (
          <SkeletonTable rows={4} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck size={42} className="text-success" />}
            title="All monitored activities are currently within configured thresholds"
            description="No active clinical deviations, overdue safety reviews, or regulatory warnings detected."
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity Level</th>
                  <th>Clinical Monitoring Notification</th>
                  <th>Associated Protocol</th>
                  <th>Category</th>
                  <th>Trigger Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(alert => (
                  <tr key={alert.id} style={{ opacity: alert.resolved ? 0.65 : 1 }}>
                    <td>
                      <Badge variant={alert.type === 'Critical' ? 'danger' : alert.type === 'Warning' ? 'warning' : 'info'}>
                        {alert.type}
                      </Badge>
                    </td>
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        {alert.type === 'Critical' ? (
                          <AlertTriangle size={16} className="text-danger" style={{ flexShrink: 0 }} />
                        ) : alert.type === 'Warning' ? (
                          <Bell size={16} className="text-warning" style={{ flexShrink: 0 }} />
                        ) : (
                          <Info size={16} className="text-info" style={{ flexShrink: 0 }} />
                        )}
                        <span>{alert.text}</span>
                      </div>
                    </td>
                    <td className="text-primary font-medium">{alert.study}</td>
                    <td>
                      <span className="badge badge-default">{alert.category || 'Surveillance'}</span>
                    </td>
                    <td className="text-muted text-xs">{alert.date}</td>
                    <td>
                      {alert.resolved ? (
                        <span className="text-xs text-success flex items-center gap-1">
                          <CheckCircle2 size={13} /> Acknowledged
                        </span>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleAcknowledge(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
