import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from '@/components/Sidebar';
import { useAddEmployee } from '@/hooks/useEmployees';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AddEmployee = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState({
    emp_id: '',
    name: '',
    designation: '',
    date_of_joining: '',
    phone_no: '',
    email: '',
    address: '',
    dob: '',
    emergency_contact_no: '',
    created_by: user?.email || '',
  });

  const addEmployee = useAddEmployee();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addEmployee.mutateAsync(employeeData);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      navigate('/employee-list'); // Redirect to employee list after successful addition
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee. The employee record may have been created, but there was an issue with additional setup. Please check the employee list and try again if necessary.",
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
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Employee</h1>
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="emp_id">Employee ID</Label>
                    <Input id="emp_id" name="emp_id" value={employeeData.emp_id} onChange={handleChange} placeholder="Enter employee ID" required />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={employeeData.name} onChange={handleChange} placeholder="Enter full name" required />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" name="designation" value={employeeData.designation} onChange={handleChange} placeholder="Enter designation" required />
                  </div>
                  <div>
                    <Label htmlFor="date_of_joining">Date of Joining</Label>
                    <Input id="date_of_joining" name="date_of_joining" type="date" value={employeeData.date_of_joining} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone_no">Phone Number</Label>
                    <Input id="phone_no" name="phone_no" value={employeeData.phone_no} onChange={handleChange} placeholder="Enter phone number" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={employeeData.email} onChange={handleChange} placeholder="Enter email" required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" value={employeeData.address} onChange={handleChange} placeholder="Enter address" />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" value={employeeData.dob} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_no">Emergency Contact Number</Label>
                    <Input id="emergency_contact_no" name="emergency_contact_no" value={employeeData.emergency_contact_no} onChange={handleChange} placeholder="Enter emergency contact number" />
                  </div>
                  <Button type="submit" disabled={addEmployee.isLoading}>
                    {addEmployee.isLoading ? 'Adding...' : 'Add Employee'}
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

export default AddEmployee;
