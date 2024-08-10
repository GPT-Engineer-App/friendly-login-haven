import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase';

const Index = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error } = await supabase
        .from('hrms_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      if (!data) throw new Error('User not found');

      // In a real-world scenario, you should use a secure password hashing library
      // This is a simplified example for demonstration purposes
      if (data.password_hash !== password) {
        throw new Error('Invalid password');
      }

      await login(data);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    navigate('/dashboard');
    return null;
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
