import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Login.css';

const DEMO_PRESETS = [
  { role: 'PI', name: 'Dr. Principal Investigator', email: 'pi@trialorbit.com', pass: 'PI@12345' },
  { role: 'COORDINATOR', name: 'Clinical Coordinator', email: 'coordinator@trialorbit.com', pass: 'Coordinator@12345' },
  { role: 'MONITOR', name: 'Clinical Monitor', email: 'monitor@trialorbit.com', pass: 'Monitor@12345' },
  { role: 'ETHICS', name: 'Ethics Committee', email: 'ethics@trialorbit.com', pass: 'Ethics@12345' },
  { role: 'PHARMACOVIGILANCE', name: 'PV Specialist', email: 'pv@trialorbit.com', pass: 'PV@12345' },
  { role: 'REGULATOR', name: 'Regulatory Authority', email: 'regulator@trialorbit.com', pass: 'Regulator@12345' },
  { role: 'ADMIN', name: 'System Administrator', email: 'admin@trialorbit.com', pass: 'Admin@12345' }
];

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('pi@trialorbit.com');
  const [password, setPassword] = useState('PI@12345');
  const [role, setRole] = useState('PI');
  const [name, setName] = useState('Dr. Principal Investigator');

  const [loading, setLoading] = useState(false);

  const handleSelectPreset = (preset) => {
    setRole(preset.role);
    setName(preset.name);
    setEmail(preset.email);
    setPassword(preset.pass);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return error('Please enter both email and password.');
    }
    setLoading(true);
    try {
      const userData = await login({ email, password });
      success(`Signed in as ${userData.name || name} (${userData.role || role}). Control Room activated.`);

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (!err.response) {
        error('Unable to connect to the TrialOrbit server.');
      } else if (err.response.status === 401) {
        error('Invalid email or password.');
      } else if (err.response.status === 403) {
        error('Account is inactive or you do not have permission.');
      } else if (err.response.status === 429) {
        error('Too many login attempts. Please try again later.');
      } else if (err.response.status >= 500) {
        error('TrialOrbit server is temporarily unavailable.');
      } else {
        error(err.response?.data?.message || err.response?.data?.error?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Institutional Branding Showcase */}
      <div className="login-left">
        <div className="login-branding">
          {/* Back to Portal Navigation */}
          <div className="mb-6">
            <Link to="/" className="text-xs text-white opacity-85 hover:opacity-100 inline-flex items-center gap-1.5" style={{ textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Return to Public Portal
            </Link>
          </div>

          {/* Official Logos */}
          <div className="login-logo-container">
            <Link to="/" title="Return to AIIA TrialOrbit Home" style={{ textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="AIIA TrialOrbit Crest"
                className="login-brand-logo"
              />
            </Link>
          </div>

          <h1>AIIA TrialOrbit</h1>
          <p className="login-subtitle">Centralized Clinical Trial Control Room & Surveillance Engine</p>
          <div className="login-tagline">
            All India Institute of Ayurveda (AIIA), New Delhi • National Apex Institute
          </div>

          <div className="login-features-list">
            <div className="login-feat-item">
              <ShieldCheck size={18} className="text-warning" />
              <span>Multi-Site Protocol Governance & Milestone Tracking</span>
            </div>
            <div className="login-feat-item">
              <Lock size={18} className="text-warning" />
              <span>21 CFR Part 11 Electronic Records & Immutable Audit Trail</span>
            </div>
            <div className="login-feat-item">
              <Sparkles size={18} className="text-warning" />
              <span>Expedited 24-Hour SAE Safety Surveillance & CTCAE Grading</span>
            </div>
          </div>

          <div className="login-disclaimer-box">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>SIH 2026 Evaluation</span>
              <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Synthetic Demo Data</span>
            </div>
            <p className="text-xs text-muted">
              Select any pre-configured investigator or monitor profile on the right for instant demonstration access.
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Card & Quick Role Selectors */}
      <div className="login-right">
        <div className="login-card card">
          <div className="login-header">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase text-primary tracking-wider">Investigator Sign In</span>
              <Link to="/" className="text-xs text-muted">&larr; Return to Home</Link>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Access Control Room</h2>
            <p className="text-muted text-xs">Select a demonstration profile or enter institutional Ayush credentials:</p>
          </div>

          {/* Quick Demo Role Chips */}
          <div className="role-presets-container">
            <span className="text-xs text-muted font-semibold block mb-1">Quick Stakeholder Demo View:</span>
            <div className="preset-chips">
              {DEMO_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`preset-chip ${role === p.role ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(p)}
                >
                  {p.role}
                </button>
              ))}
            </div>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigator@aiia.gov.in"
                required
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">Access Credential</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">Active Clinical Role (RBAC)</label>
              <select value={role} onChange={(e) => {
                const selected = e.target.value;
                setRole(selected);
                const match = DEMO_PRESETS.find(p => p.role === selected);
                if (match) {
                  setName(match.name);
                  setEmail(match.email);
                  setPassword(match.pass);
                }
              }}>
                <option value="PI">Principal Investigator (PI)</option>
                <option value="COORDINATOR">Study Coordinator</option>
                <option value="MONITOR">Clinical Monitor (CRA)</option>
                <option value="ETHICS">Ethics Committee</option>
                <option value="PHARMACOVIGILANCE">Pharmacovigilance Officer</option>
                <option value="REGULATOR">Regulator (Read-only)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="form-options flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked style={{ width: '15px', height: '15px' }} /> Remember Session
              </label>
              <span className="text-muted">Simulated Auth</span>
            </div>

            <Button type="submit" variant="primary" className="login-btn w-full justify-center" disabled={loading}>
              {loading ? 'Authenticating...' : 'Authenticate & Enter CTMS \u2192'}
            </Button>

            <div className="text-center mt-3">
              <span className="text-xs text-secondary">New Investigator or Research Site? </span>
              <Link to="/register" className="text-xs text-primary font-semibold hover:underline">
                Register for CTMS Access &rarr;
              </Link>
            </div>
          </form>

          <div className="login-footer">
            <p className="text-xs text-muted text-center">
              Authorized personnel only. All access timestamps are recorded in compliance with 21 CFR Part 11 electronic signature rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
