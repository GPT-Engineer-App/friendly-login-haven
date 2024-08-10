import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate('/');
    // Force a page reload to ensure the auth state is refreshed
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <AlertCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">You do not have permission to access this page. Please contact your administrator if you believe this is an error.</p>
        <Button onClick={handleReturnToLogin} className="w-full">
          Return to Login
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
