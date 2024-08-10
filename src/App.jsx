import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { SupabaseAuthProvider } from '@/integrations/supabase/auth';
import RoleBasedRoute from './components/RoleBasedRoute';
import Index from './pages/Index';

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
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
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
