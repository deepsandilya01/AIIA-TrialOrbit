import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, LayoutDashboard } from 'lucide-react';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon-wrapper">
          <AlertCircle size={64} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="not-found-actions">
          <Button variant="outline" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} /> Back to Home
          </Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutDashboard size={18} /> Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
