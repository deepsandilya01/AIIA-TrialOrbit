import { Bell, ChevronDown, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('ctms-language', lang);
  };

  return (
    <header className="app-header">
      {/* Top Institutional Header */}
      <div className="institutional-header">
        <div className="inst-left">
          <div className="emblem-placeholder"></div>
          <div className="inst-text">
            <span className="bold">{t('common.govtOfIndia')}</span>
            <span>{t('common.ministryOfAyush')}</span>
          </div>
        </div>
        
        <div className="inst-center">
          <div className="logo-placeholder"></div>
          <div className="inst-text center-text">
            <span className="inst-title">{t('auth.aiia')}</span>
            <span className="inst-subtitle">{t('auth.allIndiaInstitute')}</span>
            <span className="inst-tagline">{t('auth.tagline')}</span>
          </div>
        </div>
        
        <div className="inst-right">
          <div className="badge-placeholder naac">{t('common.naac')}</div>
          <div className="badge-placeholder g20">{t('common.g20')}</div>
        </div>
      </div>

      {/* Nav Header */}
      <div className="nav-header">
        <div className="nav-brand">
          <div className="ctms-logo"></div>
          <span className="ctms-title">AIIA CTMS</span>
        </div>
        
        <nav className="top-nav">
          <a href="/" className="active">{t('general.home')}</a>
          <a href="/studies">{t('general.studies')}</a>
          <a href="/sites">{t('general.sites')}</a>
          <a href="/recruitment">{t('general.participants')}</a>
          <a href="/recruitment">{t('general.recruitment')}</a>
          <a href="/compliance">{t('general.compliance')}</a>
          <a href="/safety">{t('general.aeSae')}</a>
          <a href="/alerts">{t('general.reports')}</a>
          <a href="/audit">{t('general.auditTrail')}</a>
        </nav>
        
        <div className="nav-user">
          <div className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '10px' }}>
            <Globe size={16} />
            <select 
              value={i18n.language} 
              onChange={changeLanguage}
              style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer', outline: 'none' }}
            >
              <option value="en" style={{ color: 'black' }}>EN</option>
              <option value="hi" style={{ color: 'black' }}>हिन्दी</option>
            </select>
          </div>
          <button 
            className="icon-btn theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button className="icon-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          <div className="user-profile">
            <div className="avatar-placeholder">AS</div>
            <div className="user-info">
              <span className="user-name">Dr. Anurag Sharma</span>
              <span className="user-role">Principal Investigator</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
