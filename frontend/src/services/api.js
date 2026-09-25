import {
  studies as defaultStudies,
  sites as defaultSites,
  alerts as defaultAlerts,
  aesaeData as defaultAesae,
  auditLogs as defaultAuditLogs,
  complianceData as defaultCompliance,
  recruitmentTrend,
  protocolDeviations as defaultDeviations,
  reportsCatalog,
  participants as defaultParticipants,
  visits as defaultVisits,
  dataQueries as defaultQueries,
  milestones as defaultMilestones
} from '../data/dummyData';

const STORAGE_KEYS = {
  STUDIES: 'trialorbit_studies',
  ALERTS: 'trialorbit_alerts',
  AESAE: 'trialorbit_aesae',
  AUDIT: 'trialorbit_audit',
  PARTICIPANTS: 'trialorbit_participants',
  VISITS: 'trialorbit_visits',
  QUERIES: 'trialorbit_queries',
  DEVIATIONS: 'trialorbit_deviations',
  MILESTONES: 'trialorbit_milestones',
  SITES: 'trialorbit_sites'
};

const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
};

export const api = {
  // --- Studies ---
  getStudies: async () => getStored(STORAGE_KEYS.STUDIES, defaultStudies),
  getStudyById: async (id) => {
    const studies = getStored(STORAGE_KEYS.STUDIES, defaultStudies);
    return studies.find((s) => s.id === id) || studies[0];
  },
  createStudy: async (newStudy) => {
    const current = getStored(STORAGE_KEYS.STUDIES, defaultStudies);
    const studyWithDefaults = {
      id: `AIIA-00${current.length + 1}`,
      protocolId: `AIIA/CT/2026/0${20 + current.length}`,
      ctriNumber: `CTRI/2026/0${current.length}/089100`,
      status: 'Draft',
      progress: 0,
      participants: 0,
      sites: 1,
      dataQualityScore: 100,
      unresolvedQueries: 0,
      openDeviations: 0,
      startDate: new Date().toISOString().split('T')[0],
      ...newStudy
    };
    const updated = [studyWithDefaults, ...current];
    setStored(STORAGE_KEYS.STUDIES, updated);
    await api.recordAuditLog({
      action: 'CREATE',
      entity: `Study ${studyWithDefaults.id}`,
      oldVal: '-',
      newVal: studyWithDefaults.title,
      user: 'Current User'
    });
    return studyWithDefaults;
  },
  updateStudyStatus: async (id, status) => {
    const current = getStored(STORAGE_KEYS.STUDIES, defaultStudies);
    let oldStatus = '';
    const updated = current.map(s => {
      if (s.id === id) {
        oldStatus = s.status;
        return { ...s, status };
      }
      return s;
    });
    setStored(STORAGE_KEYS.STUDIES, updated);
    await api.recordAuditLog({
      action: 'UPDATE',
      entity: `Study ${id} Status`,
      oldVal: oldStatus,
      newVal: status,
      user: 'Current User'
    });
    return updated.find(s => s.id === id);
  },

  // --- Sites ---
  getSites: async () => getStored(STORAGE_KEYS.SITES, defaultSites),
  getSiteById: async (id) => {
    const sites = getStored(STORAGE_KEYS.SITES, defaultSites);
    return sites.find((s) => s.id === id) || sites[0];
  },

  // --- Participants ---
  getParticipants: async () => getStored(STORAGE_KEYS.PARTICIPANTS, defaultParticipants),
  getParticipantById: async (id) => {
    const parts = getStored(STORAGE_KEYS.PARTICIPANTS, defaultParticipants);
    return parts.find((p) => p.id === id) || parts[0];
  },

  // --- Visits ---
  getVisits: async () => getStored(STORAGE_KEYS.VISITS, defaultVisits),
  markVisitCompleted: async (id) => {
    const current = getStored(STORAGE_KEYS.VISITS, defaultVisits);
    const updated = current.map(v => {
      if (v.id === id) {
        return { ...v, status: 'Completed', completedDate: new Date().toISOString().split('T')[0], compliance: 100 };
      }
      return v;
    });
    setStored(STORAGE_KEYS.VISITS, updated);
    await api.recordAuditLog({
      action: 'UPDATE',
      entity: `Visit ${id}`,
      oldVal: 'Pending',
      newVal: 'Completed',
      user: 'Current User'
    });
    return updated;
  },

  // --- Data Queries ---
  getDataQueries: async () => getStored(STORAGE_KEYS.QUERIES, defaultQueries),
  resolveQuery: async (id) => {
    const current = getStored(STORAGE_KEYS.QUERIES, defaultQueries);
    const updated = current.map(q => {
      if (q.id === id) {
        return { ...q, status: 'Resolved', resolvedDate: new Date().toISOString().split('T')[0] };
      }
      return q;
    });
    setStored(STORAGE_KEYS.QUERIES, updated);
    await api.recordAuditLog({
      action: 'RESOLVE',
      entity: `Query ${id}`,
      oldVal: 'Open',
      newVal: 'Resolved',
      user: 'Current User'
    });
    return updated;
  },

  // --- Protocol Deviations ---
  getProtocolDeviations: async () => getStored(STORAGE_KEYS.DEVIATIONS, defaultDeviations),
  updateDeviationStatus: async (id, status) => {
    const current = getStored(STORAGE_KEYS.DEVIATIONS, defaultDeviations);
    let oldStatus = '';
    const updated = current.map(d => {
      if (d.id === id) {
        oldStatus = d.status;
        return { ...d, status };
      }
      return d;
    });
    setStored(STORAGE_KEYS.DEVIATIONS, updated);
    await api.recordAuditLog({
      action: 'UPDATE',
      entity: `Deviation ${id}`,
      oldVal: oldStatus,
      newVal: status,
      user: 'Current User'
    });
    return updated;
  },

  // --- Regulatory Milestones ---
  getMilestones: async () => getStored(STORAGE_KEYS.MILESTONES, defaultMilestones),
  completeMilestone: async (id) => {
    const current = getStored(STORAGE_KEYS.MILESTONES, defaultMilestones);
    const updated = current.map(m => {
      if (m.id === id) {
        return { ...m, status: 'Completed', completedDate: new Date().toISOString().split('T')[0] };
      }
      return m;
    });
    setStored(STORAGE_KEYS.MILESTONES, updated);
    await api.recordAuditLog({
      action: 'UPDATE',
      entity: `Milestone ${id}`,
      oldVal: 'Pending',
      newVal: 'Completed',
      user: 'Current User'
    });
    return updated;
  },

  // --- Safety / SAE ---
  getSafetyEvents: async () => getStored(STORAGE_KEYS.AESAE, defaultAesae),
  reportSAE: async (saePayload) => {
    const current = getStored(STORAGE_KEYS.AESAE, defaultAesae);
    const newEntry = {
      id: `SAE-${300 + current.length}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending Review',
      serious: 'Yes',
      ...saePayload
    };
    const updated = [newEntry, ...current];
    setStored(STORAGE_KEYS.AESAE, updated);
    await api.recordAuditLog({
      action: 'CREATE',
      entity: `Expedited SAE ${newEntry.id}`,
      oldVal: '-',
      newVal: `${newEntry.event} (${newEntry.participant})`,
      user: 'Pharmacovigilance Reporter'
    });
    return newEntry;
  },
  updateSAEStatus: async (id, status) => {
    const current = getStored(STORAGE_KEYS.AESAE, defaultAesae);
    let oldStatus = '';
    const updated = current.map(s => {
      if (s.id === id) {
        oldStatus = s.status;
        return { ...s, status };
      }
      return s;
    });
    setStored(STORAGE_KEYS.AESAE, updated);
    await api.recordAuditLog({
      action: 'UPDATE',
      entity: `SAE ${id}`,
      oldVal: oldStatus,
      newVal: status,
      user: 'Current User'
    });
    return updated;
  },

  // --- Alerts ---
  getAlerts: async () => getStored(STORAGE_KEYS.ALERTS, defaultAlerts),
  acknowledgeAlert: async (id) => {
    const current = getStored(STORAGE_KEYS.ALERTS, defaultAlerts);
    const updated = current.map((a) => (a.id === id ? { ...a, resolved: true } : a));
    setStored(STORAGE_KEYS.ALERTS, updated);
    await api.recordAuditLog({
      action: 'UPDATE',
      entity: `Alert ${id}`,
      oldVal: 'Unread',
      newVal: 'Acknowledged',
      user: 'Current User'
    });
    return updated;
  },

  // --- Audit Logs ---
  getAuditLogs: async () => getStored(STORAGE_KEYS.AUDIT, defaultAuditLogs),
  recordAuditLog: async ({ action, entity, oldVal, newVal, user = 'System User' }) => {
    const current = getStored(STORAGE_KEYS.AUDIT, defaultAuditLogs);
    const currentUserRole = localStorage.getItem('trialorbit_role') || user;
    const newLog = {
      id: current.length + 1,
      time: new Date().toLocaleString('en-GB') + ' IST',
      user: currentUserRole,
      action,
      entity,
      oldVal,
      newVal,
      ip: 'Demo Mode'
    };
    const updated = [newLog, ...current];
    setStored(STORAGE_KEYS.AUDIT, updated);
    return newLog;
  },

  // --- Static/Other Data ---
  getComplianceData: async () => defaultCompliance,
  getRecruitmentTrend: async () => recruitmentTrend,
  getReportsCatalog: async () => reportsCatalog,

  // Demo utilities
  resetData: () => {
    localStorage.clear();
    window.location.reload();
  }
};

export default api;
