import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from '@/components/Sidebar';
import { useEmployee, useUpdateEmployee } from '@/hooks/useEmployees';
import { useToast } from "@/components/ui/use-toast";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, isLoading, isError } = useEmployee(id);
  const updateEmployee = useUpdateEmployee();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    emp_id: '',
    name: '',
    designation: '',
    date_of_joining: '',
    phone_no: '',
    email: '',
    address: '',
    dob: '',
    emergency_contact_no: '',
  });

  React.useEffect(() => {
    if (employee) {
      setFormData({
        emp_id: employee.emp_id || '',
        name: employee.name || '',
        designation: employee.designation || '',
        date_of_joining: employee.date_of_joining ? new Date(employee.date_of_joining).toISOString().split('T')[0] : '',
        phone_no: employee.phone_no || '',
        email: employee.email || '',
        address: employee.address || '',
        dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : '',
        emergency_contact_no: employee.emergency_contact_no || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee.mutateAsync({ id, ...formData });
      toast({
        title: "Success",
        description: "Employee information updated successfully",
      });
      navigate('/employee-list');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee information",
        variant: "destructive",
      });
    }
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
                    <Label htmlFor="emp_id">Employee ID</Label>
                    <Input id="emp_id" name="emp_id" value={formData.emp_id} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="date_of_joining">Date of Joining</Label>
                    <Input id="date_of_joining" name="date_of_joining" type="date" value={formData.date_of_joining} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone_no">Phone Number</Label>
                    <Input id="phone_no" name="phone_no" value={formData.phone_no} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_no">Emergency Contact Number</Label>
                    <Input id="emergency_contact_no" name="emergency_contact_no" value={formData.emergency_contact_no} onChange={handleChange} />
                  </div>
                  <Button type="submit" disabled={updateEmployee.isLoading}>
                    {updateEmployee.isLoading ? 'Updating...' : 'Update Employee'}
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

export default EditEmployee;
