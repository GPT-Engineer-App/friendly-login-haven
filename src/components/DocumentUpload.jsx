import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const DocumentUpload = ({ adminMode = false }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

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
    if (user?.employeeData?.emp_id) {
      checkAndCreateUserFolder();
    }
  }, [user]);

  const checkAndCreateUserFolder = async () => {
    const folderName = user.employeeData.emp_id.replace(/\//g, '_') + '_kyc';
    const { data, error } = await supabase.storage
      .from('user_documents')
      .list(folderName);

    if (error && error.message.includes('Not Found')) {
      await createUserFolder(folderName);
    }
  };

  const createUserFolder = async (folderName) => {
    try {
      const { data, error } = await supabase.storage
        .from('user_documents')
        .upload(`${folderName}/.keep`, new Blob(['']));

      if (error) throw error;
      console.log('User folder created successfully');
    } catch (error) {
      console.error('Error creating user folder:', error);
      toast({
        title: "Error",
        description: "Failed to create user folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !documentType || !currentUser) {
      toast({
        title: "Error",
        description: "Please select a file, document type, and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      console.log('User data:', currentUser);
      console.log('Employee data:', user?.employeeData);

      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${uuidv4()}.${fileExt}`;
      const rootFolder = 'employee_kyc';
      const filePath = `${currentUser.id}/${fileName}`;
      console.log('Uploading file to:', filePath);

      // Upload to public storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(rootFolder)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          public: true
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message || uploadError.error_description || 'Unknown error'}`);
      }

      // Use RLS policy for database insertion
      const { data: insertData, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: currentUser.id,
          emp_id: user?.employeeData?.emp_id || currentUser.id,
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          document_type: documentType,
          uploaded_by: currentUser.id,
        })
        .select();

      if (insertError) {
        console.error('Error inserting document record:', insertError);
        // If insert fails, remove the uploaded file
        await supabase.storage
          .from(rootFolder)
          .remove([filePath]);
        throw new Error(`Failed to insert document record: ${insertError.message}`);
      }

      console.log('Inserted document record:', insertData);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      queryClient.invalidateQueries('userDocuments');
      setFile(null);
      setDocumentType('');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select value={documentType} onValueChange={setDocumentType}>
        <SelectTrigger>
          <SelectValue placeholder="Select document type" />
        </SelectTrigger>
        <SelectContent>
          {documentTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading || !file || !documentType}>
        {uploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
};

export default DocumentUpload;
