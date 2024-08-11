import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import { useCreateUser } from '@/hooks/useUsers';
import { useToast } from "@/components/ui/use-toast";
import { useEmployees } from '@/hooks/useEmployees';

const CreateUser = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    emp_id: '',
  });
  const { data: employees, isLoading: isLoadingEmployees, isError: isEmployeesError } = useEmployees();
  const createUser = useCreateUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setUserData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(userData);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      navigate('/admin-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Create New User</h1>
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={userData.username} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={userData.email} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" value={userData.password} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={handleRoleChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emp_id">Employee</Label>
                    <Select onValueChange={(value) => setUserData(prev => ({ ...prev, emp_id: value }))} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingEmployees && <SelectItem value="">Loading employees...</SelectItem>}
                        {isEmployeesError && <SelectItem value="">Error loading employees</SelectItem>}
                        {employees && employees.length > 0 ? (
                          employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id?.toString() || ''}>
                              {employee.name} ({employee.emp_id})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="">No employees available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={createUser.isLoading}>
                    {createUser.isLoading ? 'Creating...' : 'Create User'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateUser;
