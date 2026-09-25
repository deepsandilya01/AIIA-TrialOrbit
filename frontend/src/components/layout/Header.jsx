import { useState, useRef, useEffect } from 'react';
import {
  Bell, ChevronDown, Sun, Moon, Globe, LogOut,
  LayoutDashboard, ChevronRight, Search, Menu,
  Shield, UserCheck, AlertTriangle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { alerts, userRolesList } from '../../data/dummyData';
import { useToast } from '../../context/ToastContext';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, login, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const roleRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return { base: 'Control Room', title: 'Clinical Trial Dashboard' };
    if (path.startsWith('/studies/')) return { base: 'Studies', title: 'Study Protocol Workspace' };
    if (path.startsWith('/studies')) return { base: 'Portfolio', title: 'Clinical Study Registry' };
    if (path.startsWith('/sites/')) return { base: 'Sites', title: 'Site Inspection Profile' };
    if (path.startsWith('/sites')) return { base: 'Network', title: 'Participating Research Sites' };
    if (path.startsWith('/participants') || path.startsWith('/recruitment')) return { base: 'Recruitment', title: 'Screening & Cohort Velocity' };
    if (path.startsWith('/compliance')) return { base: 'Governance', title: 'Regulatory & IEC Milestones' };
    if (path.startsWith('/safety')) return { base: 'Safety', title: 'Adverse Events & Pharmacovigilance' };
    if (path.startsWith('/alerts')) return { base: 'Surveillance', title: 'Automated Monitoring Alerts' };
    if (path.startsWith('/reports')) return { base: 'Analytics', title: 'Clinical Reports & Data Quality' };
    if (path.startsWith('/audit')) return { base: 'Integrity', title: 'CFR 21 Part 11 Audit Trail' };
    return { base: 'TrialOrbit', title: 'System' };
  };

  const breadcrumb = getBreadcrumb();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('ctms-language', lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (roleItem) => {
    login({
      name: roleItem.name,
      role: roleItem.role,
      email: `${roleItem.id}@aiia.gov.in`
    });
    setShowRoleMenu(false);
    success(`Active role switched to ${roleItem.role}. UI permissions updated.`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/studies?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <header className="app-header">
      {/* Top Institutional Header (Govt of India / Ayush / AIIA) */}
      <div className="institutional-header">
        <div className="inst-left">
          <img src="/gov.png" alt="Government of India - Ministry of Ayush" className="header-gov-logo" />
          <div className="inst-text">
            <span className="bold">{t('common.govtOfIndia', 'Government of India')}</span>
            <span>{t('common.ministryOfAyush', 'Ministry of Ayush')}</span>
          </div>
        </div>

        <div className="inst-center">
          <div className="inst-text center-text">
            <span className="inst-title">All India Institute of Ayurveda (AIIA)</span>
            <span className="inst-subtitle">National Apex Centre for Evidence-Based Clinical Research</span>
            <span className="inst-tagline">धियो यो नः प्रचोदयात् • Smarter Trials, Healthier Tomorrows</span>
          </div>
        </div>

        <div className="inst-right">
          <div className="badge-placeholder sih">SIH 2026</div>
          <div className="badge-placeholder naac">NAAC A++</div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="nav-header">
        <div className="nav-left">
          {onToggleSidebar && (
            <button
              className="icon-btn mobile-menu-btn"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/dashboard" className="nav-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.png" alt="AIIA TrialOrbit Logo" className="ctms-logo-img" />
            <div className="flex flex-col">
              <span className="ctms-title">AIIA TrialOrbit</span>
              <span className="ctms-edition">Clinical Trial Management & Monitoring Platform (CTMS)</span>
            </div>
          </Link>

          {breadcrumb.base && (
            <div className="header-breadcrumb-wrapper">
              <div className="header-divider"></div>
              <div className="header-breadcrumb">
                <LayoutDashboard size={15} className="breadcrumb-icon" />
                <span className="breadcrumb-base">{breadcrumb.base}</span>
                <ChevronRight size={13} className="breadcrumb-chevron" />
                <span className="breadcrumb-title-text">{breadcrumb.title}</span>
              </div>
            </div>
          )}
        </div>

        <div className="nav-center">
          <div className="global-search-container">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="global-search-input"
              placeholder="Search studies, sites, AEs, protocols (press Enter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        <div className="nav-user">
          {/* Language Selector */}
          <div className="language-selector">
            <Globe size={15} className="text-muted" />
            <select
              value={i18n.language || 'en'}
              onChange={changeLanguage}
              aria-label="Language selection"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications Dropdown */}
          <div className="notifications-wrapper" ref={notifRef}>
            <button
              className={`icon-btn notif-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(prev => !prev)}
              aria-label="View notifications"
              title="Surveillance Alerts"
            >
              <Bell size={18} />
              {activeAlerts.length > 0 && (
                <span className="notification-dot" aria-label={`${activeAlerts.length} unacknowledged alerts`}>
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown card" role="region" aria-label="Recent Alerts">
                <div className="notif-header">
                  <div className="font-semibold text-sm">Active Monitoring Signals</div>
                  <span className="badge badge-danger text-xs">{activeAlerts.length} Attention</span>
                </div>
                <div className="notif-list">
                  {activeAlerts.map(a => (
                    <div
                      key={a.id}
                      className="notif-item"
                      onClick={() => { setShowNotifications(false); navigate('/alerts'); }}
                    >
                      <div className={`notif-indicator ${a.type === 'Critical' ? 'bg-danger' : 'bg-warning'}`} />
                      <div className="notif-content">
                        <p className="notif-text">{a.text}</p>
                        <span className="notif-meta">Study {a.study} • {a.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notif-footer">
                  <Link to="/alerts" onClick={() => setShowNotifications(false)} className="view-all-notifs">
                    View All Automated Alerts <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Profile */}
          <div className="user-profile-wrapper" ref={roleRef}>
            <div
              className="user-profile"
              onClick={() => setShowRoleMenu(prev => !prev)}
              title="Switch user role or view profile"
              role="button"
              tabIndex={0}
            >
              <div className="avatar-placeholder">{user?.name ? user.name.charAt(0) : 'D'}</div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Dr. Anurag Sharma'}</span>
                <span className="user-role flex items-center gap-1">
                  <span>{user?.role || 'Principal Investigator'}</span>
                  <ChevronDown size={11} />
                </span>
              </div>
            </div>

            {showRoleMenu && (
              <div className="role-dropdown card" role="menu">
                <div className="role-dropdown-header">
                  <div className="text-xs font-semibold uppercase text-muted">Simulate Role View (RBAC)</div>
                  <div className="text-xs text-secondary mt-1">Switch view to demonstrate multi-stakeholder permissions:</div>
                </div>
                <div className="role-list">
                  {userRolesList.map(r => (
                    <div
                      key={r.id}
                      className={`role-item ${(user?.role || 'Principal Investigator') === r.role ? 'selected' : ''}`}
                      onClick={() => handleSwitchRole(r)}
                      role="menuitem"
                    >
                      <div className="font-semibold text-xs text-primary">{r.role}</div>
                      <div className="text-xs text-muted truncate">{r.name}</div>
                      <div className="text-xs text-secondary mt-0.5" style={{ fontSize: '0.68rem' }}>{r.permissions}</div>
                    </div>
                  ))}
                </div>
                <div className="role-dropdown-footer">
                  <button
                    onClick={handleLogout}
                    className="logout-action-btn"
                  >
                    <LogOut size={14} /> Sign Out of Platform
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
