import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Bell, Upload } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userInfo = [
    { title: 'Name', value: user?.employeeData?.name || 'N/A' },
    { title: 'Email', value: user?.email },
    { title: 'Employee ID', value: user?.employeeData?.emp_id || 'N/A' },
    { title: 'Designation', value: user?.employeeData?.designation || 'N/A' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">User Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, {user?.employeeData?.name || user?.email}</h2>
          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload userId={user?.id} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userInfo.map((item, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-semibold">{item.title}:</span> {item.value}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>No new announcements at this time.</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>This section contains general company information and policies.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
