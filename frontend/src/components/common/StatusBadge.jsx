import React from 'react';
import Badge from './Badge';

const StatusBadge = ({ status, pulse = false, className = '' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().trim();

  let variant = 'default';
  if (['ongoing', 'recruiting', 'active', 'approved', 'registered', 'completed', 'resolved', 'passed'].includes(normalized)) {
    variant = 'success';
  } else if (['warning', 'due soon', 'pending review', 'monitoring', 'under review', 'planned'].includes(normalized)) {
    variant = 'warning';
  } else if (['critical', 'severe', 'danger', 'on hold', 'rejected', 'hospitalization', 'yes'].includes(normalized)) {
    variant = 'danger';
  } else if (['phase i', 'phase ii', 'phase iii', 'phase iv', 'info', 'update'].includes(normalized)) {
    variant = 'info';
  } else if (['planning'].includes(normalized)) {
    variant = 'gold';
  }

  const shouldPulse = pulse || ['recruiting', 'critical', 'due soon'].includes(normalized);

  return (
    <Badge variant={variant} className={`status-badge-unified ${className}`}>
      <span className={`badge-dot ${shouldPulse ? 'pulse' : ''}`} />
      <span>{status}</span>
    </Badge>
  );
};

export default StatusBadge;
