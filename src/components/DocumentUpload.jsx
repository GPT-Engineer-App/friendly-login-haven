import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';
import { useAuth } from '@/context/AuthContext';

const DocumentUpload = ({ adminMode = false }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    if (!file || !documentType || !user?.employeeData?.emp_id) {
      toast({
        title: "Error",
        description: "Please select a file, document type, and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const folderName = user.employeeData.emp_id.replace(/\//g, '_') + '_kyc';
      const filePath = `${folderName}/${fileName}`;
      console.log('Uploading file to:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: insertData, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          emp_id: user.employeeData.emp_id,
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          document_type: documentType,
          uploaded_by: user.id,
        })
        .select();

      if (insertError) {
        console.error('Error inserting document record:', insertError);
        console.error('Insert payload:', {
          user_id: user.id,
          emp_id: user.employeeData.emp_id,
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          document_type: documentType,
          uploaded_by: user.id,
        });
        throw insertError;
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
