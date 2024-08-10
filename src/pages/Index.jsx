import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SupabaseAuthUI } from '@/integrations/supabase/auth';
import { Users } from 'lucide-react';

const Index = () => {
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
          <SupabaseAuthUI />
        </CardContent>
        <div className="text-center pb-4 text-sm text-gray-500">
          © 2024 Your Company Name. All rights reserved.
        </div>
      </Card>
    </div>
  );
};

export default Index;
