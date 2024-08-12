import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from './AppRoutes';

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <AppRoutes />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
