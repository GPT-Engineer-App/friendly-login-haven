import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Calendar, UserPlus, Settings, FileText, BarChart2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useEmployees } from '@/hooks/useEmployees';
import { useUsers } from '@/hooks/useUsers';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: users, isLoading: usersLoading } = useUsers();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const metrics = [
    { title: 'Total Employees', value: employeesLoading ? '...' : employees?.length || 0, icon: Users },
    { title: 'Total Users', value: usersLoading ? '...' : users?.length || 0, icon: UserPlus },
    { title: 'User Management', value: 'Manage', icon: UserPlus, action: () => navigate('/user-management') },
    { title: 'Employee List', value: 'View', icon: Briefcase, action: () => navigate('/employee-list') },
    { title: 'User Management', value: 'Manage', icon: Settings, action: () => navigate('/user-management') },
    { title: 'Reports', value: 'Generate', icon: FileText, action: () => navigate('/reports') },
    { title: 'Analytics', value: 'View', icon: BarChart2, action: () => navigate('/analytics') },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, {user?.email}</h2>
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {metrics.map((item, index) => (
                <Card key={index} className={item.action ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''} onClick={item.action}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
