import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Header.css'; // Reuse existing styles
import './PublicLayout.css';

const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('ctms-language', lang);
  };

  return (
    <header className="app-header public-header">
      {/* Top Institutional Header - Reuse */}
      <div className="institutional-header">
        <div className="inst-left">
          <div className="emblem-placeholder"></div>
          <div className="inst-text">
            <span className="bold">{t('common.govtOfIndia', 'Government of India')}</span>
            <span>{t('common.ministryOfAyush', 'Ministry of Ayush')}</span>
          </div>
        </div>
        
        <div className="inst-center">
          <div className="logo-placeholder"></div>
          <div className="inst-text center-text">
            <span className="inst-title">{t('auth.aiia', 'All India Institute of Ayurveda')}</span>
            <span className="inst-subtitle">{t('auth.clinicalTrialManagementSystem', 'Clinical Trial Management System')}</span>
            <span className="inst-tagline">{t('auth.tagline', 'An Autonomous Organization under Ministry of Ayush, Govt. of India')}</span>
          </div>
        </div>
        
        <div className="inst-right">
          <div className="badge-placeholder naac">{t('common.naac', 'NAAC')}</div>
          <div className="badge-placeholder g20">{t('common.g20', 'G20')}</div>
        </div>
      </div>

      {/* Nav Header */}
      <div className="nav-header">
        <div className="nav-brand">
          <div className="ctms-logo"></div>
          <span className="ctms-title">AIIA CTMS</span>
        </div>
        
        <nav className="top-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/public-studies" className={location.pathname === '/public-studies' ? 'active' : ''}>Studies</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </nav>
        
        <div className="nav-user">
          <div className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '10px' }}>
            <Globe size={16} />
            <select 
              value={i18n.language || 'en'} 
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
          
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
