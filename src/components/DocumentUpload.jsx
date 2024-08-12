import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';

const DocumentUpload = ({ userId, adminMode = false }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    const fetchEmployeeId = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('emp_id')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching employee ID:', error);
      } else {
        setEmployeeId(data.emp_id);
      }
    };

    fetchEmployeeId();
  }, [userId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !employeeId || !documentType) {
      toast({
        title: "Error",
        description: "Please select a file, document type, and ensure employee ID is available",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${employeeId}_kyc/${fileName}`;

      const bucketName = 'user_documents';
      let { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      try {
        const { data, error: insertError } = await supabase
          .from('documents')
          .insert({
            user_id: userId,
            emp_id: employeeId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            document_type: documentType,
            uploaded_by: adminMode ? (await supabase.auth.getUser()).data.user.id : userId,
          })
          .select();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw new Error(`Database insert failed: ${insertError.message}`);
        }

        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });
        queryClient.invalidateQueries('userDocuments');
        setFile(null);
        setDocumentType('');
      } catch (dbError) {
        // If database insert fails, delete the uploaded file
        await supabase.storage.from(bucketName).remove([filePath]);
        throw dbError;
      }
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
      <Button onClick={handleUpload} disabled={uploading || !file || !employeeId || !documentType}>
        {uploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
};

export default DocumentUpload;
