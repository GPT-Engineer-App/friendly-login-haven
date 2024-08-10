import React, { useState } from 'react';
import { useUserRoles, useUpdateUserRole } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const RoleManagement = ({ userId }) => {
    const { data: roles, isLoading } = useUserRoles();
    const updateRole = useUpdateUserRole();
    const [selectedRole, setSelectedRole] = useState('');

    if (isLoading) return <div>Loading roles...</div>;

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleUpdateRole = () => {
        updateRole.mutate({ userId, role: selectedRole });
    };

    return (
        <div>
            <Select value={selectedRole} onChange={handleRoleChange}>
                <option value="">Select a role</option>
                {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                ))}
            </Select>
            <Button onClick={handleUpdateRole} disabled={!selectedRole}>
                Update Role
            </Button>
        </div>
    );
};

export default RoleManagement;
