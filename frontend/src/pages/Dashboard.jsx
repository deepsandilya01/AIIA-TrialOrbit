import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, Building2, Users, ShieldCheck, AlertTriangle, 
  Calendar, Plus, FileText, ArrowRight, Sparkles, Activity, Clock
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
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success } = useToast();

  const [isCreateStudyOpen, setIsCreateStudyOpen] = useState(false);
  const [isReportSAEOpen, setIsReportSAEOpen] = useState(false);

  const chartData = [
    { name: 'Ongoing', value: 12, color: 'var(--primary-color)' },
    { name: 'Completed', value: 4, color: 'var(--success)' },
    { name: 'Planned', value: 1, color: 'var(--accent-color)' },
    { name: 'On Hold', value: 1, color: 'var(--danger)' }
  ];

  const handleStudyCreated = async (newStudy) => {
    await api.createStudy(newStudy);
    success('Study protocol initialized and added to active portfolio.');
  };

  const handleSAEReported = async (payload) => {
    await api.reportSAE(payload);
    success('SAE recorded in pharmacovigilance registry.');
  };

  return (
    <div className="dashboard page-container">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">{t('dashboard.clinicalResearchDashboard', 'Clinical Trial Control Room')}</h1>
            <DemoBadge text="Synthetic Demo Mode" />
          </div>
          <p className="page-subtitle">
            <strong className="text-primary font-semibold">MONITOR → IDENTIFY → ACT:</strong> Real-time clinical trial surveillance across multi-centre Ayurvedic & integrative research protocols
          </p>
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

      {/* Primary KPI Grid */}
      <div className="kpi-grid">
        <StatCard 
          title={t('dashboard.activeStudies', 'Active Protocols')}
          value="12" 
          subtitle="of 18 institutional studies"
          trend={{ value: '+2 new', isPositive: true }}
          icon={<FlaskConical size={20} />}
          linkTo="/studies"
        />
        <StatCard 
          title={t('dashboard.activeSites', 'Participating Sites')}
          value="34" 
          subtitle="of 42 total accredited facilities"
          status="5 Pending Verification"
          icon={<Building2 size={20} />}
          linkTo="/sites"
        />
        <StatCard 
          title={t('dashboard.totalParticipants', 'Enrolled Subjects')}
          value="1,240" 
          subtitle="67% screening conversion rate"
          trend={{ value: '+12.4%', isPositive: true }}
          icon={<Users size={20} />}
          linkTo="/recruitment"
        />
        <StatCard 
          title={t('dashboard.complianceRate', 'Protocol Compliance')}
          value="92.4%" 
          status="Threshold Met (ICH-GCP)"
          icon={<ShieldCheck size={20} />}
          linkTo="/compliance"
        />
        <StatCard 
          title={t('dashboard.pendingSaeReview', 'Pending SAE Reviews')}
          value="2" 
          status="Requires PV Action <24h"
          icon={<AlertTriangle size={20} />}
          linkTo="/safety"
        />
      </div>

      {/* Main Layout Grid */}
      <div className="dashboard-layout">
        <div className="layout-main">
          <div className="main-top-row">
            <div className="progress-section">
              <StudyProgress />
            </div>
            
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
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }} />
                    <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-center-text">
                  <span className="total">18</span>
                  <span className="label">Studies</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="main-bottom-row">
            <div className="compliance-section">
              <ComplianceOverview />
            </div>
            <div className="safety-section">
              <SafetyOverview />
            </div>
          </div>
        </div>

        {/* Sidebar Column: Actions, Alerts, AI Decision Support */}
        <div className="layout-side">
          <div className="quick-actions card">
            <div className="card-header">
              <h3 className="card-title">Workflow Actions</h3>
            </div>
            <div className="action-buttons">
              <Button 
                variant="secondary" 
                className="action-btn"
                icon={<Plus size={16} />}
                onClick={() => setIsCreateStudyOpen(true)}
              >
                Initialize Study
              </Button>
              <Button 
                variant="secondary" 
                className="action-btn"
                icon={<AlertTriangle size={16} className="text-danger" />}
                onClick={() => setIsReportSAEOpen(true)}
              >
                Expedited SAE (24h)
              </Button>
              <Button 
                variant="secondary" 
                className="action-btn"
                icon={<FileText size={16} />}
                onClick={() => navigate('/reports')}
              >
                Quality Reports
              </Button>
            </div>
          </div>

          <div className="alerts-section">
            <RecentAlerts />
          </div>

          {/* AI Decision Support Component */}
          <div className="ai-insight card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
            <div className="insight-header">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-warning" />
                <span className="ai-badge">AI Decision Support</span>
              </div>
              <span className="text-xs text-muted">Recruitment Latency</span>
            </div>
            <p className="insight-text">
              "Recruitment trajectory for Study <strong>AIIA-003</strong> is 28% below projected curve due to Site S-05 pending activation. Consider reallocating slots to high-performing Site S-03."
            </p>
            <button 
              className="insight-link"
              onClick={() => navigate('/recruitment')}
            >
              Analyze Recruitment Risk <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateStudy
        isOpen={isCreateStudyOpen}
        onClose={() => setIsCreateStudyOpen(false)}
        onStudyCreated={handleStudyCreated}
      />

      <ReportSAE
        isOpen={isReportSAEOpen}
        onClose={() => setIsReportSAEOpen(false)}
        onSAEReported={handleSAEReported}
      />
    </div>
  );
};

export default Dashboard;
