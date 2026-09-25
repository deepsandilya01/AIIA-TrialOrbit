import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Globe, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Header.css';
import './PublicLayout.css';

const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('ctms-language', lang);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#capabilities', label: 'Platform' },
    { to: '/#lifecycle', label: 'Lifecycle' },
    { to: '/public-studies', label: 'Studies' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (e, link) => {
    if (link.to.includes('#')) {
      const [path, hash] = link.to.split('#');
      if (location.pathname === path || (path === '/' && (location.pathname === '/' || location.pathname === ''))) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', link.to);
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-header public-header">
      {/* Top Institutional Header */}
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

      {/* Public Nav Header */}
      <div className="nav-header">
        <div className="nav-left">
          <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="AIIA TrialOrbit Logo" className="ctms-logo-img" />
            <div className="flex flex-col">
              <span className="ctms-title">AIIA TrialOrbit</span>
              <span className="ctms-edition">Clinical Research CTMS</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="top-nav desktop-only-nav" aria-label="Main Navigation">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              onClick={(e) => handleNavClick(e, link)}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-user">
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

          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link to="/login" className="login-button">
            Login to CTMS
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            className="icon-btn public-mobile-toggle"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="public-mobile-drawer">
          <div className="public-drawer-links">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                onClick={(e) => handleNavClick(e, link)}
                className={`drawer-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="drawer-footer-action flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full justify-center"
              >
                Access CTMS Control Room &rarr;
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline w-full justify-center"
              >
                Register as Investigator
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
