import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};

export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEmployee) => {
      const { data, error } = await supabase
        .from('employees')
        .insert([newEmployee])
        .select();
      if (error) throw new Error(error.message);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
    },
  });
};
