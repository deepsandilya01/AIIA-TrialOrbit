import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
    localStorage.removeItem('ctms_user');
    window.location.href = '/login'; // Redirect to login
  }
  return Promise.reject(error);
});

export const api = {
  // --- Auth ---
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // --- Studies ---
  getStudies: async () => {
    const res = await apiClient.get('/studies');
    return res.data.data;
  },
  getStudyById: async (id) => {
    const res = await apiClient.get(`/studies/${id}`);
    return res.data.data;
  },
  createStudy: async (data) => {
    const res = await apiClient.post('/studies', data);
    return res.data.data;
  },
  updateStudyStatus: async (id, status) => {
    const res = await apiClient.patch(`/studies/${id}`, { status });
    return res.data.data;
  },

  // --- Sites ---
  getSites: async () => {
    const res = await apiClient.get('/sites');
    return res.data.data;
  },
  getSiteById: async (id) => {
    const res = await apiClient.get(`/sites/${id}`);
    return res.data.data;
  },

  // --- Participants ---
  getParticipants: async () => {
    const res = await apiClient.get('/participants');
    return res.data.data;
  },
  getParticipantById: async (id) => {
    const res = await apiClient.get(`/participants/${id}`);
    return res.data.data;
  },
  updateParticipantStatus: async (id, status) => {
    const res = await apiClient.patch(`/participants/${id}/status`, { status });
    return res.data.data;
  },

  // --- Visits ---
  getVisits: async () => {
    const res = await apiClient.get('/visits');
    return res.data.data;
  },
  markVisitCompleted: async (id) => {
    const res = await apiClient.patch(`/visits/${id}/complete`, { status: 'Completed', completedDate: new Date().toISOString() });
    return [res.data.data]; // UI typically expects array update pattern in dummy, but adapt if needed
  },

  // --- Data Queries ---
  getDataQueries: async () => {
    const res = await apiClient.get('/data-quality/queries');
    return res.data.data;
  },
  resolveQuery: async (id) => {
    const res = await apiClient.patch(`/data-quality/queries/${id}/resolve`, { resolutionData: 'Resolved from UI' });
    return [res.data.data];
  },

  // --- Protocol Deviations ---
  getProtocolDeviations: async () => {
    const res = await apiClient.get('/data-quality/deviations');
    return res.data.data;
  },
  updateDeviationStatus: async (id, status) => {
    const res = await apiClient.patch(`/data-quality/deviations/${id}`, { status });
    return [res.data.data];
  },

  // --- Regulatory Milestones ---
  getMilestones: async () => {
    const res = await apiClient.get('/regulatory/milestones');
    return res.data.data;
  },
  completeMilestone: async (id) => {
    const res = await apiClient.patch(`/regulatory/milestones/${id}`, { status: 'Completed', actualDate: new Date().toISOString() });
    return [res.data.data];
  },

  // --- Safety / SAE ---
  getSafetyEvents: async () => {
    const res = await apiClient.get('/safety/events');
    return res.data.data; // Note pagination wrapper is typically present, we may need res.data.data.events
  },
  reportSAE: async (data) => {
    const res = await apiClient.post('/safety/events', data);
    return res.data.data;
  },
  updateSAEStatus: async (id, status) => {
    const res = await apiClient.patch(`/safety/events/${id}`, { status });
    return [res.data.data];
  },

  // --- Alerts ---
  getAlerts: async () => {
    const res = await apiClient.get('/alerts');
    return res.data.data;
  },
  acknowledgeAlert: async (id) => {
    const res = await apiClient.patch(`/alerts/${id}/acknowledge`);
    return [res.data.data];
  },

  // --- Audit Logs ---
  getAuditLogs: async () => {
    const res = await apiClient.get('/audit-logs');
    return res.data.data;
  },

  // --- Others (Mock if no backend exact match) ---
  getComplianceData: async () => {
    // Return dummy since backend might not have complex analytics aggregated yet
    return (await import('../data/dummyData')).complianceData;
  },
  getRecruitmentTrend: async () => {
    return (await import('../data/dummyData')).recruitmentTrend;
  },
  getReportsCatalog: async () => {
    return (await import('../data/dummyData')).reportsCatalog;
  },

  resetData: () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
};

export default api;
