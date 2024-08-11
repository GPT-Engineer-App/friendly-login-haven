import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleBasedRoute from './components/RoleBasedRoute';
import Index from './pages/Index';
import Unauthorized from '@/pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from '@/pages/AddEmployee';
import EditEmployee from './pages/EditEmployee.jsx';
import EmployeeProfile from './pages/EmployeeProfile';
import SearchEmployees from './pages/SearchEmployees';
import { AuthProvider } from '@/context/AuthContext';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? "/admin-dashboard" : "/user-dashboard"} replace /> : <Index />} />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user-dashboard" element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/employee-list" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EmployeeList />
        </ProtectedRoute>
      } />
      <Route path="/add-employee" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AddEmployee />
        </ProtectedRoute>
      } />
      <Route path="/edit-employee/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EditEmployee />
        </ProtectedRoute>
      } />
      <Route path="/employee-profile/:id" element={
        <ProtectedRoute allowedRoles={['admin', 'user']}>
          <EmployeeProfile />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <SearchEmployees />
        </ProtectedRoute>
      } />
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
