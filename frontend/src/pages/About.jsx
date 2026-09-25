import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Server, 
  Database, 
  Globe, 
  CheckCircle2, 
  Lock, 
  Activity, 
  FileCheck, 
  Building2, 
  Sparkles, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import DemoBadge from '../components/common/DemoBadge';
import './PublicPages.css';

const About = () => {
  return (
    <div className="public-page">
      {/* 1. Apex Hero Header */}
      <section className="about-hero">
        <div className="about-eyebrow">
          <span className="about-badge-gov">
            <Building2 size={13} />
            Ministry of Ayush • Govt. of India
          </span>
          <DemoBadge text="Apex CTMS Platform" />
        </div>

        <h1 className="about-title">About AIIA TrialOrbit</h1>
        <p className="about-lead">
          The Centralized Real-Time Clinical Trial Management System (CTMS) & Pharmacovigilance Control Room 
          designed to accelerate evidence-based Ayurvedic research across India with uncompromising regulatory compliance.
        </p>

        <div className="about-stats-ribbon">
          <div className="about-stat-item">
            <span className="about-stat-num">18+</span>
            <span className="about-stat-label">Active Research Protocols</span>
            <span className="about-stat-sub">Phase I–IV & Observational</span>
          </div>

          <div className="about-stat-item">
            <span className="about-stat-num">42</span>
            <span className="about-stat-label">Participating Sites</span>
            <span className="about-stat-sub">AIIA & Partner Institutes</span>
          </div>

          <div className="about-stat-item">
            <span className="about-stat-num">100%</span>
            <span className="about-stat-label">21 CFR Part 11 Compliant</span>
            <span className="about-stat-sub">Tamper-Evident Audit Trail</span>
          </div>

          <div className="about-stat-item">
            <span className="about-stat-num">&lt; 24h</span>
            <span className="about-stat-label">Expedited SAE Escalation</span>
            <span className="about-stat-sub">CDSCO / IEC Safety SLA</span>
          </div>
        </div>
      </section>

      {/* 2. Institutional Mandate */}
      <div className="about-mandate-card">
        <h3>
          <Award className="text-primary" size={24} />
          Institutional Mandate of AIIA
        </h3>
        <p>
          The <strong>All India Institute of Ayurveda (AIIA)</strong>, an autonomous apex institute under the 
          <strong> Ministry of Ayush, Government of India</strong>, is dedicated to bridging the timeless wisdom 
          of Ayurveda with contemporary scientific validation and clinical methodology.
        </p>
        <p>
          As clinical studies expand across multiple tertiary centers, the need for a unified digital control room 
          became paramount. <strong>AIIA TrialOrbit</strong> serves as the central technological backbone that unifies 
          protocol lifecycle management, electronic case report forms (eCRF), real-time safety surveillance (AE/SAE), 
          and regulatory governance into a single secure platform.
        </p>
      </div>

      {/* 3. Core Clinical Governance Pillars */}
      <div className="about-section-heading">
        <h2>Four Pillars of Clinical Integrity</h2>
        <p>Built from the ground up to satisfy both national and international clinical research standards.</p>
      </div>

      <div className="about-pillars-grid">
        <div className="about-pillar-card">
          <div className="about-pillar-icon">
            <Award size={22} />
          </div>
          <h3>ICH-GCP E6 (R2) Principles</h3>
          <p>
            Enforces strict Good Clinical Practice workflows. Ensures informed consent verification, 
            investigator site qualification, and standardized source data verification (SDV).
          </p>
        </div>

        <div className="about-pillar-card">
          <div className="about-pillar-icon">
            <Lock size={22} />
          </div>
          <h3>21 CFR Part 11 Electronic Records</h3>
          <p>
            Immutable, append-only cryptographic audit logs for every clinical data modification. 
            Role-based digital signatures ensure non-repudiation and complete forensic traceability.
          </p>
        </div>

        <div className="about-pillar-card">
          <div className="about-pillar-icon">
            <Server size={22} />
          </div>
          <h3>Ayush Health Grid Interoperability</h3>
          <p>
            Standardized data dictionaries mapped with National Ayush Morbidity and Standardized Terminologies 
            Electronic (NAMASTE) codes, ICD-11 Traditional Medicine Module 2, and ABDM specs.
          </p>
        </div>

        <div className="about-pillar-card">
          <div className="about-pillar-icon">
            <Activity size={22} />
          </div>
          <h3>Expedited Pharmacovigilance (PvPI)</h3>
          <p>
            Automated CTCAE v5.0 severity grading and automated 24-hour expedited SAE dispatch workflows 
            to ensure participant safety and meet CDSCO timeline mandates.
          </p>
        </div>
      </div>

      {/* 4. Smart India Hackathon 2026 Card */}
      <div className="about-sih-card">
        <h3>
          <Sparkles className="text-warning" size={22} />
          Smart India Hackathon 2026 (SIH 2026) Initiative
        </h3>
        <p>
          <strong>AIIA TrialOrbit</strong> is conceived and architected for <strong>Smart India Hackathon 2026</strong> 
          to address the problem statement issued by the <strong>Ministry of Ayush</strong> for the 
          <strong> All India Institute of Ayurveda</strong>.
        </p>
        <p>
          The system was designed and developed by <strong>Team AsyncOrbit</strong>, demonstrating how modern web 
          architecture, role-based workflows, and real-time surveillance can modernize clinical trials across India.
        </p>
      </div>

      {/* 5. Control Room Action CTA */}
      <div className="about-cta-box">
        <div className="about-cta-content">
          <h3>Ready to Explore the Clinical Control Room?</h3>
          <p>
            Log in to evaluate active trials, monitor multi-site compliance, or register as a participating clinical research site.
          </p>
        </div>
        <div className="about-cta-actions">
          <Link to="/login" className="about-btn-primary">
            Access Control Room <ArrowRight size={16} />
          </Link>
          <Link to="/register" className="about-btn-secondary">
            Investigator Registration
          </Link>
        </div>
      </div>

      {/* 6. Evaluation Notice */}
      <div className="about-notice-card">
        <h4>
          <Database size={16} className="text-warning" />
          Demonstration & Evaluation Notice
        </h4>
        <p>
          This deployment represents the demonstration prototype for assessment purposes during SIH 2026. 
          All data presented in the public portal and authenticated workspace is synthetic or de-identified demo data. 
          No actual protected patient health information (PHI) is processed on this demo instance.
        </p>
      </div>
    </div>
  );
};

export default About;
