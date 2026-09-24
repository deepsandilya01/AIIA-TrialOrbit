import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Users, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import './PublicPages.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Clinical Trial Management System</h1>
          <p className="hero-subtitle">
            A centralized platform for managing clinical research studies, sites, compliance, recruitment and safety.
          </p>
          <div className="hero-actions">
            <Link to="/public-studies" className="btn btn-primary btn-lg">Explore Studies &rarr;</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Login to CTMS</Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">18</div>
            <div className="stat-label">Active Studies</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">42</div>
            <div className="stat-label">Research Sites</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1,240</div>
            <div className="stat-label">Participants</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">92%</div>
            <div className="stat-label">Compliance</div>
          </div>
        </div>
        <p className="demo-notice">* Statistics shown are for demonstration purposes only.</p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Platform Capabilities</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <Activity className="feature-icon" />
            <h3>Study Management</h3>
            <p>Track study lifecycle, milestones and study status in a unified dashboard.</p>
          </div>
          <div className="feature-card card">
            <MapPin className="feature-icon" />
            <h3>Site Management</h3>
            <p>Manage research sites, capabilities, and activation status across locations.</p>
          </div>
          <div className="feature-card card">
            <Users className="feature-icon" />
            <h3>Recruitment Monitoring</h3>
            <p>Monitor participant screening and recruitment progress efficiently.</p>
          </div>
          <div className="feature-card card">
            <CheckCircle className="feature-icon" />
            <h3>Compliance</h3>
            <p>Track IEC, CTRI and other critical study compliance milestones.</p>
          </div>
          <div className="feature-card card">
            <AlertTriangle className="feature-icon" />
            <h3>AE/SAE Monitoring</h3>
            <p>Record and monitor adverse events and serious adverse events reliably.</p>
          </div>
          <div className="feature-card card">
            <Shield className="feature-icon" />
            <h3>Audit Trail</h3>
            <p>Maintain complete traceability of all important system activities and changes.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Create Study</h4>
            <p>Define study parameters and goals</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Activate Sites</h4>
            <p>Setup and manage research sites</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Monitor Recruitment</h4>
            <p>Track participant enrollment</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Track Safety & Compliance</h4>
            <p>Ensure adherence to protocols</p>
          </div>
        </div>
      </section>

      {/* Research Studies Preview Section */}
      <section className="studies-preview-section">
        <div className="section-header">
          <h2 className="section-title">Research Studies</h2>
          <Link to="/public-studies" className="view-all-link">View All Studies</Link>
        </div>
        <div className="studies-preview-grid">
          <div className="study-preview-card card">
            <div className="study-id">AIIA-001</div>
            <h3>Ayurvedic Intervention Study</h3>
            <div className="study-meta">
              <span className="status-badge recruiting">Recruiting</span>
              <span className="phase-badge">Phase II</span>
            </div>
            <Link to="/public-studies" className="btn btn-outline btn-sm">View Study</Link>
          </div>
          <div className="study-preview-card card">
            <div className="study-id">AIIA-002</div>
            <h3>Clinical Research Study</h3>
            <div className="study-meta">
              <span className="status-badge active">Active</span>
              <span className="phase-badge">Phase III</span>
            </div>
            <Link to="/public-studies" className="btn btn-outline btn-sm">View Study</Link>
          </div>
          <div className="study-preview-card card">
            <div className="study-id">AIIA-003</div>
            <h3>Multi-Centre Research Study</h3>
            <div className="study-meta">
              <span className="status-badge monitoring">Monitoring</span>
              <span className="phase-badge">Phase IV</span>
            </div>
            <Link to="/public-studies" className="btn btn-outline btn-sm">View Study</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
