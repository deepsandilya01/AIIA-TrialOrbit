import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Studies from '../features/studies/Studies';
import StudyDetails from '../features/studies/StudyDetails';
import Sites from '../features/sites/Sites';
import Recruitment from '../features/recruitment/Recruitment';
import Compliance from '../features/compliance/Compliance';
import AESAE from '../features/safety/AESAE';
import Alerts from '../features/alerts/Alerts';
import AuditTrail from '../features/audit/AuditTrail';
import Login from '../features/auth/Login';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/studies" element={<Layout><Studies /></Layout>} />
      <Route path="/studies/:id" element={<Layout><StudyDetails /></Layout>} />
      <Route path="/sites" element={<Layout><Sites /></Layout>} />
      <Route path="/participants" element={<Layout><Recruitment /></Layout>} />
      <Route path="/recruitment" element={<Layout><Recruitment /></Layout>} />
      <Route path="/compliance" element={<Layout><Compliance /></Layout>} />
      <Route path="/safety" element={<Layout><AESAE /></Layout>} />
      <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
      <Route path="/reports" element={<Layout><Alerts /></Layout>} />
      <Route path="/audit" element={<Layout><AuditTrail /></Layout>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
