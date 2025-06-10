
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ScoreboardSummary } from '@/components/ScoreboardSummary';
import { ToolsGrid } from '@/components/ToolsGrid';
import { UserManagement } from '@/components/UserManagement';
import { BulletinBoard } from '@/components/BulletinBoard';
import { PMScheduler } from '@/components/PMScheduler';
import { ExportButton } from '@/components/ExportButton';
import { AIPanel } from '@/components/AIPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Nutribev Utility Management System
          </h1>
          <h2 className="text-xl font-semibold text-nums-green-700">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Welcome to NUMS, {user.user_metadata?.full_name || user.name}!
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="bulletins">Bulletin Board</TabsTrigger>
            <TabsTrigger value="pm-scheduler">PM Scheduler</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Scoreboard Summary */}
            <ScoreboardSummary />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="bulletins">
            <BulletinBoard />
          </TabsContent>

          <TabsContent value="pm-scheduler">
            <PMScheduler />
          </TabsContent>

          <TabsContent value="tools">
            {/* Tools Grid */}
            <ToolsGrid userRole={user.role} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Button */}
      <ExportButton />

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-white/30 py-2 text-center">
        <p className="text-xs text-gray-500">
          © 2025 ABN Utilities • NutribeV Utility Management System (NUMS)
        </p>
      </footer>
      <AIPanel />
    </div>
  );
};
