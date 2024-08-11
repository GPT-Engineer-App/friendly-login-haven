import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

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
          emp_id: userData.emp_id,
          created_by: queryClient.getQueryData(['user'])?.id,
        }])
        .select();

      if (error) {
        // If there's an error, we should delete the auth user we just created
        await supabase.auth.admin.deleteUser(authUser.user.id);
        throw new Error(error.message);
      }

      // Update the employee record with the new user_id
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
