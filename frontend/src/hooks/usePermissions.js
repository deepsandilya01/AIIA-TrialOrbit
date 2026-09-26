/**
 * usePermissions — hook providing role-aware permission checks
 * bound to the currently authenticated user.
 */
import { useAuth } from '../context/AuthContext';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  canPerformAction,
  canSeeWidget,
  isReadOnly,
  isAdmin,
  getNavForRole,
  ROLE_META,
} from '../config/permissions';

const usePermissions = () => {
  const auth = useAuth();
  const role = auth?.user?.role || null;

  return {
    role,
    user: auth?.user || null,

    /** Check a single permission */
    can:         (permission)    => role ? hasPermission(role, permission)         : false,
    /** Check if user has at least one of the given permissions */
    canAny:      (permissions)   => role ? hasAnyPermission(role, permissions)     : false,
    /** Check if user has all of the given permissions */
    canAll:      (permissions)   => role ? hasAllPermissions(role, permissions)    : false,
    /** Check if user can access a route path */
    canRoute:    (path)          => role ? canAccessRoute(role, path)              : false,
    /** Check if user can perform a named action */
    canDo:       (action)        => role ? canPerformAction(role, action)          : false,
    /** Check if a dashboard widget is visible */
    canWidget:   (widgetKey)     => role ? canSeeWidget(role, widgetKey)           : false,
    /** True if the role is read-only (REGULATOR) */
    readOnly:    isReadOnly(role),
    /** True if the role is ADMIN */
    isAdmin:     isAdmin(role),
    /** Filtered navigation items for the current user's role */
    navItems:    getNavForRole(role),
    /** Role display metadata (label, color, badge) */
    roleMeta:    role ? (ROLE_META[role] || {}) : {},
  };
};

export default usePermissions;
