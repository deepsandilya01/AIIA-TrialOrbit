import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Award, ExternalLink } from 'lucide-react';
import './PublicLayout.css';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="footer-content">
        <div className="footer-section brand-col">
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="AIIA TrialOrbit" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '50%', backgroundColor: '#ffffff', padding: '3px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }} />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>AIIA TrialOrbit</span>
          </div>
          <p style={{ color: '#dbe3df', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Real-Time Clinical Trial Management & Monitoring Platform (CTMS) designed for institutional Ayurvedic research, multi-centre trials, and regulatory compliance.
          </p>
          <div className="gov-text mt-3">
            <strong>All India Institute of Ayurveda (AIIA)</strong><br />
            An Autonomous Institution under Ministry of Ayush, Government of India<br />
            Mathura Road, Gautampuri, Sarita Vihar, New Delhi - 110076
          </div>
        </div>

        <div className="footer-section">
          <h4>Platform Modules</h4>
          <ul>
            <li><Link to="/login">Protocol Lifecycle Workspace</Link></li>
            <li><Link to="/roadmap">Product Roadmap</Link></li>
            <li><Link to="/login">Recruitment Velocity Analytics</Link></li>
            <li><Link to="/login">Safety & Pharmacovigilance (AE/SAE)</Link></li>
            <li><Link to="/login">Institutional Ethics & CTRI Milestones</Link></li>
            <li><Link to="/login">CFR 21 Part 11 Electronic Audit Log</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Institutional Links</h4>
          <ul>
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/roadmap">Product Roadmap</Link></li>
            <li><Link to="/about">About AIIA CTMS</Link></li>
            <li><Link to="/contact">Support & Investigator Helpdesk</Link></li>
            <li><Link to="/register">Investigator Registration</Link></li>
            <li><Link to="/login">Investigator Portal Sign In</Link></li>
          </ul>
        </div>

        <div className="footer-section compliance-col">
          <h4>Regulatory Standards</h4>
          <div className="compliance-badges">
            <span className="prototype-label">ICH-GCP E6 (R2) Principles</span>
            <span className="prototype-label">CDSCO New Drugs & CT Rules</span>
            <span className="prototype-label">Ayush Health Grid Interoperable</span>
            <span className="prototype-label">21 CFR Part 11 Audit Integrity</span>
          </div>
          <div className="mt-3" style={{ fontSize: '0.75rem', color: '#9cb1bf', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
            <span className="flex items-center gap-1 font-semibold text-warning mb-1">
              <Database size={12} /> Demonstration Environment Notice
            </span>
            Deployed for demonstration and academic evaluation purposes. All data displayed is synthetic or de-identified.
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', padding: '5px 16px', borderRadius: '20px', fontSize: '0.82rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>Project: <strong style={{ color: '#ffffff' }}>AIIA TrialOrbit</strong></span>
            <span style={{ color: 'var(--accent-color)' }}>•</span>
            <span>Designed & Developed by <strong style={{ color: '#38bdf8' }}>Team AsyncOrbit</strong></span>
            <span style={{ color: 'var(--accent-color)' }}>•</span>
            <span style={{ color: '#ffd166', fontWeight: 700 }}>Smart India Hackathon 2026 (SIH 2026)</span>
          </div>
          <p>&copy; {new Date().getFullYear()} AIIA TrialOrbit — All India Institute of Ayurveda (AIIA), Ministry of Ayush, Govt. of India. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/about">System Architecture & Credits</Link> •
            <Link to="/contact">Contact Administration</Link> •
            <span>  Smart India Hackathon 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
