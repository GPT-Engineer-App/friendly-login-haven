import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import { FileText, Users, DollarSign, Clock } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    { title: 'Employee Report', icon: Users, description: 'Generate a report of all employees' },
    { title: 'Payroll Report', icon: DollarSign, description: 'Generate a payroll report' },
    { title: 'Attendance Report', icon: Clock, description: 'Generate an attendance report' },
    { title: 'Custom Report', icon: FileText, description: 'Create a custom report' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reports</h1>
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {reportTypes.map((report, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                    <report.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                    <Button className="mt-4">Generate Report</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
