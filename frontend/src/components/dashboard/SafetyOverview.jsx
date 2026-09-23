import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import './SafetyOverview.css';

const SafetyOverview = () => {
  return (
    <div className="card safety-card">
      <div className="card-header">
        <h3 className="card-title">AE / SAE Summary</h3>
      </div>
      
      <div className="safety-content">
        <div className="safety-item">
          <div className="safety-icon-wrapper ae-icon">
            <Activity size={24} />
          </div>
          <div className="safety-info">
            <h4 className="safety-title">Adverse Events (AE)</h4>
            <div className="safety-stats">
              <span className="safety-value">48</span>
              <span className="safety-label">Reported</span>
            </div>
            <span className="safety-trend text-warning">↑ 12% vs last month</span>
          </div>
        </div>
        
        <div className="safety-divider"></div>
        
        <div className="safety-item">
          <div className="safety-icon-wrapper sae-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="safety-info">
            <h4 className="safety-title">Serious Adverse Events (SAE)</h4>
            <div className="safety-stats">
              <span className="safety-value text-danger">6</span>
              <span className="safety-label">Reported</span>
            </div>
            <span className="safety-trend text-danger font-medium">2 pending review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyOverview;
