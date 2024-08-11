import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import Index from './pages/Index';
import Unauthorized from '@/pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from '@/pages/AddEmployee';
import EditEmployee from './pages/EditEmployee.jsx';
import EmployeeProfile from './pages/EmployeeProfile.jsx';
import SearchEmployees from '@/pages/SearchEmployees';
import CreateUser from '@/pages/CreateUser';
import UserManagement from '@/pages/UserManagement';
import Reports from '@/pages/Reports';
import Analytics from '@/pages/Analytics';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

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
      <Route path="/create-user" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CreateUser />
        </ProtectedRoute>
      } />
      <Route path="/user-management" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
