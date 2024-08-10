import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { SupabaseAuthProvider, useSupabaseAuth } from '@/integrations/supabase/auth';
import RoleBasedRoute from './components/RoleBasedRoute';
import Index from './pages/Index';
import Unauthorized from '@/pages/Unauthorized';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useSupabaseAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={
        loading ? (
          <div>Loading...</div>
        ) : session ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Index />
        )
      } />
      <Route path="/dashboard" element={
        <RoleBasedRoute roles={['admin', 'manager', 'employee', 'hr']}>
          <Dashboard />
        </RoleBasedRoute>
      } />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {navItems.map(({ to, page, roles }) => (
        <Route 
          key={to} 
          path={to} 
          element={
            <RoleBasedRoute roles={roles}>
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
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
