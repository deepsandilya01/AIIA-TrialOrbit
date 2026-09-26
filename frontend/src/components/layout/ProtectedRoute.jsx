import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canAccessRoute } from '../../config/permissions';
import { ShieldOff } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles, requiredPermission }) => {
  const auth = useAuth();
  const user   = auth?.user    ?? null;
  const loading = auth?.loading ?? true;
  const location = useLocation();

  // Auth state is still being restored from storage — render nothing (no redirect flash)
  if (loading) return null;

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user.role;

  // Role whitelist check (for admin-only routes defined in AppRoutes)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <ForbiddenPage role={role} path={location.pathname} />;
  }

  // Single required permission check
  if (requiredPermission && !canAccessRoute(role, location.pathname)) {
    return <ForbiddenPage role={role} path={location.pathname} />;
  }

  // Centralized route permission check (catches direct URL access)
  if (!canAccessRoute(role, location.pathname)) {
    return <ForbiddenPage role={role} path={location.pathname} />;
  }

  return children;
};

const ForbiddenPage = ({ role, path }) => {
  const getResourceName = (p) => {
    const base = p.split('/')[1] || 'page';
    return base.charAt(0).toUpperCase() + base.slice(1);
  };

  const getRoleMessage = (r) => {
    if (r === 'REGULATOR') return "Regulatory Authority access is strictly read-only and limited to compliance oversight modules. This action or resource is not available for your role.";
    return `Your current role, ${r}, does not have permission to access this resource.`;
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', backgroundColor: 'var(--bg-off-white)' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--danger)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fee2e2', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          <ShieldOff size={32} />
        </div>
        
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--charcoal)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Access Restricted
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {getRoleMessage(role)}
        </p>

        <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--border-radius)', padding: '1rem', marginBottom: '2rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Current Role</span>
            <div style={{ fontWeight: 600, color: 'var(--deep-green)' }}>{role}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Requested Resource</span>
            <div style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{getResourceName(path)} Management</div>
          </div>
        </div>

        <a
          href="/dashboard"
          className="btn btn-primary w-full"
          style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.75rem' }}
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default ProtectedRoute;
