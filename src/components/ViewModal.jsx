import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ViewModal = ({ isOpen, onClose, title, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 items-center gap-4">
              <label className="text-right font-medium">{key}:</label>
              <span className="col-span-2">{value}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;
