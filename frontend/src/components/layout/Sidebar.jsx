import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, FlaskConical, Building2, Users, 
  ShieldCheck, AlertTriangle, Bell, 
  FileText, History, X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navigationSections = [
    {
      group: 'CORE',
      items: [
        { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('general.dashboard', 'Control Room') },
        { path: '/studies', icon: <FlaskConical size={18} />, label: t('general.studies', 'Studies') },
        { path: '/sites', icon: <Building2 size={18} />, label: t('general.sites', 'Research Sites') },
        { path: '/recruitment', icon: <Users size={18} />, label: t('general.recruitment', 'Recruitment') },
      ]
    },
    {
      group: 'MONITORING',
      items: [
        { path: '/compliance', icon: <ShieldCheck size={18} />, label: t('general.compliance', 'Compliance') },
        { path: '/alerts', icon: <Bell size={18} />, label: t('general.alerts', 'Surveillance Alerts'), badge: 4, badgeVariant: 'warning' },
      ]
    },
    {
      group: 'SAFETY & COMPLIANCE',
      items: [
        { path: '/safety', icon: <AlertTriangle size={18} />, label: 'AE / SAE Safety', badge: 2, badgeVariant: 'danger' },
        { path: '/audit', icon: <History size={18} />, label: t('general.auditTrail', 'CFR 21 Audit Trail') },
      ]
    },
    {
      group: 'REPORTING',
      items: [
        { path: '/reports', icon: <FileText size={18} />, label: 'Reports & Quality' },
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
            <div className="sidebar-group-title">{section.group}</div>
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
