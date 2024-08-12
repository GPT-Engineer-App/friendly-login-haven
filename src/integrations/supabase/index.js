import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const supabaseAdmin = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### users

| name             | type                        | format                    | required |
|------------------|-----------------------------|-----------------------|----------|
| user_id          | uuid                        | string                | true     |
| username         | character varying           | string (max 50 chars) | true     |
| password_hash    | character varying           | string (max 255 chars)| true     |
| role             | public.user_role_enum       | string (admin/user)   | true     |
| email            | character varying           | string (max 100 chars)| true     |
| created_at       | timestamp with time zone    | string                | false    |
| created_by       | uuid                        | string                | false    |
| last_updated_at  | timestamp with time zone    | string                | false    |
| last_updated_by  | uuid                        | string                | false    |

*/

// Hooks for users table
export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('users').select('*')),
});

export const useUser = (userId) => useQuery({
    queryKey: ['users', userId],
    queryFn: () => fromSupabase(supabase.from('users').select('*').eq('user_id', userId).single()),
    enabled: !!userId,
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('users').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, updates }) => fromSupabase(supabase.from('users').update(updates).eq('user_id', userId)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => fromSupabase(supabase.from('users').delete().eq('user_id', userId)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};
