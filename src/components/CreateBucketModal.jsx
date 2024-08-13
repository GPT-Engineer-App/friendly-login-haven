import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBucketModal = ({ isOpen, onClose, onConfirm }) => {
  const [bucketName, setBucketName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(bucketName);
    setBucketName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Bucket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bucketName" className="text-right">
                Bucket Name
              </Label>
              <Input
                id="bucketName"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Bucket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBucketModal;
