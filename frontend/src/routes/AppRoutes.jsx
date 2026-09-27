import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PublicLayout from '../components/layout/PublicLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import PublicStudies from '../pages/PublicStudies';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Roadmap from '../pages/Roadmap';
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
import Roles from '../features/admin/Roles';
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
import AIIntelligencePage from '../features/ai/AIIntelligencePage';
import Profile from '../features/profile/Profile';

import ProtectedRoute from '../components/layout/ProtectedRoute';

import SiteDetails from '../features/sites/SiteDetails';
import PlaceholderPage from '../pages/PlaceholderPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/roadmap" element={<PublicLayout><Roadmap /></PublicLayout>} />
      <Route path="/public-studies" element={<PublicLayout><PublicStudies /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected/App Routes */}
      <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
      <Route path="/studies" element={<Layout><ProtectedRoute><Studies /></ProtectedRoute></Layout>} />
      <Route path="/studies/:id" element={<Layout><ProtectedRoute><StudyDetails /></ProtectedRoute></Layout>} />
      <Route path="/sites" element={<Layout><ProtectedRoute><Sites /></ProtectedRoute></Layout>} />
      <Route path="/sites/:id" element={<Layout><ProtectedRoute><SiteDetails /></ProtectedRoute></Layout>} />
      <Route path="/participants" element={<Layout><ProtectedRoute><Participants /></ProtectedRoute></Layout>} />
      <Route path="/participants/:id" element={<Layout><ProtectedRoute><ParticipantDetail /></ProtectedRoute></Layout>} />
      <Route path="/recruitment" element={<Layout><ProtectedRoute><Recruitment /></ProtectedRoute></Layout>} />
      <Route path="/visits" element={<Layout><ProtectedRoute><Visits /></ProtectedRoute></Layout>} />
      
      <Route path="/queries" element={<Layout><ProtectedRoute><DataQueries /></ProtectedRoute></Layout>} />
      <Route path="/deviations" element={<Layout><ProtectedRoute><Deviations /></ProtectedRoute></Layout>} />
      
      <Route path="/ethics" element={<Layout><ProtectedRoute><Regulatory /></ProtectedRoute></Layout>} />
      <Route path="/ctri" element={<Layout><ProtectedRoute><Regulatory /></ProtectedRoute></Layout>} />
      <Route path="/milestones" element={<Layout><ProtectedRoute><Regulatory /></ProtectedRoute></Layout>} />
      
      <Route path="/compliance" element={<Layout><ProtectedRoute><Compliance /></ProtectedRoute></Layout>} />
      
      <Route path="/safety-events" element={<Layout><ProtectedRoute><AESAE /></ProtectedRoute></Layout>} />
      <Route path="/pharmacovigilance" element={<Layout><ProtectedRoute><AESAE /></ProtectedRoute></Layout>} />
      <Route path="/safety-dashboard" element={<Layout><ProtectedRoute><SafetyDashboard /></ProtectedRoute></Layout>} />
      
      <Route path="/alerts" element={<Layout><ProtectedRoute><Alerts /></ProtectedRoute></Layout>} />
      <Route path="/kpis" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
      
      <Route path="/audit" element={<Layout><ProtectedRoute><AuditTrail /></ProtectedRoute></Layout>} />
      
      <Route path="/fhir" element={<Layout><ProtectedRoute><FHIRIntegration /></ProtectedRoute></Layout>} />
      <Route path="/cdisc" element={<Layout><ProtectedRoute><CDISC /></ProtectedRoute></Layout>} />
      <Route path="/exports" element={<Layout><ProtectedRoute><Exports /></ProtectedRoute></Layout>} />
      
      <Route path="/ai-intelligence" element={<Layout><ProtectedRoute><AIIntelligencePage /></ProtectedRoute></Layout>} />
      
      <Route path="/users" element={<Layout><ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute></Layout>} />
      <Route path="/roles" element={<Layout><ProtectedRoute allowedRoles={['ADMIN']}><Roles /></ProtectedRoute></Layout>} />
      <Route path="/permissions" element={<Layout><ProtectedRoute allowedRoles={['ADMIN']}><Roles /></ProtectedRoute></Layout>} />
      <Route path="/reports" element={<Layout><ProtectedRoute><Reports /></ProtectedRoute></Layout>} />
      <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
