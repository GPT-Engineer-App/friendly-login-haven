import React, { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';

const EmployeeList = () => {
  const { data: employees, isLoading, isError } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesToDelete, setEmployeesToDelete] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredEmployees = employees?.filter(employee =>
    employee.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employees</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Employee Management</h1>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Employee Search and Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-grow max-w-sm">
                    <Input
                      type="text"
                      placeholder="Search by Name, ID, or Email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  <Button onClick={() => navigate('/add-employee')}>Add Employee</Button>
                </div>
              </CardContent>
            </Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('emp_id')} className="cursor-pointer">
                    <Button variant="ghost" className="p-0 font-semibold">Employee ID</Button>
                  </TableHead>
                  <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                    <Button variant="ghost" className="p-0 font-semibold">Name</Button>
                  </TableHead>
                  <TableHead onClick={() => handleSort('designation')} className="cursor-pointer">
                    <Button variant="ghost" className="p-0 font-semibold">Designation</Button>
                  </TableHead>
                  <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                    <Button variant="ghost" className="p-0 font-semibold">Email</Button>
                  </TableHead>
                  <TableHead onClick={() => handleSort('phone_no')} className="cursor-pointer">
                    <Button variant="ghost" className="p-0 font-semibold">Phone Number</Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.user_id}>
                    <TableCell>{employee.emp_id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone_no}</TableCell>
                    <TableCell>{new Date(employee.date_of_joining).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-employee/${employee.user_id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEmployeesToDelete(employee)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedEmployees.length)} of {sortedEmployees.length} entries
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
          </div>
        </main>
      </div>
      {employeesToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!employeesToDelete}
          onClose={() => setEmployeesToDelete(null)}
          onConfirm={() => {
            // Implement delete logic here
            console.log('Delete employee:', employeesToDelete);
            setEmployeesToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;
