import React from 'react';
import { ShieldCheck, Award, Server, Database, Globe, CheckCircle2 } from 'lucide-react';
import DemoBadge from '../components/common/DemoBadge';
import './PublicPages.css';

const About = () => {
  return (
    <div className="public-page">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="page-title">About AIIA TrialOrbit</h1>
        <DemoBadge />
      </div>
      <p className="page-subtitle">
        Real-Time Clinical Trial Management & Pharmacovigilance Platform for Evidence-Based Ayurveda
      </p>
      
      <div className="card p-5 mb-4">
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.85rem' }}>Institutional Mandate</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          The All India Institute of Ayurveda (AIIA), an autonomous apex institute under the Ministry of Ayush, Government of India, conducts cutting-edge interventional and observational clinical trials to validate traditional Ayurvedic formulations and integrative therapies using contemporary scientific rigor.
        </p>
        <p style={{ lineHeight: '1.6' }}>
          <strong>AIIA TrialOrbit</strong> is the dedicated, real-time Clinical Trial Management System (CTMS) designed to unify multi-centre research sites, automate regulatory compliance checkpoints (IEC, CTRI, CDSCO), track participant safety with 24-hour expedited SAE reporting, and provide immutable audit trails under 21 CFR Part 11 guidelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} className="text-primary" />
            <h3 style={{ fontSize: '1rem' }}>ICH-GCP E6 (R2) Principles</h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            All clinical workflow schemas adhere strictly to Good Clinical Practice guidelines ensuring participant rights, safety, and credible evidence generation.
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server size={20} className="text-primary" />
            <h3 style={{ fontSize: '1rem' }}>Ayush Health Grid Standards</h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Interoperable terminology mapping with NAMASTE portal codes, ICD-11 traditional medicine module, and ABDM national health record specifications.
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={20} className="text-primary" />
            <h3 style={{ fontSize: '1rem' }}>21 CFR Part 11 Compliance</h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Electronic records and signatures with timestamped, append-only audit tracking to ensure non-repudiation and data integrity across trial lifecycles.
          </p>
        </div>
      </div>

      <div className="card p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(21, 102, 88, 0.08) 0%, rgba(197, 155, 63, 0.12) 100%)', border: '1px solid rgba(197, 155, 63, 0.35)', borderRadius: 'var(--border-radius-md)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Award size={20} className="text-warning" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Smart India Hackathon 2026 (SIH 2026) Initiative</h3>
        </div>
        <p className="text-sm text-secondary leading-relaxed">
          <strong>AIIA TrialOrbit</strong> is developed for <strong>Smart India Hackathon 2026</strong> under the problem statement issued by the <strong>Ministry of Ayush</strong> for the <strong>All India Institute of Ayurveda (AIIA)</strong>. It provides an institutional control room for multi-centre Ayurvedic clinical trials, real-time safety surveillance, and 21 CFR Part 11 compliance.
        </p>
      </div>

      <div className="card p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-color)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Database size={16} className="text-warning" />
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Demonstration & Evaluation Notice</h4>
        </div>
        <p className="text-xs text-secondary">
          This deployment represents the demonstration prototype for assessment purposes. All data presented in the public portal and authenticated workspace is synthetic or de-identified demo data. No actual protected patient health information (PHI) is processed on this demo instance.
        </p>
      </div>
    </div>
  );
};

export default About;
