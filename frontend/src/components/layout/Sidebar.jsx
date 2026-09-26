import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import usePermissions from '../../hooks/usePermissions';
import { ROLE_META } from '../../config/permissions';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { navItems, role, roleMeta } = usePermissions();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  // Translate top-level group labels (kept in code, i18n fallback to English)
  const translateGroup = (group) => {
    const map = {
      'CLINICAL TRIALS':      t('nav.group.clinical',       'CLINICAL TRIALS'),
      'DATA QUALITY':         t('nav.group.dataQuality',    'DATA QUALITY'),
      'REGULATORY & ETHICS':  t('nav.group.regulatory',     'REGULATORY & ETHICS'),
      'SAFETY':               t('nav.group.safety',         'SAFETY'),
      'MONITORING':           t('nav.group.monitoring',     'MONITORING'),
      'AUDIT & INTEGRITY':    t('nav.group.audit',          'AUDIT & INTEGRITY'),
      'INTEROPERABILITY':     t('nav.group.integration',    'INTEROPERABILITY'),
      'AI INTELLIGENCE':      t('nav.group.ai',             'AI INTELLIGENCE'),
      'ADMINISTRATION':       t('nav.group.admin',          'ADMINISTRATION'),
    };
    return map[group] || group;
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
      {/* Mobile header */}
      <div className="sidebar-mobile-header">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="AIIA"
            style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff', padding: '1px' }}
          />
          <span className="font-bold text-sm text-white">TrialOrbit</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      {/* Role badge at top of sidebar */}
      {role && (
        <div className="sidebar-role-badge">
          <span className={`badge ${roleMeta.badge || 'badge-default'}`} style={{ fontSize: '0.65rem' }}>
            {roleMeta.label || role}
          </span>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((section, sIdx) => (
          <div key={sIdx} className="sidebar-group">
            {section.group && (
              <div className="sidebar-group-title">{translateGroup(section.group)}</div>
            )}
            <div className="sidebar-group-items">
              {section.items.map((item, iIdx) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    end={item.path === '/dashboard'}
                  >
                    <span className="sidebar-icon">
                      {IconComponent ? <IconComponent size={18} /> : null}
                    </span>
                    <span className="sidebar-label">{t(`nav.${item.path.replace('/', '')}`, item.label)}</span>
                    {item.badgeVariant && (
                      <span className={`sidebar-badge badge-${item.badgeVariant}`} />
                    )}
                  </NavLink>
                );
              })}
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
