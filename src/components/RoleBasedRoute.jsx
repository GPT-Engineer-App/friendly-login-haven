import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, roles, session }) => {
  if (!session) {
    return <Navigate to="/" replace />;
  }

  const userRole = session.user.user_metadata.role;

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
