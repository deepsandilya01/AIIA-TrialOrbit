import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical, Building2, Users, ShieldCheck, AlertTriangle,
  Calendar, Plus, FileText, ArrowRight, Sparkles, Activity,
  Clock, TrendingUp, CheckCircle2, AlertCircle, Pill,
  Flag, BarChart3, Eye
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import StudyProgress from '../components/dashboard/StudyProgress';
import ComplianceOverview from '../components/dashboard/ComplianceOverview';
import SafetyOverview from '../components/dashboard/SafetyOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import Button from '../components/common/Button';
import DemoBadge from '../components/common/DemoBadge';
import CreateStudy from '../features/studies/CreateStudy';
import ReportSAE from '../features/safety/ReportSAE';
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

// ─── KPI Widget ──────────────────────────────────────────────────────────────
const KPICard = ({ title, value, subtitle, icon, linkTo, variant = 'default', loading }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`stat-card ${linkTo ? 'cursor-pointer' : ''}`}
      onClick={() => linkTo && navigate(linkTo)}
      style={{ cursor: linkTo ? 'pointer' : 'default' }}
    >
      {loading ? (
        <div className="stat-skeleton" />
      ) : (
        <>
          <div className="stat-icon-wrap">
            {icon}
          </div>
          <div className="stat-content">
            <div className="stat-value">{value ?? '—'}</div>
            <div className="stat-title">{title}</div>
            {subtitle && <div className="stat-subtitle">{subtitle}</div>}
          </div>
        </>
      )}
    </div>
  );
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

  // Build chart data from actual studies
  const chartData = [
    { name: 'Recruiting', value: studies.filter(s => s.status === 'Recruiting').length, color: 'var(--primary-color)' },
    { name: 'Active Follow-up', value: studies.filter(s => s.status === 'Active Follow-up').length, color: 'var(--success)' },
    { name: 'Protocol Ready', value: studies.filter(s => s.status === 'Protocol Ready').length, color: 'var(--accent-color)' },
    { name: 'Completed', value: studies.filter(s => s.status === 'Completed').length, color: '#8b5cf6' },
    { name: 'Other', value: studies.filter(s => !['Recruiting','Active Follow-up','Protocol Ready','Completed'].includes(s.status)).length, color: 'var(--danger)' },
  ].filter(d => d.value > 0);

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

      {/* ─── KPI Grid — role-aware widgets ───────────────────────────────────── */}
      <div className="kpi-grid">
        {canWidget('active_studies') && (
          <KPICard
            title="Active Studies"
            value={kpis.activeStudies}
            subtitle={`of ${kpis.totalStudies ?? 0} total`}
            icon={<FlaskConical size={20} />}
            linkTo="/studies"
            loading={loadingKpis}
          />
        )}
        {canWidget('total_sites') && (
          <KPICard
            title="Research Sites"
            value={kpis.totalSites}
            subtitle={`${Math.round(kpis.siteActivationRate ?? 0)}% activation rate`}
            icon={<Building2 size={20} />}
            linkTo="/sites"
            loading={loadingKpis}
          />
        )}
        {canWidget('total_participants') && (
          <KPICard
            title="Enrolled Subjects"
            value={kpis.recruitmentLag !== undefined ? (kpis.targetParticipants ?? 0) - (kpis.recruitmentLag ?? 0) : '—'}
            subtitle={`${Math.round(kpis.recruitmentProgress ?? 0)}% of target`}
            icon={<Users size={20} />}
            linkTo="/participants"
            loading={loadingKpis}
          />
        )}
        {canWidget('recruitment_progress') && (
          <KPICard
            title="Recruitment Progress"
            value={`${Math.round(kpis.recruitmentProgress ?? 0)}%`}
            subtitle={`${kpis.recruitmentLag ?? 0} slots behind target`}
            icon={<TrendingUp size={20} />}
            linkTo="/recruitment"
            loading={loadingKpis}
          />
        )}
        {canWidget('visit_compliance') && (
          <KPICard
            title="Visit Compliance"
            value={`${Math.round(kpis.visitCompliance ?? 0)}%`}
            subtitle="Completed / scheduled ratio"
            icon={<CheckCircle2 size={20} />}
            linkTo="/visits"
            loading={loadingKpis}
          />
        )}
        {canWidget('open_queries') && (
          <KPICard
            title="Open Queries"
            value={kpis.unresolvedQueries}
            subtitle="Pending data resolution"
            icon={<AlertCircle size={20} />}
            linkTo="/queries"
            loading={loadingKpis}
          />
        )}
        {canWidget('open_deviations') && (
          <KPICard
            title="Open Deviations"
            value={kpis.openDeviations}
            subtitle="Protocol deviations pending"
            icon={<AlertTriangle size={20} />}
            linkTo="/deviations"
            loading={loadingKpis}
          />
        )}
        {canWidget('pending_regulatory') && (
          <KPICard
            title="Regulatory Milestones"
            value={kpis.pendingRegulatory}
            subtitle={`${kpis.overdueRegulatoryCount ?? 0} overdue`}
            icon={<Flag size={20} />}
            linkTo="/milestones"
            loading={loadingKpis}
          />
        )}
        {canWidget('ae_count') && (
          <KPICard
            title="Adverse Events"
            value={kpis.aeCount}
            subtitle="Total AE reported"
            icon={<AlertTriangle size={20} />}
            linkTo="/safety-events"
            loading={loadingKpis}
          />
        )}
        {canWidget('sae_count') && (
          <KPICard
            title="Serious Adverse Events"
            value={kpis.saeCount}
            subtitle="Requiring expedited reporting"
            icon={<ShieldCheck size={20} />}
            linkTo="/safety-events"
            loading={loadingKpis}
          />
        )}
        {canWidget('overdue_sae') && (
          <KPICard
            title="Overdue SAE Reports"
            value={kpis.overdueSaeCount}
            subtitle={kpis.overdueSaeCount > 0 ? 'Immediate PV action required' : 'All clear'}
            icon={<Pill size={20} />}
            linkTo="/pharmacovigilance"
            loading={loadingKpis}
          />
        )}
        {canWidget('active_alerts') && (
          <KPICard
            title="Active Alerts"
            value={kpis.activeAlertsCount}
            subtitle="Open monitoring signals"
            icon={<Activity size={20} />}
            linkTo="/alerts"
            loading={loadingKpis}
          />
        )}
      </div>

      {/* ─── Main Layout ─────────────────────────────────────────────────────── */}
      <div className="dashboard-layout">
        <div className="layout-main">
          <div className="main-top-row">
            {/* Study progress — for clinical/monitoring roles */}
            {canWidget('study_progress') && (
              <div className="progress-section">
                <StudyProgress />
              </div>
            )}

            {/* Study portfolio pie chart */}
            {canWidget('study_portfolio_chart') && chartData.length > 0 && (
              <div className="chart-section card">
                <div className="card-header">
                  <h3 className="card-title">Study Portfolio Distribution</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="chart-center-text">
                    <span className="total">{studies.length}</span>
                    <span className="label">Studies</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compliance + Safety row */}
          {(canWidget('compliance_overview') || canWidget('safety_overview')) && (
            <div className="main-bottom-row">
              {canWidget('compliance_overview') && (
                <div className="compliance-section">
                  <ComplianceOverview />
                </div>
              )}
              {canWidget('safety_overview') && (
                <div className="safety-section">
                  <SafetyOverview />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar — Quick Actions + Alerts + AI Insight */}
        <div className="layout-side">
          {/* Role-specific Quick Actions */}
          {(canWidget('quick_actions_admin') || canWidget('quick_actions_pi') ||
            canWidget('quick_actions_coordinator') || canWidget('quick_actions_pv')) && (
            <div className="quick-actions card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="action-buttons">
                {canDo('createStudy') && (
                  <Button
                    variant="secondary"
                    className="action-btn"
                    icon={<Plus size={16} />}
                    onClick={() => setIsCreateStudyOpen(true)}
                  >
                    Initialize Study
                  </Button>
                )}
                {canDo('reportSAE') && (
                  <Button
                    variant="secondary"
                    className="action-btn"
                    icon={<AlertTriangle size={16} className="text-danger" />}
                    onClick={() => setIsReportSAEOpen(true)}
                  >
                    Expedited SAE (24h)
                  </Button>
                )}
                {can(PERMISSIONS.REPORT_VIEW) && (
                  <Button
                    variant="secondary"
                    className="action-btn"
                    icon={<FileText size={16} />}
                    onClick={() => navigate('/reports')}
                  >
                    Quality Reports
                  </Button>
                )}
                {can(PERMISSIONS.AUDIT_VIEW) && (
                  <Button
                    variant="secondary"
                    className="action-btn"
                    icon={<Eye size={16} />}
                    onClick={() => navigate('/audit')}
                  >
                    Audit Trail
                  </Button>
                )}
                {can(PERMISSIONS.ETHICS_REVIEW) && (
                  <Button
                    variant="secondary"
                    className="action-btn"
                    icon={<ShieldCheck size={16} />}
                    onClick={() => navigate('/ethics')}
                  >
                    IEC Review Queue
                  </Button>
                )}
                {can(PERMISSIONS.PV_REVIEW) && (
                  <Button
                    variant="secondary"
                    className="action-btn"
                    icon={<Pill size={16} />}
                    onClick={() => navigate('/pharmacovigilance')}
                  >
                    PV Safety Review
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Alerts — visible to all */}
          {canWidget('recent_alerts') && (
            <div className="alerts-section">
              <RecentAlerts />
            </div>
          )}

          {/* AI Decision Support — only for roles with AI permission */}
          {can(PERMISSIONS.AI_VIEW) && (
            <div className="ai-insight card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
              <div className="insight-header">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-warning" />
                  <span className="ai-badge">AI Decision Support</span>
                </div>
                <span className="text-xs text-muted">Recruitment Latency</span>
              </div>
              <p className="insight-text">
                "Recruitment trajectory for Study <strong>AIIA-003</strong> is 28% below projected curve
                due to Site S-05 pending activation. Consider reallocating slots to high-performing Site S-03."
              </p>
              <button className="insight-link" onClick={() => navigate('/recruitment')}>
                Analyze Recruitment Risk <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* REGULATOR-specific read-only notice */}
          {role === 'REGULATOR' && (
            <div className="card" style={{ borderLeft: '4px solid var(--text-muted)', padding: '1rem' }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-muted" />
                <span className="text-sm font-semibold text-secondary">Read-Only Access</span>
              </div>
              <p className="text-xs text-muted">
                Your REGULATOR role provides authorized read-only inspection access.
                Data export is available from the Interoperability section.
                All access is logged in the audit trail.
              </p>
            </div>
          )}
        </div>
      </div>

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
