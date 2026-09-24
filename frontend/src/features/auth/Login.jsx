import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Principal Investigator');

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, role, name: 'Dr. Anurag Sharma' });
    
    // Redirect to where they were trying to go, or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <div className="login-emblem"></div>
          <h1>{t('auth.allIndiaInstitute')}</h1>
          <p className="login-subtitle">{t('auth.clinicalTrialManagementSystem')}</p>
          <p className="login-tagline">Govt. of India, Ministry of Ayush</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card card">
          <div className="login-header text-center">
            <h2>Sign In to CTMS</h2>
            <p className="text-muted">Enter your credentials to access the system</p>
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@aiia.gov.in" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>{t('auth.password')}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>{t('general.role')}</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value={t('studies.principalInvestigator')}>{t('studies.principalInvestigator')}</option>
                <option value="Study Coordinator">Study Coordinator</option>
                <option value="PV Officer">PV Officer</option>
                <option value="Admin">System Admin</option>
              </select>
            </div>
            
            <div className="form-options">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="text-sm">Forgot password?</a>
            </div>
            
            <Button type="submit" variant="primary" className="login-btn w-full justify-center">{t('auth.signIn')}</Button>
          </form>
          
          <div className="login-footer">
            <p className="text-xs text-muted">Unauthorized access is strictly prohibited. Activity is logged.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
