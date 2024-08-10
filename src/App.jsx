import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { supabase } from '@/integrations/supabase';
import RoleBasedRoute from './components/RoleBasedRoute';
import Index from './pages/Index';
import Unauthorized from '@/pages/Unauthorized';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/dashboard" element={
        <RoleBasedRoute roles={['admin', 'manager', 'employee', 'hr']} session={session}>
          <Dashboard />
        </RoleBasedRoute>
      } />
      {navItems.map(({ to, page, roles }) => (
        <Route 
          key={to} 
          path={to} 
          element={
            <RoleBasedRoute roles={roles} session={session}>
              {page}
            </RoleBasedRoute>
          } 
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
