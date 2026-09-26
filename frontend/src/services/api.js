import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ctms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor for handling 401s
apiClient.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('ctms_token');
    sessionStorage.removeItem('ctms_user');
    window.location.href = '/login'; // Redirect to login
  }
  return Promise.reject(error);
});

const mapStudy = (s) => ({
  id: s._id,
  protocolId: s.protocolId,
  title: s.title,
  phase: s.phase,
  pi: s.pi_id?.name || 'Dr. Anurag Sharma', // Mocking PI name if not populated
  status: s.status,
  targetParticipants: s.targetParticipants,
  participants: s.enrolledCount || 0,
  progress: s.targetParticipants ? Math.round(((s.enrolledCount || 0) / s.targetParticipants) * 100) : 0,
  sites: s.siteCount || 1,
  dataQualityScore: 98, // Mocked as backend doesn't aggregate it yet
  startDate: s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : ''
});

const extractStudyName = (studyRef) => {
  if (!studyRef) return 'Unknown Protocol';
  if (typeof studyRef === 'object') return studyRef.protocolId || studyRef._id || 'Unknown Protocol';
  return studyRef;
};

const mapAlert = (a) => ({
  id: a._id,
  type: a.severity || 'Info', // Critical, Warning, Info
  category: a.type, // RECRUITMENT_LAG, SAE_OVERDUE
  text: a.title || a.message || a.text,
  study: extractStudyName(a.studyId),
  date: new Date(a.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  resolved: a.status === 'RESOLVED'
});

const mapSae = (s) => ({
  id: s._id,
  event: s.event,
  participant: s.participantId?.participantCode || s.participantId || 'Unknown',
  study: extractStudyName(s.studyId),
  date: new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  status: s.pvReviewstatus === 'PENDING' ? 'Pending Review' : s.pvReviewstatus,
  serious: s.serious ? 'Yes' : 'No',
  severity: s.severity
});

const mapAudit = (l) => ({
  id: l._id,
  time: new Date(l.createdAt).toLocaleString('en-GB') + ' IST',
  user: l.userId?.name || 'System User',
  action: l.action,
  entity: l.resource,
  oldVal: JSON.stringify(l.oldValue || '-'),
  newVal: JSON.stringify(l.newValue || '-'),
  ip: l.ipAddress || 'Demo Mode'
});

const mapDefault = (item) => {
  if (item && item._id && !item.id) item.id = item._id;
  return item;
};

export const api = {
  // --- Dashboard ---
  getDashboardKPIs: async () => {
    const res = await apiClient.get('/dashboard/kpis');
    return res.data.data || res.data || {};
  },

  // --- Auth ---
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // --- Studies ---
  getStudies: async () => {
    const res = await apiClient.get('/studies');
    return (res.data.data || []).map(mapStudy);
  },
  getStudyById: async (id) => {
    const res = await apiClient.get(`/studies/${id}`);
    return mapStudy(res.data.data);
  },
  createStudy: async (data) => {
    const res = await apiClient.post('/studies', data);
    return mapStudy(res.data.data);
  },
  updateStudyStatus: async (id, status) => {
    const res = await apiClient.patch(`/studies/${id}`, { status });
    return mapStudy(res.data.data);
  },

  // --- Sites ---
  getSites: async () => {
    const res = await apiClient.get('/sites');
    return (res.data.data || []).map(mapDefault);
  },
  getSiteById: async (id) => {
    const res = await apiClient.get(`/sites/${id}`);
    return mapDefault(res.data.data);
  },

  // --- Participants ---
  getParticipants: async () => {
    const res = await apiClient.get('/participants');
    return (res.data.data || []).map(mapDefault);
  },
  getParticipantById: async (id) => {
    const res = await apiClient.get(`/participants/${id}`);
    return mapDefault(res.data.data);
  },
  updateParticipantStatus: async (id, status) => {
    const res = await apiClient.patch(`/participants/${id}/status`, { status });
    return mapDefault(res.data.data);
  },

  // --- Visits ---
  getVisits: async () => {
    const res = await apiClient.get('/visits');
    return (res.data.data || []).map(mapDefault);
  },
  markVisitCompleted: async (id) => {
    const res = await apiClient.patch(`/visits/${id}/complete`, { status: 'Completed', completedDate: new Date().toISOString() });
    return [mapDefault(res.data.data)];
  },

  // --- Data Queries ---
  getDataQueries: async () => {
    const res = await apiClient.get('/data-quality/queries');
    return (res.data.data || []).map(mapDefault);
  },
  resolveQuery: async (id) => {
    const res = await apiClient.patch(`/data-quality/queries/${id}/resolve`, { resolutionData: 'Resolved from UI' });
    return [mapDefault(res.data.data)];
  },

  // --- Protocol Deviations ---
  getProtocolDeviations: async () => {
    const res = await apiClient.get('/data-quality/deviations');
    return (res.data.data || []).map(mapDefault);
  },
  updateDeviationStatus: async (id, status) => {
    const res = await apiClient.patch(`/data-quality/deviations/${id}`, { status });
    return [mapDefault(res.data.data)];
  },

  // --- Regulatory Milestones ---
  getMilestones: async () => {
    const res = await apiClient.get('/regulatory/milestones');
    return (res.data.data || []).map(mapDefault);
  },
  completeMilestone: async (id) => {
    const res = await apiClient.patch(`/regulatory/milestones/${id}`, { status: 'Completed', actualDate: new Date().toISOString() });
    return [mapDefault(res.data.data)];
  },

  // --- Safety / SAE ---
  getSafetyEvents: async () => {
    const res = await apiClient.get('/safety/events');
    return (res.data.data || []).map(mapSae);
  },
  reportSAE: async (data) => {
    const res = await apiClient.post('/safety/events', data);
    return mapSae(res.data.data);
  },
  updateSAEStatus: async (id, status) => {
    const res = await apiClient.patch(`/safety/events/${id}`, { status });
    return [mapSae(res.data.data)];
  },

  // --- Alerts ---
  getAlerts: async () => {
    const res = await apiClient.get('/alerts');
    return (res.data.data || []).map(mapAlert);
  },
  acknowledgeAlert: async (id) => {
    const res = await apiClient.patch(`/alerts/${id}/acknowledge`);
    return [mapAlert(res.data.data)];
  },

  // --- Audit Logs ---
  getAuditLogs: async () => {
    const res = await apiClient.get('/audit-logs');
    return (res.data.data || []).map(mapAudit);
  },

  // --- Users ---
  getUsers: async () => {
    const res = await apiClient.get('/users');
    return (res.data.data || []).map(mapDefault);
  },
  updateUserRole: async (id, role) => {
    const res = await apiClient.patch(`/users/${id}/role`, { role });
    return mapDefault(res.data.data);
  },

  // --- Others (Mock if no backend exact match) ---
  getComplianceData: async () => {
    const res = await apiClient.get('/regulatory/milestones');
    return (res.data.data || []).map(m => ({
      id: m._id,
      req: m.title || m.requirement || 'Regulatory Milestone',
      status: m.status || 'Pending',
      date: new Date(m.targetDate || m.dueDate).toLocaleDateString('en-GB'),
      days: m.daysRemaining || null,
      authority: m.authority || 'Institutional Authority'
    }));
  },
  getRecruitmentTrend: async () => {
    return [
      { month: 'Jan', target: 200, actual: 180 },
      { month: 'Feb', target: 400, actual: 350 },
      { month: 'Mar', target: 600, actual: 610 },
      { month: 'Apr', target: 800, actual: 820 },
      { month: 'May', target: 1000, actual: 950 },
      { month: 'Jun', target: 1200, actual: 1240 }
    ];
  },
  getReportsCatalog: async () => {
    return [
      { id: 'RPT-001', name: 'Clinical Study Report (CSR)', category: 'Regulatory', format: 'PDF, Word', lastRun: '2 days ago' },
      { id: 'RPT-002', name: 'Site Performance Metrics', category: 'Operational', format: 'Excel, PDF', lastRun: '5 hrs ago' },
      { id: 'RPT-003', name: 'Adverse Event Line Listing', category: 'Safety', format: 'Excel, CSV', lastRun: '1 day ago' },
      { id: 'RPT-004', name: 'Monitoring Visit Summary', category: 'Compliance', format: 'PDF', lastRun: '3 days ago' },
      { id: 'RPT-005', name: 'Enrollment Cohort Trajectory', category: 'Recruitment', format: 'Excel, PPT', lastRun: '1 week ago' }
    ];
  },

  // --- CDISC Export ---
  generateCDISCExport: async (studyId, options) => {
    // Expected endpoint: POST /export/cdisc/studies/:studyId/export
    const res = await apiClient.post(`/export/cdisc/studies/${studyId}/export`, options);
    return res.data;
  },

  resetData: () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
};

export default api;
