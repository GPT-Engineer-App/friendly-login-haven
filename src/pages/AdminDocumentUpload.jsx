import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import DocumentUpload from '@/components/DocumentUpload';
import { useUsers } from '@/hooks/useUsers';

const AdminDocumentUpload = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const { data: users, isLoading, isError } = useUsers();

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Document Upload</h1>
            <Card>
              <CardHeader>
                <CardTitle>Upload Document for User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedUserId && <DocumentUpload userId={selectedUserId} adminMode={true} />}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDocumentUpload;
