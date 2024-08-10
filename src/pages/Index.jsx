import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useHrmsUsers } from '@/integrations/supabase';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: users, isLoading } = useHrmsUsers();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const user = users.find(u => u.email === email);

    if (!user) {
      toast({
        title: "Login Failed",
        description: "User not found. Please check your email and try again.",
        variant: "destructive",
      });
      return;
    }

    if (password !== user.password_hash) {
      toast({
        title: "Login Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // If login is successful, navigate based on the user's role
    switch (user.role) {
      case 'admin':
      case 'hr':
        navigate('/dashboard');
        break;
      case 'manager':
        navigate('/employee-management');
        break;
      case 'employee':
        navigate('/attendance-tracking');
        break;
      default:
        navigate('/unauthorized');
    }

    toast({
      title: "Login Successful",
      description: `Welcome, ${user.username}!`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to HRMS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
