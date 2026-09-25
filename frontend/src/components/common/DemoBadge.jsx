import React from 'react';
import { Database } from 'lucide-react';
import './Badge.css';

const DemoBadge = ({ text = "Synthetic Demo Data", className = "" }) => {
  return (
    <span 
      className={`badge badge-gold inline-flex items-center gap-1 ${className}`}
      title="For hackathon demonstration purposes. No real patient health information (PHI) is exposed."
      style={{ fontSize: '0.72rem', letterSpacing: '0.02em', padding: '3px 8px', maxWidth: '100%', flexShrink: 0 }}
    >
      <Database size={11} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
};

export default DemoBadge;
