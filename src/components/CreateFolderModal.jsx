import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuckets } from '@/integrations/supabase/storage';

const CreateFolderModal = ({ isOpen, onClose, onConfirm }) => {
  const [folderName, setFolderName] = useState('');
  const [selectedBucket, setSelectedBucket] = useState('');
  const { data: buckets, isLoading, isError } = useBuckets();

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedBucket, folderName);
    setFolderName('');
    setSelectedBucket('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bucketSelect" className="text-right">
                Select Bucket
              </Label>
              <Select
                value={selectedBucket}
                onValueChange={setSelectedBucket}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a bucket" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading && <SelectItem value="">Loading buckets...</SelectItem>}
                  {isError && <SelectItem value="">Error loading buckets</SelectItem>}
                  {buckets && buckets.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.name}>
                      {bucket.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folderName" className="text-right">
                Folder Name
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedBucket || !folderName}>Create Folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderModal;
