import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--text-primary)', marginBottom: '0' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>The page you are looking for doesn't exist or has been moved.</p>
      <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
    </div>
  );
};

export default NotFound;
