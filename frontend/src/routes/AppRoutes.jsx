import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PublicLayout from '../components/layout/PublicLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import PublicStudies from '../pages/PublicStudies';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Studies from '../features/studies/Studies';
import StudyDetails from '../features/studies/StudyDetails';
import Sites from '../features/sites/Sites';
import Recruitment from '../features/recruitment/Recruitment';
import Compliance from '../features/compliance/Compliance';
import AESAE from '../features/safety/AESAE';
import Alerts from '../features/alerts/Alerts';
import Reports from '../features/reports/Reports';
import AuditTrail from '../features/audit/AuditTrail';
import Login from '../features/auth/Login';
import NotFound from '../pages/NotFound';

import ProtectedRoute from '../components/layout/ProtectedRoute';

import SiteDetails from '../features/sites/SiteDetails';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/public-studies" element={<PublicLayout><PublicStudies /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected/App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/studies" element={<ProtectedRoute><Layout><Studies /></Layout></ProtectedRoute>} />
      <Route path="/studies/:id" element={<ProtectedRoute><Layout><StudyDetails /></Layout></ProtectedRoute>} />
      <Route path="/sites" element={<ProtectedRoute><Layout><Sites /></Layout></ProtectedRoute>} />
      <Route path="/sites/:id" element={<ProtectedRoute><Layout><SiteDetails /></Layout></ProtectedRoute>} />
      <Route path="/participants" element={<ProtectedRoute><Layout><Recruitment /></Layout></ProtectedRoute>} />
      <Route path="/recruitment" element={<ProtectedRoute><Layout><Recruitment /></Layout></ProtectedRoute>} />
      <Route path="/compliance" element={<ProtectedRoute><Layout><Compliance /></Layout></ProtectedRoute>} />
      <Route path="/safety" element={<ProtectedRoute><Layout><AESAE /></Layout></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Layout><Alerts /></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute><Layout><AuditTrail /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
