import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import RoleBasedRoute from './components/RoleBasedRoute';
import Index from './pages/Index';
import Unauthorized from '@/pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from '@/context/AuthContext';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/dashboard" element={
        <RoleBasedRoute roles={['admin', 'manager', 'employee', 'hr']}>
          <Dashboard />
        </RoleBasedRoute>
      } />
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
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
