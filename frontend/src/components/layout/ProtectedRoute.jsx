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
    return <ForbiddenPage role={role} />;
  }

  // Single required permission check
  if (requiredPermission && !canAccessRoute(role, location.pathname)) {
    return <ForbiddenPage role={role} />;
  }

  // Centralized route permission check (catches direct URL access)
  if (!canAccessRoute(role, location.pathname)) {
    return <ForbiddenPage role={role} />;
  }

  return children;
};

const ForbiddenPage = ({ role }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <div style={{ color: 'var(--danger)', opacity: 0.7 }}>
      <ShieldOff size={52} />
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
      Access Restricted
    </h2>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>
      Your role <strong style={{ color: 'var(--primary-color)' }}>{role}</strong> does not have permission
      to access this module. If you believe this is an error, contact your system administrator.
    </p>
    <a
      href="/dashboard"
      style={{
        marginTop: '0.5rem',
        padding: '0.6rem 1.4rem',
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        borderRadius: 'var(--border-radius)',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      ← Return to Dashboard
    </a>
  </div>
);

export default ProtectedRoute;
