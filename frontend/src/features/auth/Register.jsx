import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building2,
  Award,
  CheckCircle2,
  Stethoscope,
  UserPlus,
  FileCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Login.css';

const INSTITUTES = [
  'All India Institute of Ayurveda (AIIA), New Delhi',
  'National Institute of Ayurveda (NIA), Jaipur',
  'Institute of Teaching & Research in Ayurveda (ITRA), Jamnagar',
  'Faculty of Ayurveda, IMS, BHU, Varanasi',
  'Government Ayurvedic College & Hospital, Guwahati',
  'Government Ayurveda Medical College, Bengaluru',
  'Other Participating Clinical Research Site'
];

const SPECIALTIES = [
  'Kayachikitsa (Internal Medicine)',
  'Shalya Tantra (Surgery)',
  'Shalakya Tantra (ENT & Ophthalmology)',
  'Prasuti & Stri Roga (Obstetrics & Gynecology)',
  'Kaumarbhritya (Pediatrics)',
  'Panchakarma (Detoxification & Biocleansing)',
  'Dravyaguna (Pharmacology)',
  'Rasa Shastra & Bhaishajya Kalpana',
  'Integrative Clinical Medicine & Pharmacovigilance'
];

const ROLES = [
  { value: 'Principal Investigator', label: 'Principal Investigator (PI) — Trial Oversight' },
  { value: 'Co-Investigator', label: 'Co-Investigator (Co-PI) — Clinical Sub-Investigator' },
  { value: 'Study Coordinator', label: 'Clinical Research Coordinator (CRC) — Data & Visits' },
  { value: 'Pharmacovigilance Officer', label: 'Pharmacovigilance Officer — Safety & SAE Surveillance' },
  { value: 'Clinical Monitor (CRA)', label: 'Clinical Research Associate (CRA) — Site Monitoring' }
];

const Register = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: 'Dr.',
    fullName: '',
    email: '',
    phone: '',
    regNumber: '',
    institute: INSTITUTES[0],
    specialty: SPECIALTIES[0],
    role: 'Principal Investigator',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      error('Please complete all mandatory investigator details.');
      return;
    }

    if (formData.password.length < 8) {
      error('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match. Please verify.');
      return;
    }

    if (!formData.agreeTerms) {
      error('You must accept the GCP & 21 CFR Part 11 Regulatory Undertaking.');
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName = `${formData.title} ${formData.fullName.trim()}`;

      // Map clinical role label → RBAC role enum (public registration limited to non-admin roles)
      const roleMap = {
        'Principal Investigator': 'PI',
        'Co-Investigator': 'PI',
        'Study Coordinator': 'COORDINATOR',
        'Pharmacovigilance Officer': 'PHARMACOVIGILANCE',
        'Clinical Monitor (CRA)': 'MONITOR'
      };
      const rbacRole = roleMap[formData.role] || 'PI';

      const { api } = await import('../../services/api');
      const res = await api.register({
        name: displayName,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: rbacRole
      });

      // Auto login with the returned token
      const token = res.data.token;
      const userData = res.data.user;
      localStorage.setItem('ctms_token', token);
      sessionStorage.setItem('ctms_user', JSON.stringify(userData));

      success(`Investigator profile provisioned for ${displayName}! Welcome to TrialOrbit.`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error?.message || 'Registration failed. Please try again.';
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Institutional Branding */}
      <div className="login-left">
        <div className="login-branding">
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
          <p className="login-subtitle">Investigator & Research Site Onboarding Portal</p>
          <div className="login-tagline">
            All India Institute of Ayurveda (AIIA), New Delhi • Ministry of Ayush
          </div>

          <div className="login-features-list">
            <div className="login-feat-item">
              <ShieldCheck size={18} className="text-warning" />
              <span>Multi-Centre Protocol Governance & Site Clearance</span>
            </div>
            <div className="login-feat-item">
              <Lock size={18} className="text-warning" />
              <span>21 CFR Part 11 Electronic Records & Tamper-Evident Signatures</span>
            </div>
            <div className="login-feat-item">
              <Award size={18} className="text-warning" />
              <span>ICH-GCP E6 (R2) & ICMR Ethical Guidelines Compliance</span>
            </div>
            <div className="login-feat-item">
              <FileCheck size={18} className="text-warning" />
              <span>Instant e-CRF Access & Real-Time Safety Surveillance Engine</span>
            </div>
          </div>

          <div className="login-disclaimer-box">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>SIH 2026 Evaluation</span>
              <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Instant Provisioning</span>
            </div>
            <p className="text-xs text-muted">
              Registration allows qualified clinical investigators, research associates, and monitors to access TrialOrbit's real-time monitoring workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="login-right">
        <div className="login-card register-card card">
          <div className="login-header">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase text-primary tracking-wider flex items-center gap-1">
                <UserPlus size={14} /> Investigator Registration
              </span>
              <Link to="/login" className="text-xs text-primary font-semibold hover:underline">
                Already registered? Sign In &rarr;
              </Link>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Apply for CTMS Credentials</h2>
            <p className="text-muted text-xs">Enter your institutional details to register a clinical investigator profile:</p>
          </div>

          <form className="login-form" onSubmit={handleRegister}>
            {/* Row 1: Title & Full Name */}
            <div className="form-grid-2">
              <div className="form-group" style={{ maxWidth: '110px' }}>
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">Title</label>
                <select name="title" value={formData.title} onChange={handleChange}>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Vd.">Vd.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mr.">Mr.</option>
                </select>
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Anurag Sharma"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Institutional Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="investigator@aiia.gov.in"
                  required
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Contact Mobile <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            {/* Row 3: Council Reg No & Institute */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Council Reg. No. <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                  placeholder="e.g. DBCP/2019/5812"
                  required
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">Clinical Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Affiliated Institute */}
            <div className="form-group">
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">Affiliated Institution</label>
              <select name="institute" value={formData.institute} onChange={handleChange}>
                {INSTITUTES.map((inst, i) => (
                  <option key={i} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Specialty */}
            <div className="form-group">
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">Department / Clinical Specialty</label>
              <select name="specialty" value={formData.specialty} onChange={handleChange}>
                {SPECIALTIES.map((spec, i) => (
                  <option key={i} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Password and Confirm Password */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>

            {/* Regulatory Undertaking Checkbox */}
            <div className="form-options text-xs" style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
              <label className="flex items-start gap-2 cursor-pointer" style={{ lineHeight: '1.4' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                />
                <span className="text-secondary text-xs">
                  I certify that the information provided is accurate and agree to adhere strictly to <strong>ICH-GCP E6 (R2)</strong>, <strong>21 CFR Part 11 Electronic Signature Regulations</strong>, and ICMR Ethical Guidelines.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="login-btn w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering Investigator Profile...' : 'Complete Registration & Access CTMS →'}
            </Button>
          </form>

          <div className="login-footer">
            <p className="text-xs text-muted text-center">
              All credentials issued undergo institutional verification by the AIIA Ethics Committee & Clinical Research Secretariat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
