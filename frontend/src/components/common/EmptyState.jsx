import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

const EmptyState = ({
  icon = <Inbox size={38} className="empty-state-icon" />,
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div className={`empty-state-container card ${className}`}>
      <div className="empty-state-icon-box">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <div className="empty-state-action">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
