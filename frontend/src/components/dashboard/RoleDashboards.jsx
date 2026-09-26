import React from 'react';
import {
  FlaskConical, Building2, Users, ShieldCheck, AlertTriangle,
  Plus, FileText, ArrowRight, Sparkles, Activity,
  TrendingUp, CheckCircle2, AlertCircle, Pill,
  Flag, Eye, Bell
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import StatCard from './StatCard';
import StudyProgress from './StudyProgress';
import ComplianceOverview from './ComplianceOverview';
import SafetyOverview from './SafetyOverview';
import RecentAlerts from './RecentAlerts';
import Button from '../common/Button';
import { PERMISSIONS } from '../../config/permissions';

// ─── KPI Widget ──────────────────────────────────────────────────────────────
export const KPICard = ({ title, value, subtitle, icon, linkTo, loading, navigate }) => {
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

// ─── Shared Components ────────────────────────────────────────────────────────

const QuickActions = ({ role, canDo, can, navigate, setIsCreateStudyOpen, setIsReportSAEOpen }) => {
  return (
    <div className="quick-actions card">
      <div className="card-header">
        <h3 className="card-title">Quick Actions</h3>
      </div>
      <div className="action-buttons">
        {canDo('createStudy') && (
          <Button variant="secondary" className="action-btn" icon={<Plus size={16} />} onClick={() => setIsCreateStudyOpen(true)}>
            Initialize Study
          </Button>
        )}
        {canDo('reportSAE') && (
          <Button variant="secondary" className="action-btn" icon={<AlertTriangle size={16} className="text-danger" />} onClick={() => setIsReportSAEOpen(true)}>
            Expedited SAE (24h)
          </Button>
        )}
        {can(PERMISSIONS.REPORT_VIEW) && (
          <Button variant="secondary" className="action-btn" icon={<FileText size={16} />} onClick={() => navigate('/reports')}>
            Quality Reports
          </Button>
        )}
        {can(PERMISSIONS.AUDIT_VIEW) && (
          <Button variant="secondary" className="action-btn" icon={<Eye size={16} />} onClick={() => navigate('/audit')}>
            Audit Trail
          </Button>
        )}
        {can(PERMISSIONS.ETHICS_REVIEW) && (
          <Button variant="secondary" className="action-btn" icon={<ShieldCheck size={16} />} onClick={() => navigate('/ethics')}>
            IEC Review Queue
          </Button>
        )}
        {can(PERMISSIONS.PV_REVIEW) && (
          <Button variant="secondary" className="action-btn" icon={<Pill size={16} />} onClick={() => navigate('/pharmacovigilance')}>
            PV Safety Review
          </Button>
        )}
        {role === 'REGULATOR' && (
          <>
            <Button variant="secondary" className="action-btn" icon={<Flag size={16} />} onClick={() => navigate('/milestones')}>
              View Milestones
            </Button>
            <Button variant="secondary" className="action-btn" icon={<Activity size={16} />} onClick={() => navigate('/compliance')}>
              View Compliance
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const AiInsight = ({ navigate, studies }) => {
  return (
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
  );
};

const StudyPortfolioChart = ({ studies }) => {
  const chartData = [
    { name: 'Recruiting', value: studies.filter(s => s.status === 'Recruiting').length, color: 'var(--primary-color)' },
    { name: 'Active Follow-up', value: studies.filter(s => s.status === 'Active Follow-up').length, color: 'var(--success)' },
    { name: 'Protocol Ready', value: studies.filter(s => s.status === 'Protocol Ready').length, color: 'var(--accent-color)' },
    { name: 'Completed', value: studies.filter(s => s.status === 'Completed').length, color: '#8b5cf6' },
    { name: 'Other', value: studies.filter(s => !['Recruiting','Active Follow-up','Protocol Ready','Completed'].includes(s.status)).length, color: 'var(--danger)' },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="chart-section card flex items-center justify-center p-6 text-muted">
        No active studies data available
      </div>
    );
  }

  return (
    <div className="chart-section card">
      <div className="card-header">
        <h3 className="card-title">Study Portfolio Distribution</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
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
  );
};

const RegulatorNotice = () => (
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
);

// ─── Role Dashboards ──────────────────────────────────────────────────────────

export const AdminDashboard = ({ kpis, loadingKpis, studies, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="Total Studies" value={kpis.totalStudies} subtitle="System-wide" icon={<FlaskConical size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Active Studies" value={kpis.activeStudies} subtitle="Currently running" icon={<Activity size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Research Sites" value={kpis.totalSites} subtitle={`${Math.round(kpis.siteActivationRate ?? 0)}% activation`} icon={<Building2 size={20} />} linkTo="/sites" loading={loadingKpis} {...props} />
      <KPICard title="Total Participants" value={kpis.enrolledParticipants} subtitle={`${Math.round(kpis.recruitmentProgress ?? 0)}% of target`} icon={<Users size={20} />} linkTo="/participants" loading={loadingKpis} {...props} />
      <KPICard title="Open Deviations" value={kpis.openDeviations} subtitle="Pending resolution" icon={<AlertTriangle size={20} />} linkTo="/deviations" loading={loadingKpis} {...props} />
      <KPICard title="Pending Milestones" value={kpis.pendingRegulatory} subtitle={`${kpis.overdueRegulatoryCount ?? 0} overdue`} icon={<Flag size={20} />} linkTo="/milestones" loading={loadingKpis} {...props} />
      <KPICard title="Active Alerts" value={kpis.activeAlertsCount} subtitle="Open monitoring signals" icon={<Bell size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
      <KPICard title="Serious AEs" value={kpis.saeCount} subtitle="Requiring PV review" icon={<ShieldCheck size={20} />} linkTo="/safety-events" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row">
          <StudyPortfolioChart studies={studies} />
          <div className="card">
            <div className="card-header"><h3 className="card-title">Site Performance Overview</h3></div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2" style={{borderColor: 'var(--border-color)'}}>
                <span className="text-sm font-medium">Total Sites Enrolled</span>
                <span className="font-bold text-primary">{kpis.totalSites}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2" style={{borderColor: 'var(--border-color)'}}>
                <span className="text-sm font-medium">Activation Rate</span>
                <span className="font-bold text-success">{Math.round(kpis.siteActivationRate || 0)}%</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm font-medium">Monitoring Overdue</span>
                <span className="font-bold text-warning">{kpis.monitoringOverdue || 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="main-bottom-row">
          <ComplianceOverview />
          <SafetyOverview />
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="ADMIN" {...props} />
        <RecentAlerts />
        <AiInsight {...props} studies={studies} />
      </div>
    </div>
  </>
);

export const PiDashboard = ({ kpis, loadingKpis, studies, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="My Studies" value={kpis.activeStudies} subtitle="Assigned to you" icon={<FlaskConical size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Active Sites" value={kpis.totalSites} subtitle="Monitoring scope" icon={<Building2 size={20} />} linkTo="/sites" loading={loadingKpis} {...props} />
      <KPICard title="Enrolled Participants" value={kpis.enrolledParticipants} subtitle={`${Math.round(kpis.recruitmentProgress ?? 0)}% recruited`} icon={<Users size={20} />} linkTo="/participants" loading={loadingKpis} {...props} />
      <KPICard title="Open Deviations" value={kpis.openDeviations} subtitle="Protocol deviations" icon={<AlertTriangle size={20} />} linkTo="/deviations" loading={loadingKpis} {...props} />
      <KPICard title="Pending Queries" value={kpis.unresolvedQueries} subtitle="Data resolution needed" icon={<AlertCircle size={20} />} linkTo="/queries" loading={loadingKpis} {...props} />
      <KPICard title="Visit Compliance" value={`${Math.round(kpis.visitCompliance ?? 0)}%`} subtitle="Completed / scheduled" icon={<CheckCircle2 size={20} />} linkTo="/visits" loading={loadingKpis} {...props} />
      <KPICard title="Active Alerts" value={kpis.activeAlertsCount} subtitle="Safety & monitoring" icon={<Bell size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row" style={{ gridTemplateColumns: '1fr' }}>
          <StudyProgress />
        </div>
        <div className="main-bottom-row">
          <SafetyOverview />
          <ComplianceOverview />
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="PI" {...props} />
        <RecentAlerts />
        <AiInsight {...props} studies={studies} />
      </div>
    </div>
  </>
);

export const CoordinatorDashboard = ({ kpis, loadingKpis, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="Assigned Participants" value={kpis.enrolledParticipants} subtitle={`${Math.round(kpis.recruitmentProgress ?? 0)}% of target`} icon={<Users size={20} />} linkTo="/participants" loading={loadingKpis} {...props} />
      <KPICard title="Visit Compliance" value={`${Math.round(kpis.visitCompliance ?? 0)}%`} subtitle="Completed / scheduled" icon={<CheckCircle2 size={20} />} linkTo="/visits" loading={loadingKpis} {...props} />
      <KPICard title="Open Queries" value={kpis.unresolvedQueries} subtitle="Action required" icon={<AlertCircle size={20} />} linkTo="/queries" loading={loadingKpis} {...props} />
      <KPICard title="Open Deviations" value={kpis.openDeviations} subtitle="Pending resolution" icon={<AlertTriangle size={20} />} linkTo="/deviations" loading={loadingKpis} {...props} />
      <KPICard title="Active Alerts" value={kpis.activeAlertsCount} subtitle="Immediate attention" icon={<Bell size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row" style={{ gridTemplateColumns: '1fr' }}>
          <StudyProgress />
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="COORDINATOR" {...props} />
        <RecentAlerts />
      </div>
    </div>
  </>
);

export const MonitorDashboard = ({ kpis, loadingKpis, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="Assigned Studies" value={kpis.activeStudies} subtitle="Portfolio" icon={<FlaskConical size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Monitored Sites" value={kpis.totalSites} subtitle="Active assignments" icon={<Building2 size={20} />} linkTo="/sites" loading={loadingKpis} {...props} />
      <KPICard title="Open Queries" value={kpis.unresolvedQueries} subtitle="SDV pending" icon={<AlertCircle size={20} />} linkTo="/queries" loading={loadingKpis} {...props} />
      <KPICard title="Open Deviations" value={kpis.openDeviations} subtitle="Protocol compliance" icon={<AlertTriangle size={20} />} linkTo="/deviations" loading={loadingKpis} {...props} />
      <KPICard title="Active Signals" value={kpis.activeAlertsCount} subtitle="Risk monitoring" icon={<Activity size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row" style={{ gridTemplateColumns: '1fr' }}>
          <StudyProgress />
        </div>
        <div className="main-bottom-row">
          <ComplianceOverview />
          <div className="card flex items-center justify-center p-6 text-muted">
            Data Quality Overview (CDISC/SDV) — Data Populating
          </div>
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="MONITOR" {...props} />
        <RecentAlerts />
        <AiInsight {...props} />
      </div>
    </div>
  </>
);

export const EthicsDashboard = ({ kpis, loadingKpis, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="Studies Under Review" value={kpis.activeStudies} subtitle="Active protocols" icon={<FlaskConical size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Pending IEC Reviews" value={kpis.pendingRegulatory} subtitle={`${kpis.overdueRegulatoryCount ?? 0} overdue`} icon={<Flag size={20} />} linkTo="/milestones" loading={loadingKpis} {...props} />
      <KPICard title="Protocol Deviations" value={kpis.openDeviations} subtitle="Compliance review" icon={<AlertTriangle size={20} />} linkTo="/deviations" loading={loadingKpis} {...props} />
      <KPICard title="Safety Events (SAE)" value={kpis.saeCount} subtitle="Requiring review" icon={<ShieldCheck size={20} />} linkTo="/safety-events" loading={loadingKpis} {...props} />
      <KPICard title="Compliance Alerts" value={kpis.activeAlertsCount} subtitle="Oversight required" icon={<Bell size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row" style={{ gridTemplateColumns: '1fr' }}>
          <ComplianceOverview />
        </div>
        <div className="main-bottom-row">
          <SafetyOverview />
          <div className="card flex items-center justify-center p-6 text-muted">
            Regulatory / Ethics Timeline — Data Populating
          </div>
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="ETHICS" {...props} />
        <RecentAlerts />
      </div>
    </div>
  </>
);

export const PvDashboard = ({ kpis, loadingKpis, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="Total AEs" value={kpis.aeCount} subtitle="Adverse Events" icon={<AlertCircle size={20} />} linkTo="/safety-events" loading={loadingKpis} {...props} />
      <KPICard title="Total SAEs" value={kpis.saeCount} subtitle="Serious Adverse Events" icon={<ShieldCheck size={20} />} linkTo="/safety-events" loading={loadingKpis} {...props} />
      <KPICard title="Overdue Reports" value={kpis.overdueSaeCount} subtitle="Immediate action required" icon={<Pill size={20} />} linkTo="/pharmacovigilance" loading={loadingKpis} {...props} />
      <KPICard title="Safety Signals" value={kpis.activeAlertsCount} subtitle="Active alerts" icon={<Activity size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row" style={{ gridTemplateColumns: '1fr' }}>
          <SafetyOverview />
        </div>
        <div className="main-bottom-row">
          <div className="card flex items-center justify-center p-6 text-muted">
            Safety Event Trend (Timeline) — Data Populating
          </div>
          <div className="card flex items-center justify-center p-6 text-muted">
            SAE Classification Distribution — Data Populating
          </div>
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="PHARMACOVIGILANCE" {...props} />
        <RecentAlerts />
      </div>
    </div>
  </>
);

export const RegulatorDashboard = ({ kpis, loadingKpis, ...props }) => (
  <>
    <div className="kpi-grid">
      <KPICard title="Registered Studies" value={kpis.totalStudies} subtitle="Regulatory oversight" icon={<FlaskConical size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Active Studies" value={kpis.activeStudies} subtitle="Ongoing trials" icon={<Activity size={20} />} linkTo="/studies" loading={loadingKpis} {...props} />
      <KPICard title="Regulatory Milestones" value={kpis.pendingRegulatory} subtitle={`${kpis.overdueRegulatoryCount ?? 0} overdue`} icon={<Flag size={20} />} linkTo="/milestones" loading={loadingKpis} {...props} />
      <KPICard title="Open Compliance Issues" value={kpis.openDeviations} subtitle="Protocol deviations" icon={<AlertTriangle size={20} />} linkTo="/deviations" loading={loadingKpis} {...props} />
      <KPICard title="Safety Signals" value={kpis.activeAlertsCount} subtitle="Active alerts" icon={<Bell size={20} />} linkTo="/alerts" loading={loadingKpis} {...props} />
    </div>
    <div className="dashboard-layout">
      <div className="layout-main">
        <div className="main-top-row" style={{ gridTemplateColumns: '1fr' }}>
          <ComplianceOverview />
        </div>
        <div className="main-bottom-row" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card flex items-center justify-center p-6 text-muted">
            Regulatory Timeline Overview — Read-Only Mode
          </div>
        </div>
      </div>
      <div className="layout-side">
        <QuickActions role="REGULATOR" {...props} />
        <RecentAlerts />
        <RegulatorNotice />
      </div>
    </div>
  </>
);
