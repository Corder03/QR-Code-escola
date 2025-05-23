
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-school-800 mb-8">Dashboard</h1>
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
