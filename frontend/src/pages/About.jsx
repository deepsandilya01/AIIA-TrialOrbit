import React from 'react';
import './PublicPages.css';

const About = () => {
  return (
    <div className="public-page">
      <h1 className="page-title">About the CTMS</h1>
      <p className="page-subtitle">Centralized Management for Clinical Research</p>
      
      <div className="about-content card">
        <p>
          The All India Institute of Ayurveda Clinical Trial Management System (CTMS) is designed to provide a centralized interface for managing clinical research activities. This platform facilitates efficient oversight and coordination of complex clinical trials across multiple sites.
        </p>
        
        <h2>Core Capabilities</h2>
        <ul>
          <li><strong>Study Management:</strong> Comprehensive tracking of study lifecycles, from initiation to closure.</li>
          <li><strong>Site Management:</strong> Centralized oversight of all participating research sites, ensuring readiness and compliance.</li>
          <li><strong>Recruitment Monitoring:</strong> Real-time tracking of participant screening, enrollment, and retention metrics.</li>
          <li><strong>Compliance Tracking:</strong> Built-in workflows to monitor IEC, CTRI, and other critical regulatory milestones.</li>
          <li><strong>Safety Monitoring:</strong> Robust recording and monitoring systems for Adverse Events (AE) and Serious Adverse Events (SAE).</li>
          <li><strong>Audit Trails:</strong> Detailed logging of system activities to maintain traceability and data integrity.</li>
        </ul>

        <div className="prototype-disclaimer">
          <strong>Note:</strong> This system is currently deployed as a prototype/demonstration version for academic and assessment purposes (e.g., SIH prototype). All data presented in the public portal is illustrative.
        </div>
      </div>
    </div>
  );
};

export default About;
