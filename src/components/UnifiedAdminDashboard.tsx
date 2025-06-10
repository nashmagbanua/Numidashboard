
import React from 'react';
import { ScoreboardSummary } from './ScoreboardSummary';
import { ToolsGrid } from './ToolsGrid';
import { UserManagement } from './UserManagement';
import { BulletinBoard } from './BulletinBoard';
import { PMScheduler } from './PMScheduler';
import { ExportButton } from './ExportButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const UnifiedAdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Nutribev Utility Management System
          </h1>
          <h2 className="text-xl font-semibold text-nums-green">
            Admin Panel & Tools
          </h2>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="scoreboard">Scoreboard</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="bulletin">Bulletin</TabsTrigger>
            <TabsTrigger value="pm">PM Scheduler</TabsTrigger>
          </TabsList>
          <TabsContent value="tools"><ToolsGrid userRole="Admin" /></TabsContent>
          <TabsContent value="scoreboard"><ScoreboardSummary /></TabsContent>
          <TabsContent value="users"><UserManagement /></TabsContent>
          <TabsContent value="bulletin"><BulletinBoard /></TabsContent>
          <TabsContent value="pm"><PMScheduler /></TabsContent>
        </Tabs>
      </div>
      <DraggableNumi />
    </div>
  );
};
