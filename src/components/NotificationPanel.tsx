
import React from 'react';
import { X, AlertTriangle, Zap, Droplets, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useMarkNotificationRead } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return AlertTriangle;
    case 'danger':
      return Droplets;
    case 'info':
    default:
      return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'warning':
      return 'text-yellow-600';
    case 'danger':
      return 'text-red-600';
    case 'info':
    default:
      return 'text-blue-600';
  }
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { data: notifications, isLoading } = useNotifications(5);
  const markReadMutation = useMarkNotificationRead();
  const { toast } = useToast();

  const handleViewAllNotifications = () => {
    // TODO: Navigate to full notifications page when implemented
    toast({
      title: "Feature Coming Soon",
      description: "Full notifications page will be available soon",
    });
    onClose();
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markReadMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-solid animate-slide-in">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 rounded-full nums-gradient animate-spin mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading notifications...</p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            <>
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border border-white/50 hover:bg-white/40 transition-colors cursor-pointer ${
                      notification.is_read ? 'bg-white/20' : 'bg-white/30'
                    }`}
                    onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-5 w-5 mt-0.5 ${iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            notification.type === 'danger' ? 'bg-red-100 text-red-700' :
                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {notification.type}
                        </Badge>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button 
                className="w-full" 
                variant="outline" 
                size="sm"
                onClick={handleViewAllNotifications}
              >
                View All Notifications
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No notifications yet</p>
              <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
