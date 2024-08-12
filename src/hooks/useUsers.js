import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import bcrypt from 'bcryptjs';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data.map(user => ({
        ...user,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.last_updated_at || new Date().toISOString()
      }));
    },
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      console.log("Creating user with data:", userData);

      // Create the user in the users table
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          email: userData.email,
          password: userData.password, // This is already hashed
          role: userData.role,
          status: 'active',
          emp_id: userData.emp_id,
          created_by: queryClient.getQueryData(['user'])?.id,
        }])
        .select()
        .single();

      if (userError) throw new Error(userError.message);

      // Update the employee record with the new user_id if applicable
      if (userData.emp_id) {
        const { error: empError } = await supabase
          .from('employees')
          .update({ user_id: newUser.id })
          .eq('emp_id', userData.emp_id);

        if (empError) {
          // If there's an error, clean up the user we just created
          await supabase.from('users').delete().eq('id', newUser.id);
          throw new Error(empError.message);
        }
      }

      return newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      queryClient.invalidateQueries('employees');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', id)
        .select();
      if (error) throw new Error(error.message);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
};
