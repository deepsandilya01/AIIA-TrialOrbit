/**
 * AIIA TrialOrbit — Centralized RBAC Permission Configuration
 * Single source of truth for all role-based access decisions.
 *
 * ROLE → PERMISSIONS → NAVIGATION → ROUTES → ACTIONS → DASHBOARD WIDGETS
 *
 * CANONICAL ROLES: ADMIN | PI | COORDINATOR | MONITOR | ETHICS | PHARMACOVIGILANCE | REGULATOR
 */

// ─── 1. PERMISSION DEFINITIONS ─────────────────────────────────────────────
export const PERMISSIONS = {
  // Studies
  STUDY_VIEW:         'study.view',
  STUDY_CREATE:       'study.create',
  STUDY_UPDATE:       'study.update',
  STUDY_LIFECYCLE:    'study.lifecycle',

  // Sites
  SITE_VIEW:          'site.view',
  SITE_CREATE:        'site.create',
  SITE_UPDATE:        'site.update',

  // Participants
  PARTICIPANT_VIEW:   'participant.view',
  PARTICIPANT_CREATE: 'participant.create',
  PARTICIPANT_UPDATE: 'participant.update',
  PARTICIPANT_CONSENT: 'participant.consent',

  // Visits
  VISIT_VIEW:         'visit.view',
  VISIT_CREATE:       'visit.create',
  VISIT_UPDATE:       'visit.update',
  VISIT_COMPLETE:     'visit.complete',

  // Recruitment
  RECRUITMENT_VIEW:   'recruitment.view',

  // Data Quality
  QUERY_VIEW:         'query.view',
  QUERY_CREATE:       'query.create',
  QUERY_RESOLVE:      'query.resolve',
  DEVIATION_VIEW:     'deviation.view',
  DEVIATION_CREATE:   'deviation.create',
  DEVIATION_UPDATE:   'deviation.update',

  // Regulatory / Ethics
  REGULATORY_VIEW:    'regulatory.view',
  REGULATORY_CREATE:  'regulatory.create',
  REGULATORY_UPDATE:  'regulatory.update',
  ETHICS_VIEW:        'ethics.view',
  ETHICS_REVIEW:      'ethics.review',

  // Safety / PV
  SAFETY_VIEW:        'safety.view',
  SAFETY_CREATE:      'safety.create',
  SAFETY_UPDATE:      'safety.update',
  PV_REVIEW:          'safety.pv_review',

  // Alerts
  ALERT_VIEW:         'alert.view',
  ALERT_ACKNOWLEDGE:  'alert.acknowledge',

  // Reports / Exports
  REPORT_VIEW:        'report.view',
  EXPORT_FHIR:        'export.fhir',
  EXPORT_CDISC:       'export.cdisc',

  // Audit
  AUDIT_VIEW:         'audit.view',

  // Administration
  USER_VIEW:          'user.view',
  USER_CREATE:        'user.create',
  USER_UPDATE:        'user.update',
  USER_ROLE_CHANGE:   'user.role_change',

  // AI / Insights
  AI_VIEW:            'ai.view',
};

// ─── 2. ROLE → PERMISSION SETS ──────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  ADMIN: Object.values(PERMISSIONS), // full access

  PI: [
    PERMISSIONS.STUDY_VIEW, PERMISSIONS.STUDY_CREATE, PERMISSIONS.STUDY_UPDATE, PERMISSIONS.STUDY_LIFECYCLE,
    PERMISSIONS.SITE_VIEW,
    PERMISSIONS.PARTICIPANT_VIEW, PERMISSIONS.PARTICIPANT_UPDATE, PERMISSIONS.PARTICIPANT_CONSENT,
    PERMISSIONS.VISIT_VIEW,
    PERMISSIONS.RECRUITMENT_VIEW,
    PERMISSIONS.QUERY_VIEW, PERMISSIONS.QUERY_CREATE,
    PERMISSIONS.DEVIATION_VIEW, PERMISSIONS.DEVIATION_UPDATE,
    PERMISSIONS.REGULATORY_VIEW, PERMISSIONS.REGULATORY_CREATE, PERMISSIONS.REGULATORY_UPDATE,
    PERMISSIONS.ETHICS_VIEW,
    PERMISSIONS.SAFETY_VIEW, PERMISSIONS.SAFETY_CREATE,
    PERMISSIONS.ALERT_VIEW, PERMISSIONS.ALERT_ACKNOWLEDGE,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AI_VIEW,
  ],

  COORDINATOR: [
    PERMISSIONS.STUDY_VIEW,
    PERMISSIONS.SITE_VIEW,
    PERMISSIONS.PARTICIPANT_VIEW, PERMISSIONS.PARTICIPANT_CREATE, PERMISSIONS.PARTICIPANT_UPDATE, PERMISSIONS.PARTICIPANT_CONSENT,
    PERMISSIONS.VISIT_VIEW, PERMISSIONS.VISIT_CREATE, PERMISSIONS.VISIT_UPDATE, PERMISSIONS.VISIT_COMPLETE,
    PERMISSIONS.RECRUITMENT_VIEW,
    PERMISSIONS.QUERY_VIEW, PERMISSIONS.QUERY_CREATE, PERMISSIONS.QUERY_RESOLVE,
    PERMISSIONS.DEVIATION_VIEW, PERMISSIONS.DEVIATION_CREATE, PERMISSIONS.DEVIATION_UPDATE,
    PERMISSIONS.ALERT_VIEW, PERMISSIONS.ALERT_ACKNOWLEDGE,
    PERMISSIONS.SAFETY_VIEW, PERMISSIONS.SAFETY_CREATE,
  ],

  MONITOR: [
    PERMISSIONS.STUDY_VIEW,
    PERMISSIONS.SITE_VIEW,
    PERMISSIONS.PARTICIPANT_VIEW,
    PERMISSIONS.VISIT_VIEW,
    PERMISSIONS.RECRUITMENT_VIEW,
    PERMISSIONS.QUERY_VIEW, PERMISSIONS.QUERY_CREATE,
    PERMISSIONS.DEVIATION_VIEW, PERMISSIONS.DEVIATION_CREATE,
    PERMISSIONS.SAFETY_VIEW,
    PERMISSIONS.ALERT_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.AI_VIEW,
  ],

  ETHICS: [
    PERMISSIONS.STUDY_VIEW,
    PERMISSIONS.ETHICS_VIEW, PERMISSIONS.ETHICS_REVIEW,
    PERMISSIONS.REGULATORY_VIEW, PERMISSIONS.REGULATORY_CREATE, PERMISSIONS.REGULATORY_UPDATE,
    PERMISSIONS.PARTICIPANT_VIEW,
    PERMISSIONS.SAFETY_VIEW,
    PERMISSIONS.ALERT_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],

  PHARMACOVIGILANCE: [
    PERMISSIONS.STUDY_VIEW,
    PERMISSIONS.SITE_VIEW,
    PERMISSIONS.PARTICIPANT_VIEW,
    PERMISSIONS.SAFETY_VIEW, PERMISSIONS.SAFETY_CREATE, PERMISSIONS.SAFETY_UPDATE, PERMISSIONS.PV_REVIEW,
    PERMISSIONS.ALERT_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.EXPORT_FHIR,
    PERMISSIONS.AI_VIEW,
  ],

  REGULATOR: [
    PERMISSIONS.STUDY_VIEW,
    PERMISSIONS.SITE_VIEW,
    PERMISSIONS.REGULATORY_VIEW,
    PERMISSIONS.ETHICS_VIEW,
    PERMISSIONS.SAFETY_VIEW,
    PERMISSIONS.DEVIATION_VIEW,
    PERMISSIONS.ALERT_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.EXPORT_FHIR,
    PERMISSIONS.EXPORT_CDISC,
  ],
};

// ─── 3. PERMISSION HELPERS ──────────────────────────────────────────────────
export const getPermissions = (role) => ROLE_PERMISSIONS[role] || [];

export const hasPermission = (role, permission) =>
  getPermissions(role).includes(permission);

export const hasAnyPermission = (role, permissions) =>
  permissions.some(p => hasPermission(role, p));

export const hasAllPermissions = (role, permissions) =>
  permissions.every(p => hasPermission(role, p));

export const isReadOnly = (role) => role === 'REGULATOR';

export const isAdmin = (role) => role === 'ADMIN';

export const canCreate = (role, resource) =>
  hasPermission(role, `${resource}.create`);

export const canUpdate = (role, resource) =>
  hasPermission(role, `${resource}.update`);

// ─── 4. NAVIGATION CONFIGURATION ───────────────────────────────────────────
// Each item specifies which permissions are required to see it.
// ALL listed permissions must be present (AND logic), unless `anyPermission` is used (OR logic).

import {
  LayoutDashboard, FlaskConical, Building2, Users, CalendarCheck,
  MessageSquareWarning, AlertCircle, ShieldCheck, FileSignature, Flag,
  AlertTriangle, Pill, Activity, Bell, LineChart,
  History, Network, Database, DownloadCloud,
  Sparkles, Radar, UserCog, Shield, Lock, ClipboardList, TrendingUp
} from 'lucide-react';

export const NAV_CONFIG = [
  {
    group: '',
    items: [
      {
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
        roles: ['ADMIN', 'PI', 'COORDINATOR', 'MONITOR', 'ETHICS', 'PHARMACOVIGILANCE', 'REGULATOR'],
      },
    ],
  },
  {
    group: 'CLINICAL TRIALS',
    items: [
      {
        path: '/studies',
        icon: FlaskConical,
        label: 'Studies',
        permission: PERMISSIONS.STUDY_VIEW,
      },
      {
        path: '/sites',
        icon: Building2,
        label: 'Sites',
        permission: PERMISSIONS.SITE_VIEW,
      },
      {
        path: '/participants',
        icon: Users,
        label: 'Participants',
        permission: PERMISSIONS.PARTICIPANT_VIEW,
      },
      {
        path: '/visits',
        icon: CalendarCheck,
        label: 'Visits',
        permission: PERMISSIONS.VISIT_VIEW,
      },
      {
        path: '/recruitment',
        icon: TrendingUp,
        label: 'Recruitment',
        permission: PERMISSIONS.RECRUITMENT_VIEW,
      },
    ],
  },
  {
    group: 'DATA QUALITY',
    items: [
      {
        path: '/queries',
        icon: MessageSquareWarning,
        label: 'Queries',
        permission: PERMISSIONS.QUERY_VIEW,
        badgeVariant: 'warning',
      },
      {
        path: '/deviations',
        icon: AlertCircle,
        label: 'Deviations',
        permission: PERMISSIONS.DEVIATION_VIEW,
      },
    ],
  },
  {
    group: 'REGULATORY & ETHICS',
    items: [
      {
        path: '/ethics',
        icon: ShieldCheck,
        label: 'Ethics / IEC',
        permission: PERMISSIONS.ETHICS_VIEW,
      },
      {
        path: '/ctri',
        icon: FileSignature,
        label: 'CTRI Registry',
        permission: PERMISSIONS.REGULATORY_VIEW,
      },
      {
        path: '/milestones',
        icon: Flag,
        label: 'Milestones',
        permission: PERMISSIONS.REGULATORY_VIEW,
      },
    ],
  },
  {
    group: 'SAFETY',
    items: [
      {
        path: '/safety-events',
        icon: AlertTriangle,
        label: 'AE / SAE',
        permission: PERMISSIONS.SAFETY_VIEW,
        badgeVariant: 'danger',
      },
      {
        path: '/pharmacovigilance',
        icon: Pill,
        label: 'Pharmacovigilance',
        permission: PERMISSIONS.SAFETY_VIEW,
        // Only visible to PV/ADMIN/PI
        roles: ['ADMIN', 'PI', 'PHARMACOVIGILANCE'],
      },
      {
        path: '/safety-dashboard',
        icon: Activity,
        label: 'Safety Dashboard',
        permission: PERMISSIONS.SAFETY_VIEW,
      },
    ],
  },
  {
    group: 'MONITORING',
    items: [
      {
        path: '/alerts',
        icon: Bell,
        label: 'Alerts',
        permission: PERMISSIONS.ALERT_VIEW,
        badgeVariant: 'warning',
      },
      {
        path: '/compliance',
        icon: ClipboardList,
        label: 'Compliance',
        roles: ['ADMIN', 'PI', 'ETHICS', 'REGULATOR'],
      },
      {
        path: '/reports',
        icon: LineChart,
        label: 'Reports',
        permission: PERMISSIONS.REPORT_VIEW,
      },
    ],
  },
  {
    group: 'AUDIT & INTEGRITY',
    items: [
      {
        path: '/audit',
        icon: History,
        label: 'Audit Trail',
        permission: PERMISSIONS.AUDIT_VIEW,
      },
    ],
  },
  {
    group: 'INTEROPERABILITY',
    items: [
      {
        path: '/fhir',
        icon: Network,
        label: 'FHIR / ABDM',
        permission: PERMISSIONS.EXPORT_FHIR,
      },
      {
        path: '/cdisc',
        icon: Database,
        label: 'CDISC',
        permission: PERMISSIONS.EXPORT_CDISC,
      },
      {
        path: '/exports',
        icon: DownloadCloud,
        label: 'Exports',
        anyPermission: [PERMISSIONS.EXPORT_FHIR, PERMISSIONS.EXPORT_CDISC, PERMISSIONS.REPORT_VIEW],
        roles: ['ADMIN', 'PI', 'PHARMACOVIGILANCE', 'REGULATOR'],
      },
    ],
  },
  {
    group: 'AI INTELLIGENCE',
    items: [
      {
        path: '/ai-assistant',
        icon: Sparkles,
        label: 'KPI Assistant',
        permission: PERMISSIONS.AI_VIEW,
      },
      {
        path: '/insights',
        icon: Radar,
        label: 'Risk Insights',
        permission: PERMISSIONS.AI_VIEW,
      },
    ],
  },
  {
    group: 'ADMINISTRATION',
    items: [
      {
        path: '/users',
        icon: UserCog,
        label: 'Users',
        permission: PERMISSIONS.USER_VIEW,
      },
      {
        path: '/roles',
        icon: Shield,
        label: 'Roles & Access',
        permission: PERMISSIONS.USER_VIEW,
      },
    ],
  },
];

/**
 * Returns the nav sections visible to a given role.
 * Empty sections (all items filtered out) are automatically omitted.
 */
export const getNavForRole = (role) => {
  if (!role) return [];

  const userPerms = getPermissions(role);

  const isItemVisible = (item) => {
    // Explicit roles whitelist
    if (item.roles && item.roles.length > 0) {
      return item.roles.includes(role);
    }
    // Permission check (single required permission)
    if (item.permission) {
      return userPerms.includes(item.permission);
    }
    // OR-permission check
    if (item.anyPermission) {
      return item.anyPermission.some(p => userPerms.includes(p));
    }
    // No restriction — visible to all authenticated
    return true;
  };

  return NAV_CONFIG
    .map(section => ({
      ...section,
      items: section.items.filter(isItemVisible),
    }))
    .filter(section => section.items.length > 0);
};

// ─── 5. ROUTE ACCESS MATRIX ─────────────────────────────────────────────────
// Maps each frontend route to the permissions required to access it.
// Used by ProtectedRoute for direct URL protection.
export const ROUTE_PERMISSIONS = {
  '/dashboard':         null,                          // all authenticated
  '/studies':           PERMISSIONS.STUDY_VIEW,
  '/sites':             PERMISSIONS.SITE_VIEW,
  '/participants':      PERMISSIONS.PARTICIPANT_VIEW,
  '/visits':            PERMISSIONS.VISIT_VIEW,
  '/recruitment':       PERMISSIONS.RECRUITMENT_VIEW,
  '/queries':           PERMISSIONS.QUERY_VIEW,
  '/deviations':        PERMISSIONS.DEVIATION_VIEW,
  '/ethics':            PERMISSIONS.ETHICS_VIEW,
  '/ctri':              PERMISSIONS.REGULATORY_VIEW,
  '/milestones':        PERMISSIONS.REGULATORY_VIEW,
  '/compliance':        PERMISSIONS.REGULATORY_VIEW,
  '/safety-events':     PERMISSIONS.SAFETY_VIEW,
  '/pharmacovigilance': PERMISSIONS.SAFETY_VIEW,
  '/safety-dashboard':  PERMISSIONS.SAFETY_VIEW,
  '/alerts':            PERMISSIONS.ALERT_VIEW,
  '/reports':           PERMISSIONS.REPORT_VIEW,
  '/audit':             PERMISSIONS.AUDIT_VIEW,
  '/fhir':              PERMISSIONS.EXPORT_FHIR,
  '/cdisc':             PERMISSIONS.EXPORT_CDISC,
  '/exports':           PERMISSIONS.REPORT_VIEW,
  '/ai-assistant':      PERMISSIONS.AI_VIEW,
  '/insights':          PERMISSIONS.AI_VIEW,
  '/users':             PERMISSIONS.USER_VIEW,
  '/roles':             PERMISSIONS.USER_VIEW,
  '/permissions':       PERMISSIONS.USER_VIEW,
};

/**
 * Returns true if the user's role can access the given path.
 * Handles prefix matching for detail routes like /studies/:id
 */
export const canAccessRoute = (role, path) => {
  const userPerms = getPermissions(role);

  // Find the best matching route prefix
  const matchedKey = Object.keys(ROUTE_PERMISSIONS)
    .filter(k => path.startsWith(k))
    .sort((a, b) => b.length - a.length)[0]; // longest match wins

  if (!matchedKey) return true; // unknown route = allow (404 handles it)

  const requiredPerm = ROUTE_PERMISSIONS[matchedKey];
  if (!requiredPerm) return true; // no restriction

  return userPerms.includes(requiredPerm);
};

// ─── 6. ROLE DISPLAY METADATA ───────────────────────────────────────────────
export const ROLE_META = {
  ADMIN: {
    label: 'System Administrator',
    color: 'var(--danger)',
    badge: 'badge-danger',
    description: 'Full institutional administrative access',
  },
  PI: {
    label: 'Principal Investigator',
    color: 'var(--primary-color)',
    badge: 'badge-primary',
    description: 'Clinical study design, oversight & safety responsibility',
  },
  COORDINATOR: {
    label: 'Study Coordinator',
    color: 'var(--success)',
    badge: 'badge-success',
    description: 'Day-to-day operational execution of assigned study/site',
  },
  MONITOR: {
    label: 'Clinical Monitor (CRA)',
    color: 'var(--accent-color)',
    badge: 'badge-warning',
    description: 'Site monitoring, SDV, data quality oversight',
  },
  ETHICS: {
    label: 'Ethics Committee',
    color: '#8b5cf6',
    badge: 'badge-default',
    description: 'IEC/IRB ethics review and protocol approval oversight',
  },
  PHARMACOVIGILANCE: {
    label: 'Pharmacovigilance Officer',
    color: '#ef4444',
    badge: 'badge-danger',
    description: 'Safety signal detection, AE/SAE review and pharmacovigilance',
  },
  REGULATOR: {
    label: 'Regulatory Authority',
    color: 'var(--text-secondary)',
    badge: 'badge-default',
    description: 'Read-only regulatory inspection and compliance oversight',
  },
};

// ─── 7. DASHBOARD WIDGET VISIBILITY ─────────────────────────────────────────
export const DASHBOARD_WIDGETS = {
  ADMIN: [
    'active_studies', 'total_sites', 'total_participants', 'recruitment_progress',
    'visit_compliance', 'open_queries', 'open_deviations', 'pending_regulatory',
    'ae_count', 'sae_count', 'overdue_sae', 'active_alerts',
    'study_portfolio_chart', 'recent_alerts', 'study_progress',
    'compliance_overview', 'safety_overview', 'quick_actions_admin',
  ],
  PI: [
    'active_studies', 'total_participants', 'recruitment_progress',
    'visit_compliance', 'open_queries', 'open_deviations',
    'sae_count', 'active_alerts', 'pending_regulatory',
    'study_portfolio_chart', 'recent_alerts', 'study_progress',
    'quick_actions_pi',
  ],
  COORDINATOR: [
    'total_participants', 'visit_compliance', 'open_queries',
    'open_deviations', 'active_alerts',
    'recent_alerts', 'quick_actions_coordinator',
  ],
  MONITOR: [
    'active_studies', 'total_sites', 'total_participants',
    'visit_compliance', 'open_queries', 'open_deviations',
    'recruitment_progress', 'active_alerts',
    'recent_alerts', 'study_progress',
  ],
  ETHICS: [
    'active_studies', 'pending_regulatory', 'open_deviations',
    'sae_count', 'active_alerts',
    'compliance_overview', 'recent_alerts',
  ],
  PHARMACOVIGILANCE: [
    'ae_count', 'sae_count', 'overdue_sae', 'active_alerts',
    'safety_overview', 'recent_alerts', 'quick_actions_pv',
  ],
  REGULATOR: [
    'active_studies', 'total_sites', 'pending_regulatory',
    'sae_count', 'open_deviations', 'active_alerts',
    'compliance_overview', 'recent_alerts',
  ],
};

export const canSeeWidget = (role, widgetKey) =>
  (DASHBOARD_WIDGETS[role] || []).includes(widgetKey);

// ─── 8. ACTION PERMISSION HELPERS ───────────────────────────────────────────
export const ACTION_PERMISSIONS = {
  createStudy:           [PERMISSIONS.STUDY_CREATE],
  editStudy:             [PERMISSIONS.STUDY_UPDATE],
  advanceStudyLifecycle: [PERMISSIONS.STUDY_LIFECYCLE],
  createSite:            [PERMISSIONS.SITE_CREATE],
  editSite:              [PERMISSIONS.SITE_UPDATE],
  createParticipant:     [PERMISSIONS.PARTICIPANT_CREATE],
  editParticipant:       [PERMISSIONS.PARTICIPANT_UPDATE],
  updateConsent:         [PERMISSIONS.PARTICIPANT_CONSENT],
  createVisit:           [PERMISSIONS.VISIT_CREATE],
  completeVisit:         [PERMISSIONS.VISIT_COMPLETE],
  createQuery:           [PERMISSIONS.QUERY_CREATE],
  resolveQuery:          [PERMISSIONS.QUERY_RESOLVE],
  createDeviation:       [PERMISSIONS.DEVIATION_CREATE],
  updateDeviation:       [PERMISSIONS.DEVIATION_UPDATE],
  createMilestone:       [PERMISSIONS.REGULATORY_CREATE],
  updateMilestone:       [PERMISSIONS.REGULATORY_UPDATE],
  ethicsReview:          [PERMISSIONS.ETHICS_REVIEW],
  reportSAE:             [PERMISSIONS.SAFETY_CREATE],
  updateSAE:             [PERMISSIONS.SAFETY_UPDATE],
  pvReview:              [PERMISSIONS.PV_REVIEW],
  acknowledgeAlert:      [PERMISSIONS.ALERT_ACKNOWLEDGE],
  manageUsers:           [PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE],
  changeUserRole:        [PERMISSIONS.USER_ROLE_CHANGE],
  exportFHIR:            [PERMISSIONS.EXPORT_FHIR],
  exportCDISC:           [PERMISSIONS.EXPORT_CDISC],
};

export const canPerformAction = (role, action) => {
  const requiredPerms = ACTION_PERMISSIONS[action];
  if (!requiredPerms) return false;
  const userPerms = getPermissions(role);
  return requiredPerms.every(p => userPerms.includes(p));
};
