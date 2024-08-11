import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role, status, emp_id')
          .eq('user_id', session.user.id)
          .single();

        if (!error && userData) {
          let employeeData = null;
          if (userData.emp_id) {
            const { data: empData, error: empError } = await supabase
              .from('employees')
              .select('*')
              .eq('id', userData.emp_id)
              .single();

            if (!empError) {
              employeeData = empData;
            }
          }

          setUser({ 
            ...session.user, 
            role: userData.role, 
            status: userData.status, 
            emp_id: userData.emp_id,
            employeeData: employeeData
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
