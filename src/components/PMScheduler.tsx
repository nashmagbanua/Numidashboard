
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PMTask {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'missed' | 'upcoming';
  section: string;
}

const mockPMTasks: PMTask[] = [
  { id: '1', title: 'Boiler A Maintenance', date: '2025-01-10', status: 'completed', section: 'Utilities' },
  { id: '2', title: 'Chemical Tank Cleaning', date: '2025-01-12', status: 'upcoming', section: 'Process' },
  { id: '3', title: 'Conveyor Belt Check', date: '2025-01-08', status: 'missed', section: 'Bottling' },
  { id: '4', title: 'Power System Inspection', date: '2025-01-15', status: 'upcoming', section: 'LVSG5' },
];

export const PMScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700">Completed</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      case 'upcoming':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Upcoming</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCurrentMonthTasks = () => {
    return mockPMTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getMonth() === currentDate.getMonth() && 
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const currentMonthTasks = getCurrentMonthTasks();
  const completedCount = currentMonthTasks.filter(t => t.status === 'completed').length;
  const missedCount = currentMonthTasks.filter(t => t.status === 'missed').length;
  const upcomingCount = currentMonthTasks.filter(t => t.status === 'upcoming').length;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-nums-green-600" />
          <span>PM Scheduler</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">{formatDate(currentDate)}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{completedCount}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{missedCount}</div>
            <div className="text-xs text-red-600">Missed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{upcomingCount}</div>
            <div className="text-xs text-yellow-600">Upcoming</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <XCircle className="h-4 w-4 text-red-600" />
            <span>Missed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span>Upcoming</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">PM Tasks This Month</h4>
          {currentMonthTasks.length > 0 ? (
            <div className="space-y-2">
              {currentMonthTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/50"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{task.title}</h5>
                      <p className="text-xs text-gray-600">
                        {task.section} • {new Date(task.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No PM tasks scheduled this month</p>
              <p className="text-xs text-gray-500 mt-1">Tasks will appear here when scheduled</p>
            </div>
          )}
        </div>

        {/* Placeholder note */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a placeholder interface. PM scheduling functionality will be connected to the backend system.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
