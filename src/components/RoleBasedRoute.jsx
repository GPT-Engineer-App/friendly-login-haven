import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const RoleBasedRoute = ({ children, roles }) => {
  const { session } = useSupabaseAuth();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const userRole = session.user.user_metadata.role;

  if (!roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
