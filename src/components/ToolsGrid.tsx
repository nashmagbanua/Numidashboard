
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  Beaker, 
  Droplets, 
  Zap, 
  Wrench, 
  FileText, 
  Package, 
  Settings,
  Users,
  BarChart3
} from 'lucide-react';

interface ToolsGridProps {
  userRole: string;
}

const allTools = [
  {
    id: 'boiler-logs',
    title: 'Boiler Logs',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    roles: ['Admin', 'Mantech', 'Opscrew']
  },
  {
    id: 'chemical-logs',
    title: 'Chemical Logs',
    icon: Beaker,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    roles: ['Admin', 'Mantech']
  },
  {
    id: 'cws-logs',
    title: 'CWS Logs',
    icon: Droplets,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    roles: ['Admin', 'Mantech', 'Opscrew']
  },
  {
    id: 'power-tracker',
    title: 'Power Tracker',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    roles: ['Admin', 'Mantech']
  },
  {
    id: 'pm-workorder',
    title: 'PM Workorder',
    icon: Wrench,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    roles: ['Admin', 'Mantech']
  },
  {
    id: 'digital-logsheets',
    title: 'Digital Logsheets',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    roles: ['Admin', 'Mantech', 'Opscrew']
  },
  {
    id: 'coal-admin',
    title: 'Coal Admin',
    icon: Package,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    roles: ['Admin']
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    roles: ['Admin']
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: BarChart3,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    roles: ['Admin', 'Mantech']
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    roles: ['Admin']
  }
];

export const ToolsGrid: React.FC<ToolsGridProps> = ({ userRole }) => {
  const availableTools = allTools.filter(tool => tool.roles.includes(userRole));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Available Tools</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
          >
            <CardContent className="p-4 text-center space-y-3">
              <div className={`w-12 h-12 rounded-full ${tool.bgColor} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-nums-green-700 transition-colors">
                {tool.title}
              </h4>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Coming Soon Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {[
          { title: 'Charging Tool', icon: Zap, available: userRole === 'Opscrew' },
          { title: 'Activity Tracker', icon: BarChart3, available: userRole === 'Opscrew' },
          { title: 'GPM Calculator', icon: Droplets, available: userRole === 'Opscrew' }
        ].map((feature, index) => (
          feature.available && (
            <Card key={index} className="glass-card opacity-60">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <feature.icon className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-500">
                  {feature.title}
                  <span className="block text-xs text-gray-400">Coming Soon</span>
                </h4>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};
