
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Bell, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIPanel } from '@/components/AIPanel';
import { NotificationPanel } from '@/components/NotificationPanel';
import { useNotifications } from '@/hooks/useNotifications';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: notifications } = useNotifications(10);

  if (!user) return null;

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <>
      <header className="sticky top-0 z-50 glass-card border-b border-white/30 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo & User */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full nums-gradient flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">NUMS</h1>
                <p className="text-xs text-gray-600 -mt-1">Admin Panel</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-700">Welcome,</span>
              <span className="font-semibold text-gray-900">{user.user_metadata?.full_name || user.name}</span>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            {/* AI Brain Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAIPanel(true)}
              className="p-2 hover:bg-nums-green-100 transition-colors animate-float"
            >
              <Brain className="h-5 w-5 text-nums-green-600" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="p-2 hover:bg-nums-green-100 transition-colors relative"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-2 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* AI Panel */}
      <AIPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} />
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};
