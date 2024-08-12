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
      // Create the user in the users table first
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          email: userData.email,
          role: userData.role,
          status: 'active',
          emp_id: userData.emp_id,
          created_by: queryClient.getQueryData(['user'])?.id,
        }])
        .select()
        .single();

      if (userError) throw new Error(userError.message);

      // Then create the auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

      if (authError) {
        // If there's an error, delete the user we just created
        await supabase.from('users').delete().eq('id', newUser.id);
        throw new Error(authError.message);
      }

      // Update the user record with the auth user id
      const { error: updateError } = await supabase
        .from('users')
        .update({ user_id: authUser.user.id })
        .eq('id', newUser.id);

      if (updateError) {
        // If there's an error, clean up both the auth user and the user record
        await supabase.auth.admin.deleteUser(authUser.user.id);
        await supabase.from('users').delete().eq('id', newUser.id);
        throw new Error(updateError.message);
      }

      // Update the employee record with the new user_id if applicable
      if (userData.emp_id) {
        const { error: empError } = await supabase
          .from('employees')
          .update({ user_id: authUser.user.id })
          .eq('id', userData.emp_id);

        if (empError) {
          // If there's an error, clean up everything
          await supabase.auth.admin.deleteUser(authUser.user.id);
          await supabase.from('users').delete().eq('id', newUser.id);
          throw new Error(empError.message);
        }
      }

      return { ...newUser, user_id: authUser.user.id };
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
