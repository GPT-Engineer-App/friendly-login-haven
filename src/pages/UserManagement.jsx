import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateBucketModal from '@/components/CreateBucketModal';
import CreateFolderModal from '@/components/CreateFolderModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useToast } from "@/components/ui/use-toast";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import ViewModal from '@/components/ViewModal';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, Search, FolderPlus, Database } from 'lucide-react';
import { createBucket, createFolder } from '@/integrations/supabase/storage';

const UserManagement = () => {
  const { data: users, isLoading, isError } = useUsers();
  const deleteUser = useDeleteUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCreateBucketModal, setShowCreateBucketModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  const filteredUsers = users
    ? users.filter(user => 
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter && roleFilter !== 'all' ? user.role === roleFilter : true) &&
        (statusFilter && statusFilter !== 'all' ? user.status === statusFilter : true)
      )
    : [];

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser.mutateAsync(userToDelete.user_id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setUserToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleCreateBucket = async (bucketName) => {
    try {
      await createBucket(bucketName);
      toast({
        title: "Success",
        description: `Bucket "${bucketName}" created successfully`,
      });
      setShowCreateBucketModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create bucket",
        variant: "destructive",
      });
    }
  };

  const handleCreateFolder = async (bucketName, folderName) => {
    try {
      await createFolder(bucketName, folderName);
      toast({
        title: "Success",
        description: `Folder "${folderName}" created successfully in bucket "${bucketName}"`,
      });
      setShowCreateFolderModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h1>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>User Search and Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => navigate('/create-user')}>Add New User</Button>
                  <Button onClick={() => setShowCreateBucketModal(true)}>
                    <Database className="mr-2 h-4 w-4" />
                    Create Bucket
                  </Button>
                  <Button onClick={() => setShowCreateFolderModal(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Folder
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort('username')} className="cursor-pointer">Username</TableHead>
                      <TableHead onClick={() => handleSort('email')} className="cursor-pointer">Email</TableHead>
                      <TableHead onClick={() => handleSort('role')} className="cursor-pointer">Role</TableHead>
                      <TableHead onClick={() => handleSort('status')} className="cursor-pointer">Status</TableHead>
                      <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer">Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>{user.username || 'N/A'}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>{user.role || 'N/A'}</TableCell>
                        <TableCell>{user.status || 'N/A'}</TableCell>
                        <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-user/${user.user_id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setUserToDelete(user)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                  </div>
                  <div>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <DeleteConfirmationDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
      {selectedUser && (
        <ViewModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Details"
          data={selectedUser}
        />
      )}
      <CreateBucketModal
        isOpen={showCreateBucketModal}
        onClose={() => setShowCreateBucketModal(false)}
        onConfirm={handleCreateBucket}
      />
      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onConfirm={handleCreateFolder}
      />
    </div>
  );
};

export default UserManagement;
