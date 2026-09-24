import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, FlaskConical, Building2, Users, 
  UserPlus, ShieldCheck, AlertTriangle, Bell, 
  FileText, History
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useTranslation();
  
  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('general.dashboard') },
    { path: '/studies', icon: <FlaskConical size={20} />, label: t('general.studies') },
    { path: '/sites', icon: <Building2 size={20} />, label: t('general.sites') },
    { path: '/participants', icon: <Users size={20} />, label: t('general.participants') },
    { path: '/recruitment', icon: <UserPlus size={20} />, label: t('general.recruitment') },
    { path: '/compliance', icon: <ShieldCheck size={20} />, label: t('general.compliance') },
    { path: '/safety', icon: <AlertTriangle size={20} />, label: "AE/SAE" },
    { path: '/alerts', icon: <Bell size={20} />, label: t('general.alerts'), badge: 3 },
    { path: '/reports', icon: <FileText size={20} />, label: t('general.reports') },
    { path: '/audit', icon: <History size={20} />, label: t('general.auditTrail') },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="watermark-building"></div>
        <div className="tagline-container">
          <span className="sanskrit-tagline">आयुषो वेत्ति इति आयुर्वेदः</span>
          <span className="english-tagline">Knowledge of Life is Ayurveda</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
