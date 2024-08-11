import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from '@/components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  // Mock data for the chart
  const data = [
    { name: 'Jan', employees: 100, newHires: 5, turnover: 2 },
    { name: 'Feb', employees: 103, newHires: 7, turnover: 4 },
    { name: 'Mar', employees: 106, newHires: 6, turnover: 3 },
    { name: 'Apr', employees: 109, newHires: 8, turnover: 5 },
    { name: 'May', employees: 112, newHires: 10, turnover: 7 },
    { name: 'Jun', employees: 115, newHires: 9, turnover: 6 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Analytics</h1>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Employee Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="employees" fill="#8884d8" />
                    <Bar dataKey="newHires" fill="#82ca9d" />
                    <Bar dataKey="turnover" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Add more analytics components here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
