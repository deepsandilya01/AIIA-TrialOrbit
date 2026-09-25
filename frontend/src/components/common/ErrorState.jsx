import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

const ErrorState = ({
  title = "Unable to load information",
  message = "A temporary issue prevented loading the clinical data. Please retry or contact system administration.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`empty-state-container card ${className}`} style={{ borderColor: 'var(--danger-border)' }}>
      <div className="empty-state-icon-box" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>
        <AlertCircle size={32} />
      </div>
      <h3 className="empty-state-title" style={{ color: 'var(--danger)' }}>{title}</h3>
      <p className="empty-state-description">{message}</p>
      {onRetry && (
        <div className="empty-state-action">
          <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
