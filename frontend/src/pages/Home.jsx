import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, MapPin, Users, CheckCircle2, AlertTriangle, ShieldCheck,
  ArrowRight, Sparkles, Building2, FileCheck, Clock, Award,
  ChevronRight, Database, Play, Lock, Globe, Server
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from '../components/common/Preloader';
import DemoBadge from '../components/common/DemoBadge';
import StatusBadge from '../components/common/StatusBadge';
import './PublicPages.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const lifecycleRef = useRef(null);
  const mockupRef = useRef(null);

  const handlePreloaderFinish = () => {
    setShowPreloader(false);
  };

  useEffect(() => {
    if (showPreloader) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-eyebrow', { opacity: 0, y: 15, duration: 0.5 })
        .from('.hero-title', { opacity: 0, y: 25, duration: 0.7 }, '-=0.3')
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero-actions', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
        .from('.hero-image-wrapper', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3');

      // Stats Count-Up / Reveal
      gsap.from('.stat-card-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 25,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Capabilities Cards Stagger
      gsap.from('.capability-card', {
        scrollTrigger: {
          trigger: capabilitiesRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Lifecycle Steps Stagger
      gsap.from('.lifecycle-step', {
        scrollTrigger: {
          trigger: lifecycleRef.current,
          start: 'top 88%',
        },
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    return () => ctx.revert();
  }, [showPreloader]);

  return (
    <div className="home-container">
      {showPreloader && <Preloader onFinish={handlePreloaderFinish} />}

      {/* 1. HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-text-column">
            <div className="hero-eyebrow">
              <img 
                src="/logo.png" 
                alt="AIIA TrialOrbit" 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  objectFit: 'contain', 
                  borderRadius: '50%', 
                  backgroundColor: '#ffffff', 
                  padding: '2px', 
                }} 
              />
              <span className="eyebrow-badge">
                <span>AIIA TrialOrbit • SIH 2026</span>
              </span>
              <span className="eyebrow-inst">Ministry of Ayush</span>
            </div>

            <h1 className="hero-title">
              A Real-Time Control Room for Clinical Trials
            </h1>

            <p className="hero-subtitle">
              From study protocol setup to safety surveillance & regulatory monitoring — one centralized, institutional CTMS for evidence-based Ayurvedic research.
            </p>

            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Explore Dashboard &rarr;
              </Link>
              <a href="#how-it-works" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                View How It Works
              </a>
            </div>
          </div>

          <div className="hero-image-column">
            <div className="hero-image-wrapper">
              <div className="hero-image-glow"></div>
              <img src="/clinical-ayurveda.jpg" alt="Clinical Ayurveda Research" className="hero-main-img" />
              
              <div className="hero-floating-pills">
                <div className="floating-pill card">
                  <span className="pill-icon text-primary"><CheckCircle2 size={18} /></span>
                  <div className="pill-content">
                    <strong>Evidence-Based</strong>
                    <span>Ayurvedic Research</span>
                  </div>
                </div>
                <div className="floating-pill card" style={{ animationDelay: '0.2s', marginLeft: '-20px' }}>
                  <span className="pill-icon text-primary"><ShieldCheck size={18} /></span>
                  <div className="pill-content">
                    <strong>Regulatory Compliant</strong>
                    <span>CDSCO & GCP Standards</span>
                  </div>
                </div>
                <div className="floating-pill card" style={{ animationDelay: '0.4s', marginLeft: '-40px' }}>
                  <span className="pill-icon text-primary"><Activity size={18} /></span>
                  <div className="pill-content">
                    <strong>Real-Time Monitoring</strong>
                    <span>Live Subject Surveillance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive CTMS Control Room Mockup Preview */}
      <div className="hero-mockup-wrapper">
        <div className="mockup-frame card" style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 20px 40px rgba(13,61,52,0.15)', overflow: 'hidden', border: '1px solid rgba(13,61,52,0.1)' }}>
          <div className="mockup-topbar">
            <div className="mockup-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="mockup-address" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="AIIA" style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '50%', backgroundColor: '#fff' }} />
              <span>trialorbit.aiia.gov.in/control-room</span>
            </div>
            <div className="mockup-status">
              <span className="pulse-indicator"></span>
              <span>LIVE SURVEILLANCE</span>
            </div>
          </div>

          <div className="mockup-body">
            <div className="mockup-kpis">
              <div className="mini-kpi">
                <span className="label">ACTIVE STUDIES</span>
                <span className="val">18 Protocols</span>
                <span className="trend positive">↑ 100% IEC Cleared</span>
              </div>
              <div className="mini-kpi">
                <span className="label">RESEARCH SITES</span>
                <span className="val">42 Centres</span>
                <span className="trend positive">All-India Network</span>
              </div>
              <div className="mini-kpi">
                <span className="label">COHORT ENROLLED</span>
                <span className="val">1,240 Subjects</span>
                <span className="trend positive">67% Screening Ratio</span>
              </div>
              <div className="mini-kpi">
                <span className="label">SAFETY REVIEWS</span>
                <span className="val">2 Expedited</span>
                <span className="trend alert">24h CDSCO Rule</span>
              </div>
            </div>

            <div className="mockup-preview-row">
              <div className="mockup-chart-box">
                <div className="mockup-box-title">Recruitment Trajectory vs Target Protocol</div>
                <div className="mockup-fake-chart">
                  <div className="fake-bar" style={{ height: '35%' }}><span>Jan</span></div>
                  <div className="fake-bar" style={{ height: '48%' }}><span>Feb</span></div>
                  <div className="fake-bar" style={{ height: '62%' }}><span>Mar</span></div>
                  <div className="fake-bar" style={{ height: '75%' }}><span>Apr</span></div>
                  <div className="fake-bar active" style={{ height: '90%' }}><span>May</span></div>
                </div>
              </div>

              <div className="mockup-alerts-box">
                <div className="mockup-box-title">Surveillance Signals</div>
                <div className="fake-alert-item danger">
                  <span className="alert-badge">SAE-204</span>
                  <span className="alert-text">Hospitalization reported; 24h PV review triggered</span>
                </div>
                <div className="fake-alert-item warning">
                  <span className="alert-badge">CTRI-005</span>
                  <span className="alert-text">6-Month trial progress report due in 4 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME STATS SECTION */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-container">
          <div className="stat-card-item">
            <div className="stat-number">18</div>
            <div className="stat-label">Active Research Studies</div>
            <div className="stat-sub">Phase I–IV & Observational</div>
          </div>
          <div className="stat-card-item">
            <div className="stat-number">42</div>
            <div className="stat-label">Participating Sites</div>
            <div className="stat-sub">AIIA & Partner Institutes</div>
          </div>
          <div className="stat-card-item">
            <div className="stat-number">1,240</div>
            <div className="stat-label">Enrolled Participants</div>
            <div className="stat-sub">Strict Inclusion/Exclusion</div>
          </div>
          <div className="stat-card-item">
            <div className="stat-number">92.4%</div>
            <div className="stat-label">Protocol Compliance</div>
            <div className="stat-sub">ICH-GCP E6 (R2) Audit Score</div>
          </div>
        </div>
        <div className="stats-footer-note">
          <DemoBadge text="Demonstration Platform • Synthetic Data Mode" />
        </div>
      </section>

      {/* 3. CORE PLATFORM CAPABILITIES */}
      <section className="features-section" id="capabilities" ref={capabilitiesRef}>
        <div className="section-header-centered">
          <span className="section-pill">Enterprise CTMS Suite</span>
          <h2 className="section-title">Comprehensive Clinical Research Capabilities</h2>
          <p className="section-subtitle">
            Designed specifically for multi-centre Ayurvedic clinical trials, botanical drug standardization, and regulatory oversight.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card capability-card card">
            <div className="feature-icon-wrapper">
              <Activity className="feature-icon" />
            </div>
            <h3>Study Protocol Lifecycle</h3>
            <p>Comprehensive tracking of study initiation, ethics amendments, visit schedules, and clinical study report (CSR) milestones.</p>
            <div className="feature-tags">
              <span>Phase I–IV</span>
              <span>eCRF Ready</span>
            </div>
          </div>

          <div className="feature-card capability-card card">
            <div className="feature-icon-wrapper">
              <MapPin className="feature-icon" />
            </div>
            <h3>Multi-Centre Site Governance</h3>
            <p>Manage site initiation visits, GCP investigator credentials, source data verification (SDV) status, and site performance scores.</p>
            <div className="feature-tags">
              <span>GCP Readiness</span>
              <span>CRA Visits</span>
            </div>
          </div>

          <div className="feature-card capability-card card">
            <div className="feature-icon-wrapper">
              <Users className="feature-icon" />
            </div>
            <h3>Participant & Visit Tracking</h3>
            <p>Monitor participant screening velocity, informed consent versioning, window compliance, and cohort attrition in real time.</p>
            <div className="feature-tags">
              <span>Cohort Curves</span>
              <span>Retention Risk</span>
            </div>
          </div>

          <div className="feature-card capability-card card">
            <div className="feature-icon-wrapper">
              <CheckCircle2 className="feature-icon" />
            </div>
            <h3>Regulatory & CTRI Milestones</h3>
            <p>Track Institutional Ethics Committee (IEC) clearance, CTRI registry updates, and CDSCO submission horizons with automated reminders.</p>
            <div className="feature-tags">
              <span>IEC Workflows</span>
              <span>CTRI Sync</span>
            </div>
          </div>

          <div className="feature-card capability-card card">
            <div className="feature-icon-wrapper">
              <AlertTriangle className="feature-icon text-danger" />
            </div>
            <h3>Safety & Pharmacovigilance</h3>
            <p>Document Adverse Events (AE) and expedite Serious Adverse Events (SAE) with 24-hour statutory notification alerts and CIOMS exports.</p>
            <div className="feature-tags">
              <span>24h Mandate</span>
              <span>MedDRA Coded</span>
            </div>
          </div>

          <div className="feature-card capability-card card">
            <div className="feature-icon-wrapper">
              <ShieldCheck className="feature-icon" />
            </div>
            <h3>CFR 21 Part 11 Audit Trail</h3>
            <p>Immutable chronological logging of all electronic data captures, user roles, changes, and electronic signature confirmations.</p>
            <div className="feature-tags">
              <span>Tamper-evident</span>
              <span>CSV Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLINICAL TRIAL LIFECYCLE */}
      <section className="lifecycle-section" id="lifecycle" ref={lifecycleRef}>
        <div className="section-header-centered">
          <span className="section-pill">Clinical Workflow</span>
          <h2 className="section-title">The Clinical Trial Lifecycle in TrialOrbit</h2>
          <p className="section-subtitle">
            From initial protocol formulation to closeout and archival, every step maintains regulatory auditability.
          </p>
        </div>

        <div className="lifecycle-grid">
          <div className="lifecycle-step card">
            <div className="lifecycle-num">01</div>
            <h4>Protocol Setup & IEC</h4>
            <p>Define objective criteria, upload protocol v1.0, and track Institutional Ethics Committee clearance.</p>
          </div>

          <div className="lifecycle-step card">
            <div className="lifecycle-num">02</div>
            <h4>Site Activation</h4>
            <p>Onboard investigator facilities, complete GCP training, and establish local lab reference ranges.</p>
          </div>

          <div className="lifecycle-step card">
            <div className="lifecycle-num">03</div>
            <h4>Screen & Enroll</h4>
            <p>Screen participant eligibility, execute bilingual informed consent, and record baseline parameters.</p>
          </div>

          <div className="lifecycle-step card">
            <div className="lifecycle-num">04</div>
            <h4>Active Surveillance</h4>
            <p>Monitor visit adherence, verify source data, detect deviations, and handle safety events.</p>
          </div>

          <div className="lifecycle-step card">
            <div className="lifecycle-num">05</div>
            <h4>Closeout & Report</h4>
            <p>Lock electronic database, generate CIOMS/GCP summary dossiers, and archive compliant records.</p>
          </div>
        </div>
      </section>

      {/* 5. MONITOR -> IDENTIFY -> ACT SURVEILLANCE ENGINE */}
      <section className="monitoring-engine-section" id="how-it-works">
        <div className="engine-container card">
          <div className="engine-header">
            <div>
              <span className="badge badge-primary mb-2">Real-Time Surveillance Engine</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                MONITOR → IDENTIFY → ACT
              </h3>
              <p className="text-secondary text-sm">
                How TrialOrbit empowers Principal Investigators, CRAs, and Ayush administrators to maintain zero-compromise trial safety:
              </p>
            </div>
            <Link to="/login" className="btn btn-outline btn-sm">
              Live Demo &rarr;
            </Link>
          </div>

          <div className="engine-steps-grid">
            <div className="engine-box">
              <div className="engine-box-badge monitor">1. MONITOR</div>
              <h4>Continuous Data Ingestion</h4>
              <p>Continuous monitoring across recruitment velocity, lab report uploads, and visit window compliance across all 42 sites.</p>
            </div>
            <div className="engine-box">
              <div className="engine-box-badge identify">2. IDENTIFY</div>
              <h4>Automated Anomaly Detection</h4>
              <p>Algorithms flag out-of-range safety biomarkers, protocol deviations, and delayed 6-month CTRI regulatory milestones.</p>
            </div>
            <div className="engine-box">
              <div className="engine-box-badge act">3. ACT</div>
              <h4>Expedited Clinical Action</h4>
              <p>Instant notification triggers to site investigators and 24-hour pharmacovigilance escalation workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTEROPERABILITY & STANDARDS */}
      <section className="standards-section">
        <div className="section-header-centered">
          <span className="section-pill">Interoperability & Architecture</span>
          <h2 className="section-title">Built for Modern Institutional Health Ecosystems</h2>
          <p className="section-subtitle">
            Seamlessly bridging traditional Ayurvedic scientific validation with national digital health standards.
          </p>
        </div>

        <div className="standards-grid">
          <div className="standard-item card">
            <Server className="standard-icon" />
            <h4>Ayush Health Grid Ready</h4>
            <p>Designed for alignment with the Ministry of Ayush digital health infrastructure and NAMASTE portal terminologies.</p>
          </div>
          <div className="standard-item card">
            <Globe className="standard-icon" />
            <h4>CTRI Registry Compatibility</h4>
            <p>Structured schema compatible with ICMR Clinical Trials Registry-India electronic filing parameters.</p>
          </div>
          <div className="standard-item card">
            <Lock className="standard-icon" />
            <h4>21 CFR Part 11 Architecture</h4>
            <p>Cryptographic hash chaining, role-gated access control, and electronic audit trails ensuring record non-repudiation.</p>
          </div>
        </div>
      </section>

      {/* 7. ROLE-BASED ACCESS CONTROL (RBAC) */}
      <section className="rbac-section">
        <div className="section-header-centered">
          <span className="section-pill">Security & Governance</span>
          <h2 className="section-title">Stakeholder Role-Based Experience</h2>
          <p className="section-subtitle">
            Every clinical participant and supervisor sees precisely what their regulatory scope allows.
          </p>
        </div>

        <div className="rbac-grid">
          <div className="rbac-card card">
            <div className="rbac-role-title">Principal Investigator (PI)</div>
            <p className="rbac-role-desc">Study and clinical oversight.</p>
            <div className="rbac-perms">Study oversight • Recruitment monitoring • Query/deviation review • Safety review</div>
          </div>
          <div className="rbac-card card">
            <div className="rbac-role-title">Study Coordinator</div>
            <p className="rbac-role-desc">Day-to-day study operations.</p>
            <div className="rbac-perms">Participant management • Consent tracking • Visit management • Query resolution</div>
          </div>
          <div className="rbac-card card">
            <div className="rbac-role-title">Clinical Monitor (CRA)</div>
            <p className="rbac-role-desc">Monitoring and data-quality oversight.</p>
            <div className="rbac-perms">Data queries • Protocol deviations • Site monitoring info</div>
          </div>
          <div className="rbac-card card">
            <div className="rbac-role-title">Pharmacovigilance Officer</div>
            <p className="rbac-role-desc">Safety oversight.</p>
            <div className="rbac-perms">AE/SAE management • Reporting deadline tracking</div>
          </div>
          <div className="rbac-card card">
            <div className="rbac-role-title">Ethics Committee</div>
            <p className="rbac-role-desc">Ethics and regulatory oversight.</p>
            <div className="rbac-perms">Ethics/regulatory information • Milestone review • Compliance visibility</div>
          </div>
          <div className="rbac-card card">
            <div className="rbac-role-title">Administration (ADMIN)</div>
            <p className="rbac-role-desc">Institutional/system administration.</p>
            <div className="rbac-perms">User administration • System-level oversight • Access management</div>
          </div>
          <div className="rbac-card card">
            <div className="rbac-role-title">Regulator</div>
            <p className="rbac-role-desc">Read-only regulatory oversight. Regulator access is read-only.</p>
            <div className="rbac-perms">Compliance visibility • Regulatory milestones • Audit information</div>
          </div>
        </div>
      </section>


      {/* 9. FINAL CALL TO ACTION BANNER */}
      <section className="cta-banner-section">
        <div className="cta-banner card">
          <div className="cta-content">
            <h2>Ready to Experience Real-Time Clinical Trial Oversight?</h2>
            <p>Access the AIIA TrialOrbit Control Room to review active protocols, monitor participant velocity, and inspect compliance dossiers.</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary btn-lg">
                Access Platform Login &rarr;
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                Read Architecture Overview
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.85)', flexWrap: 'wrap' }}>
              <span>Project: <strong>AIIA TrialOrbit</strong></span>
              <span>•</span>
              <span style={{ color: '#ffd166', fontWeight: 600 }}>Smart India Hackathon 2026 (SIH 2026)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
