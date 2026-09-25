import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, FlaskConical, Building2, Users, CalendarCheck,
  MessageSquareWarning, AlertCircle, ShieldCheck, FileSignature, Flag,
  AlertTriangle, Pill, Activity, Bell, LineChart,
  History, Network, Database, DownloadCloud,
  Sparkles, Radar, UserCog, Shield, Lock, X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navigationSections = [
    {
      group: '', // Top level
      items: [
        { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('general.dashboard', 'Dashboard') }
      ]
    },
    {
      group: 'CLINICAL TRIALS',
      items: [
        { path: '/studies', icon: <FlaskConical size={18} />, label: 'Studies' },
        { path: '/sites', icon: <Building2 size={18} />, label: 'Sites' },
        { path: '/participants', icon: <Users size={18} />, label: 'Participants' },
        { path: '/visits', icon: <CalendarCheck size={18} />, label: 'Visits' }
      ]
    },
    {
      group: 'DATA QUALITY',
      items: [
        { path: '/queries', icon: <MessageSquareWarning size={18} />, label: 'Queries', badge: 12, badgeVariant: 'warning' },
        { path: '/deviations', icon: <AlertCircle size={18} />, label: 'Deviations' }
      ]
    },
    {
      group: 'REGULATORY',
      items: [
        { path: '/ethics', icon: <ShieldCheck size={18} />, label: 'Ethics' },
        { path: '/ctri', icon: <FileSignature size={18} />, label: 'CTRI' },
        { path: '/milestones', icon: <Flag size={18} />, label: 'Milestones' }
      ]
    },
    {
      group: 'SAFETY',
      items: [
        { path: '/safety-events', icon: <AlertTriangle size={18} />, label: 'AE / SAE', badge: 2, badgeVariant: 'danger' },
        { path: '/pharmacovigilance', icon: <Pill size={18} />, label: 'Pharmacovigilance' },
        { path: '/safety-dashboard', icon: <Activity size={18} />, label: 'Safety Dashboard' }
      ]
    },
    {
      group: 'MONITORING',
      items: [
        { path: '/alerts', icon: <Bell size={18} />, label: 'Alerts', badge: 5, badgeVariant: 'warning' },
        { path: '/kpis', icon: <LineChart size={18} />, label: 'KPIs' }
      ]
    },
    {
      group: 'AUDIT',
      items: [
        { path: '/audit', icon: <History size={18} />, label: 'Audit Trail' }
      ]
    },
    {
      group: 'INTEGRATION',
      items: [
        { path: '/fhir', icon: <Network size={18} />, label: 'FHIR / ABDM' },
        { path: '/cdisc', icon: <Database size={18} />, label: 'CDISC' },
        { path: '/exports', icon: <DownloadCloud size={18} />, label: 'Exports' }
      ]
    },
    {
      group: 'AI INTELLIGENCE',
      items: [
        { path: '/ai-assistant', icon: <Sparkles size={18} />, label: 'KPI Assistant' },
        { path: '/insights', icon: <Radar size={18} />, label: 'Risk Insights' }
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { path: '/users', icon: <UserCog size={18} />, label: 'Users' },
        { path: '/roles', icon: <Shield size={18} />, label: 'Roles' },
        { path: '/permissions', icon: <Lock size={18} />, label: 'Permissions' }
      ]
    }
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
      <div className="sidebar-mobile-header">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AIIA" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff', padding: '1px' }} />
          <span className="font-bold text-sm text-white">TrialOrbit</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigationSections.map((section, sIdx) => (
          <div key={sIdx} className="sidebar-group">
            {section.group && <div className="sidebar-group-title">{section.group}</div>}
            <div className="sidebar-group-items">
              {section.items.map((item, iIdx) => (
                <NavLink 
                  key={iIdx} 
                  to={item.path} 
                  onClick={handleLinkClick}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  end={item.path === '/'}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge && (
                    <span className={`sidebar-badge badge-${item.badgeVariant || 'default'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="tagline-container">
          <span className="sanskrit-tagline">आयुषो वेत्ति इति आयुर्वेदः</span>
          <span className="english-tagline">Knowledge of Life is Ayurveda</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
