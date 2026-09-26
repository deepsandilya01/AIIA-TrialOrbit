import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import DemoBadge from '../components/common/DemoBadge';
import CreateStudy from '../features/studies/CreateStudy';
import ReportSAE from '../features/safety/ReportSAE';
import {
  AdminDashboard, PiDashboard, CoordinatorDashboard, MonitorDashboard,
  EthicsDashboard, PvDashboard, RegulatorDashboard
} from '../components/dashboard/RoleDashboards';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { useSocketEvent } from '../hooks/useSocket';
import usePermissions from '../hooks/usePermissions';
import { PERMISSIONS, canSeeWidget } from '../config/permissions';
import './Dashboard.css';

// ─── Role-specific greeting ──────────────────────────────────────────────────
const ROLE_GREETING = {
  ADMIN:            'System Overview',
  PI:               'Principal Investigator Workspace',
  COORDINATOR:      'Study Operations Centre',
  MONITOR:          'Clinical Monitoring Dashboard',
  ETHICS:           'Ethics Committee Overview',
  PHARMACOVIGILANCE: 'Pharmacovigilance Command Centre',
  REGULATOR:        'Regulatory Oversight Portal',
};

const ROLE_SUBTITLE = {
  ADMIN:            'Institutional overview across all active studies, sites, and safety signals.',
  PI:               'Your active studies, recruitment status, safety events and compliance milestones.',
  COORDINATOR:      "Today's operational tasks — visits, participants, queries and deviations.",
  MONITOR:          'Site performance, visit compliance, data quality and monitoring signals.',
  ETHICS:           'Ethics reviews, IEC approvals, consent oversight and compliance status.',
  PHARMACOVIGILANCE: 'Adverse events, SAE surveillance, PV reviews and safety signal detection.',
  REGULATOR:        'Read-only regulatory inspection view — studies, compliance, safety and audit.',
};


// ─── Main Dashboard ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success } = useToast();
  const { role, can, canDo, canWidget, roleMeta } = usePermissions();

  const [kpis, setKpis] = useState({});
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [studies, setStudies] = useState([]);
  const [isCreateStudyOpen, setIsCreateStudyOpen] = useState(false);
  const [isReportSAEOpen, setIsReportSAEOpen] = useState(false);

  const fetchKPIs = useCallback(async () => {
    try {
      const data = await api.getDashboardKPIs();
      setKpis(data);

      // Also load studies for chart
      if (canWidget('study_portfolio_chart')) {
        const stds = await api.getStudies();
        setStudies(stds);
      }
    } catch (err) {
      console.error('KPI load error:', err);
    } finally {
      setLoadingKpis(false);
    }
  }, [role]);

  useEffect(() => { fetchKPIs(); }, [fetchKPIs]);

  // Real-time Socket updates
  useSocketEvent('dashboard:kpi_updated', fetchKPIs);
  useSocketEvent('study:created', fetchKPIs);
  useSocketEvent('participant:created', fetchKPIs);
  useSocketEvent('safety:event_created', fetchKPIs);

  const handleStudyCreated = async (newStudy) => {
    await api.createStudy(newStudy);
    success('Study protocol initialized and added to active portfolio.');
    fetchKPIs();
  };

  const handleSAEReported = async (payload) => {
    await api.reportSAE(payload);
    success('SAE recorded in pharmacovigilance registry.');
    fetchKPIs();
  };

  const dashboardProps = {
    role, can, canDo, navigate, kpis, loadingKpis, studies, setIsCreateStudyOpen, setIsReportSAEOpen
  };

  const greetingTitle = ROLE_GREETING[role] || 'Clinical Trial Control Room';
  const greetingSubtitle = ROLE_SUBTITLE[role] || '';

  return (
    <div className="dashboard page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">{greetingTitle}</h1>
            <DemoBadge text="Synthetic Demo Mode" />
            {roleMeta.label && (
              <span className={`badge ${roleMeta.badge || 'badge-default'}`} style={{ fontSize: '0.7rem' }}>
                {roleMeta.label}
              </span>
            )}
          </div>
          <p className="page-subtitle">{greetingSubtitle}</p>
        </div>
        <div className="dashboard-meta">
          <div className="meta-item">
            <Calendar size={15} />
            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="meta-time flex items-center gap-1">
            <Clock size={12} /> Live Sync: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} IST
          </div>
        </div>
      </div>

      {/* ─── Role Dashboard Layouts ───────────────────────────────────────────── */}
      {role === 'ADMIN' && <AdminDashboard {...dashboardProps} />}
      {role === 'PI' && <PiDashboard {...dashboardProps} />}
      {role === 'COORDINATOR' && <CoordinatorDashboard {...dashboardProps} />}
      {role === 'MONITOR' && <MonitorDashboard {...dashboardProps} />}
      {role === 'ETHICS' && <EthicsDashboard {...dashboardProps} />}
      {role === 'PHARMACOVIGILANCE' && <PvDashboard {...dashboardProps} />}
      {role === 'REGULATOR' && <RegulatorDashboard {...dashboardProps} />}

      {/* Modals — only shown when user has permission */}
      {canDo('createStudy') && (
        <CreateStudy
          isOpen={isCreateStudyOpen}
          onClose={() => setIsCreateStudyOpen(false)}
          onStudyCreated={handleStudyCreated}
        />
      )}

      {canDo('reportSAE') && (
        <ReportSAE
          isOpen={isReportSAEOpen}
          onClose={() => setIsReportSAEOpen(false)}
          onSAEReported={handleSAEReported}
        />
      )}
    </div>
  );
};

export default Dashboard;
