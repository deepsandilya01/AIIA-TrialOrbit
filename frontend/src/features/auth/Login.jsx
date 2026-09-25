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
  { role: 'Principal Investigator', name: 'Dr. Anurag Sharma', email: 'dr.anurag@aiia.gov.in' },
  { role: 'Study Coordinator', name: 'Dr. Sneha Verma', email: 'coord.sneha@aiia.gov.in' },
  { role: 'Pharmacovigilance Officer', name: 'Dr. Priya Singh', email: 'pv.priya@aiia.gov.in' },
  { role: 'Clinical Monitor (CRA)', name: 'R. K. Meena', email: 'cra.meena@aiia.gov.in' },
  { role: 'System Admin', name: 'IT Admin AIIA', email: 'admin@aiia.gov.in' }
];

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { success } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('dr.anurag@aiia.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('Principal Investigator');
  const [name, setName] = useState('Dr. Anurag Sharma');

  const handleSelectPreset = (preset) => {
    setRole(preset.role);
    setName(preset.name);
    setEmail(preset.email);
    setPassword('••••••••••••');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, role, name });
    success(`Signed in as ${name} (${role}). Control Room activated.`);

    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
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
                  {p.role.split(' ')[0]}
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
                }
              }}>
                <option value="Principal Investigator">Principal Investigator (Medical Oversight)</option>
                <option value="Study Coordinator">Study Coordinator (CRF & Participant Follow-up)</option>
                <option value="Pharmacovigilance Officer">Pharmacovigilance Officer (SAE & Safety)</option>
                <option value="Clinical Monitor (CRA)">Clinical Monitor / CRA (SDV & Deviations)</option>
                <option value="System Admin">System Administrator (Governance & Config)</option>
              </select>
            </div>

            <div className="form-options flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked style={{ width: '15px', height: '15px' }} /> Remember Session
              </label>
              <span className="text-muted">Simulated Auth</span>
            </div>

            <Button type="submit" variant="primary" className="login-btn w-full justify-center">
              Authenticate & Enter CTMS &rarr;
            </Button>
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
