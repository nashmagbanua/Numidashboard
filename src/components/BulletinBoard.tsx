
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, X } from 'lucide-react';
import { useBulletins, useCreateBulletin, useUpdateBulletin } from '@/hooks/useBulletins';
import { useToast } from '@/hooks/use-toast';

export const BulletinBoard: React.FC = () => {
  const { data: bulletins, isLoading } = useBulletins();
  const createBulletinMutation = useCreateBulletin();
  const updateBulletinMutation = useUpdateBulletin();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const handleCreateBulletin = async () => {
    if (!newTitle.trim() || !newMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and message",
        variant: "destructive"
      });
      return;
    }

    try {
      await createBulletinMutation.mutateAsync({
        title: newTitle.trim(),
        message: newMessage.trim()
      });
      setNewTitle('');
      setNewMessage('');
      setIsCreating(false);
      toast({
        title: "Bulletin Created",
        description: "Your bulletin has been posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bulletin",
        variant: "destructive"
      });
    }
  };

  const handleDeactivateBulletin = async (id: string) => {
    try {
      await updateBulletinMutation.mutateAsync({ id, is_active: false });
      toast({
        title: "Bulletin Removed",
        description: "Bulletin has been deactivated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate bulletin",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Megaphone className="h-5 w-5 text-nums-green-600" />
          <span>Bulletin Board</span>
        </CardTitle>
        {!isCreating && (
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="nums-gradient"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Bulletin
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create New Bulletin Form */}
        {isCreating && (
          <div className="p-4 bg-white/30 rounded-lg border border-white/50 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Create New Bulletin</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle('');
                  setNewMessage('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Bulletin title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              maxLength={100}
            />
            <Textarea
              placeholder="Bulletin message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {newMessage.length}/500 characters
              </p>
              <Button
                size="sm"
                onClick={handleCreateBulletin}
                disabled={createBulletinMutation.isPending}
                className="nums-gradient"
              >
                Post Bulletin
              </Button>
            </div>
          </div>
        )}

        {/* Active Bulletins */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 rounded-full nums-gradient animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading bulletins...</p>
          </div>
        ) : bulletins && bulletins.length > 0 ? (
          <div className="space-y-3">
            {bulletins.map((bulletin) => (
              <div
                key={bulletin.id}
                className="p-4 bg-white/40 rounded-lg border border-white/50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{bulletin.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{bulletin.message}</p>
                    <p className="text-xs text-gray-500">
                      Posted {new Date(bulletin.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeactivateBulletin(bulletin.id)}
                    disabled={updateBulletinMutation.isPending}
                    className="ml-2 p-1 h-8 w-8"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No active bulletins</p>
            <p className="text-xs text-gray-500 mt-1">Create your first bulletin to broadcast to all users</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
