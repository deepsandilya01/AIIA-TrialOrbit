import { useTranslation } from 'react-i18next';
import React from 'react';
import { FlaskConical, Building2, Users, ShieldCheck, AlertTriangle, Calendar, Plus, FileText, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import StudyProgress from '../components/dashboard/StudyProgress';
import ComplianceOverview from '../components/dashboard/ComplianceOverview';
import SafetyOverview from '../components/dashboard/SafetyOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import Button from '../components/common/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();

  const chartData = [
    { name: 'Ongoing', value: 12, color: '#0B4A8E' },
    { name: 'Completed', value: 4, color: '#10B981' },
    { name: 'Planned', value: 1, color: '#D4AF37' },
    { name: 'On Hold', value: 1, color: '#EF4444' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">{t('dashboard.clinicalResearchDashboard')}</h1>
          <p className="page-subtitle">{t('dashboard.realTimeOverview')}</p>
        </div>
        
        <div className="dashboard-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>23 September 2026</span>
          </div>
          <div className="meta-time">Last updated at 14:32</div>
        </div>
      </div>

      <div className="kpi-grid">
        <StatCard 
          title={t('dashboard.activeStudies')} 
          value="12" 
          subtitle="of 18 total studies"
          icon={<FlaskConical size={24} />}
        />
        <StatCard 
          title={t('dashboard.activeSites')} 
          value="34" 
          subtitle="of 42 total sites"
          icon={<Building2 size={24} />}
        />
        <StatCard 
          title={t('dashboard.totalParticipants')} 
          value="1,240" 
          subtitle={t('dashboard.enrolledAcrossStudies')}
          icon={<Users size={24} />}
        />
        <StatCard 
          title={t('dashboard.complianceRate')} 
          value="92%" 
          status={t('dashboard.onTrack')}
          icon={<ShieldCheck size={24} />}
        />
        <StatCard 
          title={t('dashboard.pendingSaeReview')} 
          value="6" 
          status={t('dashboard.requiresAttention')}
          icon={<AlertTriangle size={24} />}
        />
      </div>

      <div className="dashboard-layout">
        <div className="layout-main">
          <div className="main-top-row">
            <div className="progress-section">
              <StudyProgress />
            </div>
            <div className="chart-section card">
              <div className="card-header">
                <h3 className="card-title">{t('dashboard.studyStatus')}</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-center-text">
                  <span className="total">18</span>
                  <span className="label">{t('dashboard.totalStudies')}</span>
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

        <div className="layout-side">
          <div className="quick-actions card">
            <div className="card-header">
              <h3 className="card-title">{t('dashboard.quickActions')}</h3>
            </div>
            <div className="action-buttons">
              <Button variant="secondary" className="action-btn">
                <Plus size={18} />{t('dashboard.createNewStudy')}</Button>
              <Button variant="secondary" className="action-btn">
                <Plus size={18} />{t('dashboard.addParticipant')}</Button>
              <Button variant="secondary" className="action-btn">
                <AlertTriangle size={18} />{t('dashboard.reportAeSae')}</Button>
              <Button variant="secondary" className="action-btn">
                <FileText size={18} />{t('dashboard.viewReports')}</Button>
            </div>
          </div>

          <div className="alerts-section">
            <RecentAlerts />
          </div>

          <div className="ai-insight card">
            <div className="insight-header">
              <span className="ai-badge">{t('dashboard.aiInsight')}</span>
            </div>
            <p className="insight-text">
              "Recruitment for Study AIIA-003 is 28% below expected target. Consider increasing site outreach."
            </p>
            <button className="insight-link">{t('dashboard.viewDetails')}<ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
