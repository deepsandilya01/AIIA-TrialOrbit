import {
  studies as defaultStudies,
  sites as defaultSites,
  alerts as defaultAlerts,
  aesaeData as defaultAesae,
  auditLogs as defaultAuditLogs,
  complianceData,
  recruitmentTrend,
  protocolDeviations,
  reportsCatalog
} from '../data/dummyData';

const STORAGE_KEYS = {
  STUDIES: 'trialorbit_studies',
  ALERTS: 'trialorbit_alerts',
  AESAE: 'trialorbit_aesae',
  AUDIT: 'trialorbit_audit'
};

const getStored = (key, fallback) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from sessionStorage`, err);
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to sessionStorage`, err);
  }
};

export const api = {
  // Studies
  getStudies: async () => {
    return getStored(STORAGE_KEYS.STUDIES, defaultStudies);
  },

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
      status: 'Ongoing',
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

    // Auto-record audit log entry
    await api.recordAuditLog({
      action: 'CREATE',
      entity: `Study ${studyWithDefaults.id}`,
      oldVal: '-',
      newVal: studyWithDefaults.title,
      user: 'Current User (PI)'
    });

    return studyWithDefaults;
  },

  // Sites
  getSites: async () => {
    return defaultSites;
  },

  getSiteById: async (id) => {
    return defaultSites.find((s) => s.id === id) || defaultSites[0];
  },

  // Safety / SAE
  getSafetyEvents: async () => {
    return getStored(STORAGE_KEYS.AESAE, defaultAesae);
  },

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

  // Alerts
  getAlerts: async () => {
    return getStored(STORAGE_KEYS.ALERTS, defaultAlerts);
  },

  acknowledgeAlert: async (id) => {
    const current = getStored(STORAGE_KEYS.ALERTS, defaultAlerts);
    const updated = current.map((a) => (a.id === id ? { ...a, resolved: true } : a));
    setStored(STORAGE_KEYS.ALERTS, updated);
    return updated;
  },

  // Audit Logs
  getAuditLogs: async () => {
    return getStored(STORAGE_KEYS.AUDIT, defaultAuditLogs);
  },

  recordAuditLog: async ({ action, entity, oldVal, newVal, user = 'System User' }) => {
    const current = getStored(STORAGE_KEYS.AUDIT, defaultAuditLogs);
    const newLog = {
      id: current.length + 1,
      time: new Date().toLocaleString('en-GB') + ' IST',
      user,
      action,
      entity,
      oldVal,
      newVal,
      ip: '10.24.1.42'
    };
    const updated = [newLog, ...current];
    setStored(STORAGE_KEYS.AUDIT, updated);
    return newLog;
  },

  // Reports, Compliance, Trends
  getComplianceData: async () => complianceData,
  getRecruitmentTrend: async () => recruitmentTrend,
  getProtocolDeviations: async () => protocolDeviations,
  getReportsCatalog: async () => reportsCatalog
};

export default api;
