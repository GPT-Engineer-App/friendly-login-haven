import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from '@/components/Sidebar';
import { useEmployee } from '@/hooks/useEmployees';

const EditEmployee = () => {
  const { id } = useParams();
  const { data: employee, isLoading, isError } = useEmployee(id);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add update employee logic here
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employee data</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Edit Employee</h1>
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={employee?.name} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={employee?.email} required />
                  </div>
                  <div>
                    <Label htmlFor="empId">Employee ID</Label>
                    <Input id="empId" defaultValue={employee?.emp_id} required />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" defaultValue={employee?.designation} required />
                  </div>
                  <Button type="submit">Update Employee</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEmployee;
