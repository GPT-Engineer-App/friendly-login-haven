import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase';
import { useNavigate } from 'react-router-dom';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          navigate('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to HRMS</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-center mb-4">Please log in to access the system</p>
          <SupabaseAuthUI />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
