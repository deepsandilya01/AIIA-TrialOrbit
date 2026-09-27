const rolePermissions = {
  ADMIN: ['*'], // Full access to everything
  PI: [
    'studies:read', 'studies:create', 'studies:update', 'studies:lifecycle-transition',
    'sites:read', 'sites:create', 'sites:update', 'sites:activate',
    'participants:read', 'participants:create', 'participants:update',
    'consent:read', 'consent:create', 'consent:withdraw',
    'visits:read', 'visits:create', 'visits:complete',
    'queries:read', 'queries:create', 'queries:resolve',
    'deviations:read', 'deviations:create', 'deviations:close',
    'regulatory:read', 'regulatory:create', 'regulatory:complete',
    'kpi:read',
    'alerts:read', 'alerts:update', 'alerts:acknowledge', 'alerts:resolve',
    'safety:read', 'safety:create', 'pv:read',
    'audit:read',
    'exports:read', 'exports:create',
    'fhir:read', 'cdisc:export',
    'ai:query'
  ],
  COORDINATOR: [
    'studies:read',
    'sites:read',
    'participants:read', 'participants:create', 'participants:update',
    'consent:read', 'consent:create',
    'visits:read', 'visits:create', 'visits:complete',
    'queries:read', 'queries:create', 'queries:resolve',
    'deviations:read', 'deviations:create',
    'kpi:read',
    'alerts:read',
    'safety:read', 'safety:create',
    'ai:query'
  ],
  MONITOR: [
    'studies:read',
    'sites:read',
    'participants:read',
    'consent:read',
    'visits:read',
    'queries:read', 'queries:create',
    'deviations:read', 'deviations:create',
    'regulatory:read',
    'kpi:read',
    'alerts:read',
    'safety:read',
    'audit:read',
    'ai:query'
  ],
  ETHICS: [
    'studies:read',
    'regulatory:read', 'regulatory:update', 'regulatory:complete',
    'safety:read',
    'ai:query'
  ],
  PHARMACOVIGILANCE: [
    'studies:read',
    'safety:read', 'safety:update',
    'pv:read', 'pv:update', 'pv:code',
    'alerts:read', 'alerts:acknowledge', 'alerts:resolve',
    'kpi:read',
    'ai:query'
  ],
  REGULATOR: [
    'studies:read',
    'sites:read',
    'participants:read',
    'visits:read',
    'queries:read',
    'deviations:read',
    'regulatory:read',
    'safety:read',
    'pv:read',
    'audit:read',
    'kpi:read',
    'alerts:read',
    'ai:query'
  ]
};

export const rbacMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    }

    const userRole = req.user.role;
    const permissions = rolePermissions[userRole] || [];

    if (permissions.includes('*')) {
      return next();
    }

    // Split permission request if needed (e.g. wildcards)
    const hasPermission = permissions.some(p => {
      if (p === requiredPermission) return true;
      if (p.endsWith('*')) {
        const prefix = p.replace('*', '');
        return requiredPermission.startsWith(prefix);
      }
      return false;
    });

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: `User role ${userRole} lacks permission: ${requiredPermission}` 
        } 
      });
    }

    next();
  };
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    
    next();
  };
};
