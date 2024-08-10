import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-4">You do not have permission to access this page.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
