import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from '@/components/Sidebar';
import { useUser } from '@/hooks/useUsers';

const UserDetails = () => {
  const { id } = useParams();
  const { data: user, isLoading, isError } = useUser(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Details</h1>
            <Card>
              <CardHeader>
                <CardTitle>{user.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Status:</strong> {user.status}</p>
                  <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
                  <p><strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleString()}</p>
                  {user.emp_id && <p><strong>Employee ID:</strong> {user.emp_id}</p>}
                  {/* Add more fields as needed */}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetails;
