import { supabase } from './index';
import { useQuery } from '@tanstack/react-query';

export const createBucket = async (bucketName) => {
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: false,
  });
  if (error) {
    console.error('Supabase createBucket error:', error);
    throw new Error(error.message || 'Failed to create bucket');
  }
  return data;
};

export const createFolder = async (bucketName, folderName) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`${folderName}/.keep`, new Blob(['']));
  if (error) throw error;
  return data;
};

export const useBuckets = () => {
  return useQuery({
    queryKey: ['buckets'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      return data;
    },
  });
};
