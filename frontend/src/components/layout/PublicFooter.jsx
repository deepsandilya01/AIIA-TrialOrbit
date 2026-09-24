import React from 'react';
import { Link } from 'react-router-dom';
import './PublicLayout.css';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>All India Institute of Ayurveda</h3>
          <p>Clinical Trial Management System</p>
          <p className="gov-text">Government of India, Ministry of Ayush</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/public-studies">Studies</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Prototype Notice</h4>
          <p className="prototype-label">Prototype / Demonstration System</p>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
            Not for real patient data or production use.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} All India Institute of Ayurveda. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default PublicFooter;
