import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Sidebar isOpen={isMobileSidebarOpen} onClose={closeSidebar} />
        {isMobileSidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            onClick={closeSidebar} 
            aria-hidden="true" 
          />
        )}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
