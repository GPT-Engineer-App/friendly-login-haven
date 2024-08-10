import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase';
import { useNavigate } from 'react-router-dom';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to HRMS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Please log in to access the system</p>
          <SupabaseAuthUI />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
