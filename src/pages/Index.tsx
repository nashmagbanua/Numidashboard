
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 rounded-full nums-gradient animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading NUMS...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  // Only allow Admin access to this dashboard
  if (user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600">Admin privileges required to access this dashboard.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="nums-gradient text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Go to Your Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
