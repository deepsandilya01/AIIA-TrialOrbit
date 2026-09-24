import React from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import './PublicLayout.css';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-app-container">
      <PublicHeader />
      <main className="public-main-content">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
