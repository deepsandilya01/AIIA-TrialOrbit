import React from 'react';
import { 
  Map, CheckCircle, Clock, AlertTriangle, Lightbulb, ChevronRight
} from 'lucide-react';
import './Roadmap.css';

const LIVE_FEATURES = [
  { title: 'Role-Based Clinical Trial Management', desc: 'Secure 7-role access control for all operations.' },
  { title: 'Study & Site Management', desc: 'Hierarchical multi-site tracking and portfolio monitoring.' },
  { title: 'Participant & Recruitment Tracking', desc: 'Secure demographic and consent records.' },
  { title: 'Data Queries & Protocol Deviations', desc: 'End-to-end discrepancy and compliance management.' },
  { title: 'AE/SAE Safety Tracking', desc: 'Real-time safety events with 24-hour regulatory countdowns.' },
  { title: 'Real-Time Alerts & Socket.IO Updates', desc: 'Instant UI updates and live socket emissions.' },
  { title: 'Role-Based Dashboards', desc: 'Tailored KPIs and insights for 7 distinct user scopes.' },
  { title: 'Responsive Web Experience', desc: 'Mobile-friendly UI down to 320px breakpoints.' },
  { title: 'AI-Assisted Operational Risk Intelligence', desc: 'Data-driven operational risk signals across enrollment, sites, data quality, protocol deviations, safety and regulatory milestones.' },
  { title: 'Mistral AI Explanation Layer', desc: 'Structured AI-assisted explanations generated from sanitized deterministic TrialOrbit risk data.' }
];

const PARTIAL_FEATURES = [
  { title: 'CDISC Export & Mapping', desc: 'Foundational mapping for SDTM/ADaM, full certification pending.' },
  { title: 'FHIR Interoperability', desc: 'Basic FHIR R4 JSON export engine implemented, live EHR sync pending.' }
];

const UPCOMING_FEATURES = [
  { 
    title: 'CRF / eCRF Data Capture', 
    desc: 'Structured digital case-report forms for standardized clinical data capture.',
    benefit: 'Reduces transcription errors and supports complex branching logic.'
  },
  { 
    title: 'Structured Vitals & Laboratory Data', 
    desc: 'Native data points for clinical vitals and lab panels.',
    benefit: 'Eliminates flat-file data silos.'
  },
  { 
    title: 'Randomization & Study Arms', 
    desc: 'Automated subject assignment to treatment groups.',
    benefit: 'Maintains blinding and reduces bias.'
  },
  { 
    title: 'MedDRA & WHO Drug Integration', 
    desc: 'Standardized safety and medication coding dictionary lookups.',
    benefit: 'Ensures global regulatory compatibility.'
  },
  { 
    title: 'Advanced Data Quality & Analytics', 
    desc: 'Detect missing, inconsistent, or statistically anomalous clinical data.',
    benefit: 'Improves source data verification efficiency.'
  },
  { 
    title: 'FHIR Resource Expansion', 
    desc: 'Expanded live interoperability with Hospital Information Systems.',
    benefit: 'Prevents dual-data entry.'
  }
];

const FUTURE_FEATURES = [
  'Define-XML Generation',
  'ADaM Statistical Generation',
  'ABDM Interoperability (India)',
  'Advanced Predictive Safety Signal Detection',
  'Production-grade Compliance Hardening (21 CFR Part 11)'
];

const Roadmap = () => {
  return (
    <div className="roadmap-page">
      <div className="roadmap-hero">
        <div className="container">
          <div className="roadmap-hero-icon">
            <Map size={48} className="text-primary" />
          </div>
          <h1>TrialOrbit Product Roadmap</h1>
          <p className="subtitle">
            Explore the capabilities available today and the clinical-research features planned for upcoming releases.
          </p>
        </div>
      </div>

      <div className="roadmap-content">
        
        {/* LIVE NOW */}
        <section className="roadmap-section">
          <div className="roadmap-section-header">
            <CheckCircle size={28} className="text-success" />
            <h2>LIVE NOW</h2>
          </div>
          <p className="roadmap-section-desc">These MVP-1 capabilities are fully implemented and verified.</p>
          <div className="roadmap-grid cols-3">
            {LIVE_FEATURES.map((feat, i) => (
              <div key={i} className="roadmap-card border-top-success hover-lift">
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARTIALLY AVAILABLE */}
        <section className="roadmap-section">
          <div className="roadmap-section-header">
            <AlertTriangle size={28} className="text-warning" />
            <h2>PARTIALLY AVAILABLE</h2>
          </div>
          <p className="roadmap-section-desc">Core foundations are implemented, full specification compliance is pending.</p>
          <div className="roadmap-grid cols-3">
            {PARTIAL_FEATURES.map((feat, i) => (
              <div key={i} className="roadmap-card border-top-warning hover-lift">
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMING SOON - MVP-2 */}
        <section className="roadmap-section">
          <div className="roadmap-section-header">
            <Clock size={28} className="text-primary" />
            <h2>COMING SOON — MVP-2</h2>
          </div>
          <p className="roadmap-section-desc">High-priority clinical data and safety features scheduled for the next release.</p>
          <div className="roadmap-grid cols-2">
            {UPCOMING_FEATURES.map((feat, i) => (
              <div key={i} className="roadmap-card roadmap-card-large border-left-primary hover-lift">
                <h3 className="text-primary">{feat.title}</h3>
                <p>{feat.desc}</p>
                <div className="roadmap-card-footer">
                  <span className="roadmap-card-label">Why it matters</span>
                  <span className="roadmap-card-benefit">{feat.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FUTURE / ADVANCED */}
        <section className="roadmap-section">
          <div className="roadmap-section-header muted">
            <Lightbulb size={28} className="text-muted" />
            <h2>FUTURE / ADVANCED</h2>
          </div>
          <div className="roadmap-list-card">
            <ul className="roadmap-list">
              {FUTURE_FEATURES.map((feat, i) => (
                <li key={i}>
                  <ChevronRight size={18} className="roadmap-list-icon" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Roadmap;
