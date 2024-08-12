import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase';

const DocumentUpload = ({ userId, adminMode = false }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    if (!file || !employeeId) {
      toast({
        title: "Error",
        description: "Please select a file to upload and ensure employee ID is available",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const bucketName = `employee_${employeeId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          emp_id: employeeId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          uploaded_by: adminMode ? (await supabase.auth.getUser()).data.user.id : userId,
        })
        .select();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      queryClient.invalidateQueries('userDocuments');
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading || !file || !employeeId}>
        {uploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
};

export default DocumentUpload;
