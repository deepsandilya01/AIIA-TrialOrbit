import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-danger mb-4">403 Forbidden</h2>
        <p className="text-secondary mb-4">Your role ({user.role}) is not authorized to access this module.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
