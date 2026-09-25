import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import './SafetyOverview.css';

const SafetyOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="card safety-card">
      <div className="card-header">
        <h3 className="card-title">Pharmacovigilance & Safety Metrics</h3>
        <button 
          onClick={() => navigate('/safety')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
        >
          Safety Log <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="safety-content">
        <div className="safety-item clickable-row" onClick={() => navigate('/safety')}>
          <div className="safety-icon-wrapper ae-icon">
            <Activity size={22} />
          </div>
          <div className="safety-info">
            <h4 className="safety-title">Adverse Events (AE)</h4>
            <div className="safety-stats">
              <span className="safety-value">48</span>
              <span className="safety-label">Documented</span>
            </div>
            <span className="safety-trend text-success">92% Grade 1 Resolved</span>
          </div>
        </div>
        
        <div className="safety-divider"></div>
        
        <div className="safety-item clickable-row" onClick={() => navigate('/safety')}>
          <div className="safety-icon-wrapper sae-icon">
            <AlertTriangle size={22} />
          </div>
          <div className="safety-info">
            <h4 className="safety-title">Serious Adverse Events (SAE)</h4>
            <div className="safety-stats">
              <span className="safety-value text-danger">6</span>
              <span className="safety-label">Cumulative</span>
            </div>
            <span className="safety-trend text-danger font-semibold">2 pending PV review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyOverview;
