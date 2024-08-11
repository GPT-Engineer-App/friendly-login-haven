import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase';
const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigateBasedOnRole(user.role);
    }
  }, [user]);

  const navigateBasedOnRole = (role) => {
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, email, password, role, status, emp_id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('User not found');
      }

      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      if (userData.status !== 'active') {
        throw new Error(`Your account is ${userData.status}. Please contact the administrator.`);
      }

      let employeeData = null;
      if (userData.emp_id) {
        const { data: empData, error: empError } = await supabase
          .from('employees')
          .select('*')
          .eq('emp_id', userData.emp_id)
          .single();

        if (empError) {
          console.error('Error fetching employee data:', empError);
        } else {
          employeeData = empData;
        }
      }

      await login({ 
        id: userData.user_id, 
        email: userData.email, 
        role: userData.role, 
        status: userData.status,
        emp_id: userData.emp_id,
        employeeData: employeeData
      });
      navigateBasedOnRole(userData.role);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">HRMS Login</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access the Human Resource Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <div className="text-center pb-4 text-sm text-gray-500">
          © 2024 Your Company Name. All rights reserved.
        </div>
      </Card>
    </div>
  );
};

export default Index;
