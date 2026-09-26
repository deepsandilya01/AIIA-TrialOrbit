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
import Participants from '../features/participants/Participants';
import ParticipantDetail from '../features/participants/ParticipantDetail';
import Visits from '../features/visits/Visits';
import Recruitment from '../features/recruitment/Recruitment';
import DataQueries from '../features/data-quality/DataQueries';
import Deviations from '../features/data-quality/Deviations';
import FHIRIntegration from '../features/integration/FHIRIntegration';
import CDISC from '../features/integration/CDISC';
import Exports from '../features/integration/Exports';
import Users from '../features/admin/Users';
import AIAssistant from '../features/ai/AIAssistant';
import Regulatory from '../features/regulatory/Regulatory';
import Compliance from '../features/compliance/Compliance';
import AESAE from '../features/safety/AESAE';
import SafetyDashboard from '../features/safety/SafetyDashboard';
import Alerts from '../features/alerts/Alerts';
import Reports from '../features/reports/Reports';
import AuditTrail from '../features/audit/AuditTrail';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import NotFound from '../pages/NotFound';

import ProtectedRoute from '../components/layout/ProtectedRoute';

import SiteDetails from '../features/sites/SiteDetails';
import PlaceholderPage from '../pages/PlaceholderPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/public-studies" element={<PublicLayout><PublicStudies /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected/App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/studies" element={<ProtectedRoute><Layout><Studies /></Layout></ProtectedRoute>} />
      <Route path="/studies/:id" element={<ProtectedRoute><Layout><StudyDetails /></Layout></ProtectedRoute>} />
      <Route path="/sites" element={<ProtectedRoute><Layout><Sites /></Layout></ProtectedRoute>} />
      <Route path="/sites/:id" element={<ProtectedRoute><Layout><SiteDetails /></Layout></ProtectedRoute>} />
      <Route path="/participants" element={<ProtectedRoute><Layout><Participants /></Layout></ProtectedRoute>} />
      <Route path="/participants/:id" element={<ProtectedRoute><Layout><ParticipantDetail /></Layout></ProtectedRoute>} />
      <Route path="/recruitment" element={<ProtectedRoute><Layout><Recruitment /></Layout></ProtectedRoute>} />
      <Route path="/visits" element={<ProtectedRoute><Layout><Visits /></Layout></ProtectedRoute>} />
      
      <Route path="/queries" element={<ProtectedRoute><Layout><DataQueries /></Layout></ProtectedRoute>} />
      <Route path="/deviations" element={<ProtectedRoute><Layout><Deviations /></Layout></ProtectedRoute>} />
      
      <Route path="/ethics" element={<ProtectedRoute><Layout><Regulatory /></Layout></ProtectedRoute>} />
      <Route path="/ctri" element={<ProtectedRoute><Layout><Regulatory /></Layout></ProtectedRoute>} />
      <Route path="/milestones" element={<ProtectedRoute><Layout><Regulatory /></Layout></ProtectedRoute>} />
      
      <Route path="/compliance" element={<ProtectedRoute><Layout><Compliance /></Layout></ProtectedRoute>} />
      
      <Route path="/safety-events" element={<ProtectedRoute><Layout><AESAE /></Layout></ProtectedRoute>} />
      <Route path="/pharmacovigilance" element={<ProtectedRoute><Layout><AESAE /></Layout></ProtectedRoute>} />
      <Route path="/safety-dashboard" element={<ProtectedRoute><Layout><SafetyDashboard /></Layout></ProtectedRoute>} />
      
      <Route path="/alerts" element={<ProtectedRoute><Layout><Alerts /></Layout></ProtectedRoute>} />
      <Route path="/kpis" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      
      <Route path="/audit" element={<ProtectedRoute><Layout><AuditTrail /></Layout></ProtectedRoute>} />
      
      <Route path="/fhir" element={<ProtectedRoute><Layout><FHIRIntegration /></Layout></ProtectedRoute>} />
      <Route path="/cdisc" element={<ProtectedRoute><Layout><CDISC /></Layout></ProtectedRoute>} />
      <Route path="/exports" element={<ProtectedRoute><Layout><Exports /></Layout></ProtectedRoute>} />
      
      <Route path="/ai-assistant" element={<ProtectedRoute><Layout><AIAssistant /></Layout></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Layout><AIAssistant /></Layout></ProtectedRoute>} />
      
      <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Users /></Layout></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Users /></Layout></ProtectedRoute>} />
      <Route path="/permissions" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Users /></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
