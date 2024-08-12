import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Bell, Upload, Download, Trash2 } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userInfo = [
    { title: 'Name', value: user?.employeeData?.name || 'N/A' },
    { title: 'Email', value: user?.email },
    { title: 'Employee ID', value: user?.employeeData?.emp_id || 'N/A' },
    { title: 'Designation', value: user?.employeeData?.designation || 'N/A' },
  ];

  const documentTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: '10th_marksheet', label: '10th Marksheet' },
    { value: '12th_marksheet', label: '12th Marksheet' },
    { value: 'ug_degree', label: 'UG Degree' },
    { value: 'pg_degree', label: 'PG Degree' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'other_certificate', label: 'Other Course Certificate' },
    { value: 'bank_passbook', label: 'Bank Passbook (Front Page)' },
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user?.employeeData?.emp_id) {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('emp_id', user.employeeData.emp_id);

        if (error) {
          console.error('Error fetching documents:', error);
        } else {
          setDocuments(data);
        }
      }
    };

    fetchDocuments();
  }, [user]);

  const handleDownload = async (document) => {
    try {
      const rootFolder = 'user_documents';
      const folderName = user.employeeData.emp_id.replace(/\//g, '_') + '_kyc';
      const filePath = `${folderName}/${document.file_name}`;
      let { data, error } = await supabase.storage
        .from(rootFolder)
        .download(filePath);

      if (error) {
        console.error('Error downloading document:', error);
        throw error;
      }

      const blob = new Blob([data], { type: document.file_type });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = document.file_name;
      link.click();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document) => {
    try {
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (deleteError) throw deleteError;

      const rootFolder = 'user_documents';
      const folderName = user.employeeData.emp_id.replace(/\//g, '_') + '_kyc';
      const filePath = `${folderName}/${document.file_name}`;
      const { error: storageError } = await supabase.storage
        .from(rootFolder)
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        throw storageError;
      }

      setDocuments(documents.filter(doc => doc.id !== document.id));
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">User Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, {user?.employeeData?.name || user?.email}</h2>
          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload userId={user?.id} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userInfo.map((item, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-semibold">{item.title}:</span> {item.value}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2" />
                  My Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentTypes.map((docType) => (
                  <div key={docType.value} className="mb-4">
                    <h3 className="font-semibold mb-2">{docType.label}</h3>
                    {documents.filter(doc => doc.document_type === docType.value).length > 0 ? (
                      <ul className="space-y-2">
                        {documents.filter(doc => doc.document_type === docType.value).map((doc) => (
                          <li key={doc.id} className="flex justify-between items-center">
                            <span>{doc.file_name}</span>
                            <div>
                              <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(doc)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No {docType.label} uploaded yet.</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>No new announcements at this time.</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>This section contains general company information and policies.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
