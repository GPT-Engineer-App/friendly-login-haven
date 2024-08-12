import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

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
      // First, create the auth user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw new Error(authError.message);

      // Then, insert the user data into the users table
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: authUser.user.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          status: userData.status,
          emp_id: userData.emp_id,
          created_by: queryClient.getQueryData(['user'])?.id,
        }])
        .select();

      if (error) {
        // If there's an error, we should delete the auth user we just created
        await supabase.auth.admin.deleteUser(authUser.user.id);
        throw new Error(error.message);
      }

      // Update the employee record with the new user_id if applicable
      if (userData.emp_id) {
        const { error: empError } = await supabase
          .from('employees')
          .update({ user_id: authUser.user.id })
          .eq('id', userData.emp_id);

        if (empError) {
          // If there's an error, we should delete the auth user and the user record
          await supabase.auth.admin.deleteUser(authUser.user.id);
          await supabase.from('users').delete().eq('user_id', authUser.user.id);
          throw new Error(empError.message);
        }
      }

      return data[0];
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
