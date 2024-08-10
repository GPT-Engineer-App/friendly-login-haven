import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

export const useSupabaseAuth = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session };
};

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### user_table_enquiry

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| id         | bigint                  | number | true     |
| created_at | timestamp with time zone| string | true     |
| last_upd   | timestamp with time zone| string | true     |
| user_id    | text                    | string | true     |
| password   | text                    | string | true     |
| user_type  | text                    | string | true     |
| user_org   | text                    | string | true     |
| created_by | text                    | string | false    |
| last_upd_by| text                    | string | false    |

### hrms_users

| name           | type                    | format | required |
|----------------|-------------------------|--------|----------|
| user_id        | uuid                    | string | true     |
| username       | character varying       | string | true     |
| password_hash  | character varying       | string | true     |
| role           | public.user_role_enum   | string | true     |
| email          | character varying       | string | true     |
| created_at     | timestamp with time zone| string | false    |
| created_by     | uuid                    | string | false    |
| last_updated_at| timestamp with time zone| string | false    |
| last_updated_by| uuid                    | string | false    |

### employee_management

| name              | type                    | format | required |
|-------------------|-------------------------|--------|----------|
| id                | bigint                  | number | true     |
| created_dt        | timestamp with time zone| string | true     |
| emp_id            | text                    | string | true     |
| created_by        | text                    | string | false    |
| last_upd          | timestamp with time zone| string | false    |
| last_upd_by       | text                    | string | false    |
| name              | text                    | string | false    |
| designation       | text                    | string | false    |
| date_of_joinng    | timestamp with time zone| string | false    |
| phone_num         | text                    | string | false    |
| email             | text                    | string | false    |
| address           | text                    | string | false    |
| dob               | date                    | string | false    |
| emergency_contact | text                    | string | false    |

### user_table

| name            | type                    | format | required |
|-----------------|-------------------------|--------|----------|
| id              | bigint                  | number | true     |
| created_at      | timestamp with time zone| string | true     |
| last_upd        | timestamp with time zone| string | true     |
| user_id         | text                    | string | true     |
| password        | text                    | string | true     |
| user_type       | text                    | string | true     |
| user_org        | text                    | string | true     |
| application_name| text[]                  | array  | true     |
| created_by      | text                    | string | false    |
| last_upd_by     | text                    | string | false    |

### user_org

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| id         | bigint                  | number | true     |
| created_at | timestamp with time zone| string | true     |
| last_upd   | timestamp with time zone| string | true     |
| created_by | text                    | string | true     |
| last_upd_by| text                    | string | true     |
| org_name   | text                    | string | true     |

### sales_tracking

| name             | type                    | format | required |
|------------------|-------------------------|--------|----------|
| id               | bigint                  | number | true     |
| created_dt       | timestamp with time zone| string | true     |
| sales_visit_id   | text                    | string | true     |
| created_by       | text                    | string | false    |
| last_upd         | timestamp with time zone| string | false    |
| last_upd_by      | text                    | string | false    |
| visit_date       | timestamp with time zone| string | false    |
| call_type        | text                    | string | false    |
| org_name         | text                    | string | false    |
| address          | text                    | string | false    |
| contact_person   | text                    | string | false    |
| contact_phone_num| text                    | string | false    |
| contact_email    | text                    | string | false    |
| sea_import       | text                    | string | false    |
| sea_export       | text                    | string | false    |
| air_import       | text                    | string | false    |
| air_export       | text                    | string | false    |
| warehousing      | text                    | string | false    |
| status           | text                    | string | false    |
| remarks          | text                    | string | false    |

### dsr_tracker

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| id         | bigint                  | number | true     |
| created_dt | timestamp with time zone| string | true     |
| po_number  | text                    | string | true     |
| last_upd_dt| timestamp with time zone| string | true     |
| last_upd_by| text                    | string | true     |
| created_by | text                    | string | true     |
| comments   | json                    | object | true     |
| user_org   | text                    | string | true     |

### leave_requests

| name          | type                    | format | required |
|---------------|-------------------------|--------|----------|
| leave_id      | uuid                    | string | true     |
| employee_id   | bigint                  | number | true     |
| start_date    | date                    | string | true     |
| end_date      | date                    | string | true     |
| reason        | text                    | string | true     |
| status        | public.leave_status_enum| string | false    |
| admin_id      | bigint                  | number | false    |
| admin_comment | text                    | string | false    |
| created_dt    | timestamp with time zone| string | false    |
| created_by    | text                    | string | false    |
| last_upd      | timestamp with time zone| string | false    |
| last_upd_by   | text                    | string | false    |

### enquiry

| name                | type             | format | required |
|---------------------|------------------|--------|----------|
| id                  | bigint           | number | true     |
| sno                 | character varying| string | true     |
| created_by          | character varying| string | true     |
| created_date        | date             | string | true     |
| enquiry_id          | character varying| string | true     |
| channel             | character varying| string | true     |
| enquiry_mode        | character varying| string | true     |
| enquiry_type        | character varying| string | true     |
| enquiry_subtype     | character varying| string | true     |
| client              | character varying| string | true     |
| inco_terms          | character varying| string | true     |
| origin_country      | character varying| string | true     |
| origin_port         | character varying| string | true     |
| destination_country | character varying| string | true     |
| destination_port    | character varying| string | true     |
| length              | integer          | number | true     |
| breadth             | integer          | number | true     |
| height              | integer          | number | true     |
| unit_of_measurement | character varying| string | true     |
| package_type        | character varying| string | true     |
| no_of_pkgs          | integer          | number | true     |
| gross_weight        | integer          | number | true     |
| equipment           | character varying| string | true     |
| commodity           | character varying| string | true     |
| updated_by          | character varying| string | true     |
| updated_date        | date             | string | true     |
| net_weight          | integer          | number | false    |
| total_net           | integer          | number | false    |
| total_gross         | integer          | number | false    |
| no_of_units         | integer          | number | false    |
| cargo_readiness     | date             | string | false    |
| cut_off_eta         | date             | string | false    |
| indication_in_usd   | character varying| string | false    |
| remarks             | character varying| string | false    |
| is_assigned         | boolean          | boolean| false    |
| is_deleted          | boolean          | boolean| false    |

### hrms_employees

| name              | type                    | format | required |
|-------------------|-------------------------|--------|----------|
| id                | bigint                  | number | true     |
| name              | character varying       | string | true     |
| email             | character varying       | string | true     |
| emp_id            | character varying       | string | true     |
| role              | public.employee_role_enum| string | true     |
| created_dt        | timestamp with time zone| string | false    |
| created_by        | text                    | string | false    |
| last_upd          | timestamp with time zone| string | false    |
| last_upd_by       | text                    | string | false    |
| designation       | character varying       | string | false    |
| date_of_joinng    | date                    | string | false    |
| phone_num         | character varying       | string | false    |
| address           | text                    | string | false    |
| dob               | date                    | string | false    |
| emergency_contact | character varying       | string | false    |

### saved_search_enquiry

| name            | type                    | format | required |
|-----------------|-------------------------|--------|----------|
| id              | integer                 | number | true     |
| name            | text                    | string | true     |
| criteria        | jsonb                   | object | true     |
| user_id         | text                    | string | true     |
| application_name| text                    | string | true     |
| created_at      | timestamp with time zone| string | false    |
| updated_at      | timestamp with time zone| string | false    |

*/

// Hooks for user_table_enquiry
export const useUserTableEnquiries = () => useQuery({
    queryKey: ['user_table_enquiries'],
    queryFn: () => fromSupabase(supabase.from('user_table_enquiry').select('*'))
});

export const useUserTableEnquiry = (id) => useQuery({
    queryKey: ['user_table_enquiry', id],
    queryFn: () => fromSupabase(supabase.from('user_table_enquiry').select('*').eq('id', id).single())
});

export const useAddUserTableEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEnquiry) => fromSupabase(supabase.from('user_table_enquiry').insert([newEnquiry])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_table_enquiries');
        },
    });
};

export const useUpdateUserTableEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_table_enquiry').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_table_enquiries');
        },
    });
};

export const useDeleteUserTableEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_table_enquiry').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_table_enquiries');
        },
    });
};

// Hooks for hrms_users
export const useHrmsUsers = () => useQuery({
    queryKey: ['hrms_users'],
    queryFn: () => fromSupabase(supabase.from('hrms_users').select('*'))
});

export const useHrmsUser = (userId) => useQuery({
    queryKey: ['hrms_user', userId],
    queryFn: () => fromSupabase(supabase.from('hrms_users').select('*').eq('user_id', userId).single())
});

export const useAddHrmsUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('hrms_users').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('hrms_users');
        },
    });
};

export const useUpdateHrmsUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ user_id, ...updateData }) => fromSupabase(supabase.from('hrms_users').update(updateData).eq('user_id', user_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('hrms_users');
        },
    });
};

export const useDeleteHrmsUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => fromSupabase(supabase.from('hrms_users').delete().eq('user_id', userId)),
        onSuccess: () => {
            queryClient.invalidateQueries('hrms_users');
        },
    });
};

// Hooks for employee_management
export const useEmployees = () => useQuery({
    queryKey: ['employees'],
    queryFn: () => fromSupabase(supabase.from('employee_management').select('*'))
});

export const useEmployee = (id) => useQuery({
    queryKey: ['employee', id],
    queryFn: () => fromSupabase(supabase.from('employee_management').select('*').eq('id', id).single())
});

export const useAddEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEmployee) => fromSupabase(supabase.from('employee_management').insert([newEmployee])),
        onSuccess: () => {
            queryClient.invalidateQueries('employees');
        },
    });
};

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('employee_management').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('employees');
        },
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('employee_management').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('employees');
        },
    });
};

// Hooks for user_table
export const useUserTables = () => useQuery({
    queryKey: ['user_tables'],
    queryFn: () => fromSupabase(supabase.from('user_table').select('*'))
});

export const useUserTable = (id) => useQuery({
    queryKey: ['user_table', id],
    queryFn: () => fromSupabase(supabase.from('user_table').select('*').eq('id', id).single())
});

export const useAddUserTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUserTable) => fromSupabase(supabase.from('user_table').insert([newUserTable])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_tables');
        },
    });
};

export const useUpdateUserTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_table').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_tables');
        },
    });
};

export const useDeleteUserTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_table').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_tables');
        },
    });
};

// Hooks for user_org
export const useUserOrgs = () => useQuery({
    queryKey: ['user_orgs'],
    queryFn: () => fromSupabase(supabase.from('user_org').select('*'))
});

export const useUserOrg = (id) => useQuery({
    queryKey: ['user_org', id],
    queryFn: () => fromSupabase(supabase.from('user_org').select('*').eq('id', id).single())
});

export const useAddUserOrg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUserOrg) => fromSupabase(supabase.from('user_org').insert([newUserOrg])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_orgs');
        },
    });
};

export const useUpdateUserOrg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_org').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_orgs');
        },
    });
};

export const useDeleteUserOrg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_org').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_orgs');
        },
    });
};

// Hooks for sales_tracking
export const useSalesTrackings = () => useQuery({
    queryKey: ['sales_trackings'],
    queryFn: () => fromSupabase(supabase.from('sales_tracking').select('*'))
});

export const useSalesTracking = (id) => useQuery({
    queryKey: ['sales_tracking', id],
    queryFn: () => fromSupabase(supabase.from('sales_tracking').select('*').eq('id', id).single())
});

export const useAddSalesTracking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSalesTracking) => fromSupabase(supabase.from('sales_tracking').insert([newSalesTracking])),
        onSuccess: () => {
            queryClient.invalidateQueries('sales_trackings');
        },
    });
};

export const useUpdateSalesTracking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('sales_tracking').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('sales_trackings');
        },
    });
};

export const useDeleteSalesTracking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('sales_tracking').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('sales_trackings');
        },
    });
};

// Hooks for dsr_tracker
export const useDsrTrackers = () => useQuery({
    queryKey: ['dsr_trackers'],
    queryFn: () => fromSupabase(supabase.from('dsr_tracker').select('*'))
});

export const useDsrTracker = (id) => useQuery({
    queryKey: ['dsr_tracker', id],
    queryFn: () => fromSupabase(supabase.from('dsr_tracker').select('*').eq('id', id).single())
});

export const useAddDsrTracker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newDsrTracker) => fromSupabase(supabase.from('dsr_tracker').insert([newDsrTracker])),
        onSuccess: () => {
            queryClient.invalidateQueries('dsr_trackers');
        },
    });
};

export const useUpdateDsrTracker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('dsr_tracker').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('dsr_trackers');
        },
    });
};

export const useDeleteDsrTracker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('dsr_tracker').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('dsr_trackers');
        },
    });
};

// Hooks for leave_requests
export const useLeaveRequests = () => useQuery({
    queryKey: ['leave_requests'],
    queryFn: () => fromSupabase(supabase.from('leave_requests').select('*'))
});

export const useLeaveRequest = (leaveId) => useQuery({
    queryKey: ['leave_request', leaveId],
    queryFn: () => fromSupabase(supabase.from('leave_requests').select('*').eq('leave_id', leaveId).single())
});

export const useAddLeaveRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newLeaveRequest) => fromSupabase(supabase.from('leave_requests').insert([newLeaveRequest])),
        onSuccess: () => {
            queryClient.invalidateQueries('leave_requests');
        },
    });
};

export const useUpdateLeaveRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ leave_id, ...updateData }) => fromSupabase(supabase.from('leave_requests').update(updateData).eq('leave_id', leave_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('leave_requests');
        },
    });
};

export const useDeleteLeaveRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (leaveId) => fromSupabase(supabase.from('leave_requests').delete().eq('leave_id', leaveId)),
        onSuccess: () => {
            queryClient.invalidateQueries('leave_requests');
        },
    });
};

// Hooks for enquiry
export const useEnquiries = () => useQuery({
    queryKey: ['enquiries'],
    queryFn: () => fromSupabase(supabase.from('enquiry').select('*'))
});

export const useEnquiry = (id) => useQuery({
    queryKey: ['enquiry', id],
    queryFn: () => fromSupabase(supabase.from('enquiry').select('*').eq('id', id).single())
});

export const useAddEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEnquiry) => fromSupabase(supabase.from('enquiry').insert([newEnquiry])),
        onSuccess: () => {
            queryClient.invalidateQueries('enquiries');
        },
    });
};

export const useUpdateEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('enquiry').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('enquiries');
        },
    });
};

export const useDeleteEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('enquiry').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('enquiries');
        },
    });
};

// Hooks for hrms_employees
export const useHrmsEmployees = () => {
    const { data: session } = supabase.auth.getSession();
    return useQuery({
        queryKey: ['hrms_employees'],
        queryFn: async () => {
            const { data, error } = await supabase.from('hrms_employees').select('*');
            if (error) throw error;
            return data;
        },
        enabled: !!session
    });
};

export const useHrmsEmployee = (id) => useQuery({
    queryKey: ['hrms_employee', id],
    queryFn: () => fromSupabase(supabase.from('hrms_employees').select('*').eq('id', id).single())
});

export const useAddHrmsEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEmployee) => fromSupabase(supabase.from('hrms_employees').insert([newEmployee])),
        onSuccess: () => {
            queryClient.invalidateQueries('hrms_employees');
        },
    });
};

export const useUpdateHrmsEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('hrms_employees').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('hrms_employees');
        },
    });
};

export const useDeleteHrmsEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('hrms_employees').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('hrms_employees');
        },
    });
};

// Hooks for saved_search_enquiry
export const useSavedSearchEnquiries = () => useQuery({
    queryKey: ['saved_search_enquiries'],
    queryFn: () => fromSupabase(supabase.from('saved_search_enquiry').select('*'))
});

export const useSavedSearchEnquiry = (id) => useQuery({
    queryKey: ['saved_search_enquiry', id],
    queryFn: () => fromSupabase(supabase.from('saved_search_enquiry').select('*').eq('id', id).single())
});

export const useAddSavedSearchEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSavedSearch) => fromSupabase(supabase.from('saved_search_enquiry').insert([newSavedSearch])),
        onSuccess: () => {
            queryClient.invalidateQueries('saved_search_enquiries');
        },
    });
};

export const useUpdateSavedSearchEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('saved_search_enquiry').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('saved_search_enquiries');
        },
    });
};

export const useDeleteSavedSearchEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('saved_search_enquiry').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('saved_search_enquiries');
        },
    });
};

// User role management hooks
export const useUserRoles = () => useQuery({
    queryKey: ['user_roles'],
    queryFn: () => fromSupabase(supabase.from('user_roles').select('*'))
});

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role }) => {
            // Update the role in the user_roles table
            await fromSupabase(supabase.from('user_roles').upsert({ user_id: userId, role }));
            
            // Update the user's custom claims
            const { data, error } = await supabase.auth.admin.updateUserById(
                userId,
                { app_metadata: { role: role } }
            );
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries('user_roles');
        },
    });
};
