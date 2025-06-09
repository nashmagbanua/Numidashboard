
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Flame, Beaker, Droplets, Zap } from 'lucide-react';
import { useCoalYards, useUpdateCoalYardStatus } from '@/hooks/useCoalYards';
import { useChemicals } from '@/hooks/useChemicals';
import { useSaltTracker } from '@/hooks/useSaltTracker';
import { useLatestPowerBySection } from '@/hooks/usePowerConsumption';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const ScoreboardSummary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: coalYards, isLoading: coalLoading } = useCoalYards();
  const { data: chemicals, isLoading: chemLoading } = useChemicals();
  const { data: saltData, isLoading: saltLoading } = useSaltTracker();
  const { data: powerData, isLoading: powerLoading } = useLatestPowerBySection();
  const updateCoalYardMutation = useUpdateCoalYardStatus();

  const handleCoalYardToggle = async (yardId: string, currentStatus: string) => {
    if (user?.role !== 'Admin') {
      toast({
        title: "Access Denied",
        description: "Only admins can update coal yard status",
        variant: "destructive"
      });
      return;
    }

    const newStatus = currentStatus === 'Available' ? 'Depleted' : 'Available';
    
    try {
      await updateCoalYardMutation.mutateAsync({ id: yardId, status: newStatus });
      toast({
        title: "Updated",
        description: `Coal yard status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coal yard status",
        variant: "destructive"
      });
    }
  };

  const availableYards = coalYards?.filter(yard => yard.status === 'Available').length || 0;
  const totalYards = coalYards?.length || 9;
  const depletedYards = coalYards?.filter(yard => yard.status === 'Depleted') || [];

  const currentPower = powerData?.find(p => p.section === 'Utilities')?.consumption_kw || 0;
  const averagePower = 420; // Could be calculated from historical data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Coal Yard Status */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-600" />
            <span>Coal Yard Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coalLoading ? (
            <div className="text-center">
              <div className="w-6 h-6 rounded-full nums-gradient animate-spin mx-auto"></div>
              <p className="text-xs text-gray-600 mt-2">Loading...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {availableYards}/{totalYards}
                </div>
                <p className="text-xs text-gray-600">Available Yards</p>
                {depletedYards.length > 0 && (
                  <div className="mt-2">
                    <Badge variant="destructive" className="text-xs">
                      {depletedYards.length} Depleted
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {depletedYards.map(yard => yard.yard_name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              
              {user?.role === 'Admin' && (
                <div className="space-y-2 pt-2 border-t border-white/30">
                  <p className="text-xs font-medium text-gray-700">Quick Toggle:</p>
                  {coalYards?.slice(0, 3).map((yard) => (
                    <div key={yard.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{yard.yard_name}</span>
                      <Switch
                        checked={yard.status === 'Available'}
                        onCheckedChange={() => handleCoalYardToggle(yard.id, yard.status)}
                        disabled={updateCoalYardMutation.isPending}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chemical Inventory */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Beaker className="h-4 w-4 text-blue-600" />
            <span>Chemical Inventory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chemLoading ? (
            <div className="text-center">
              <div className="w-6 h-6 rounded-full nums-gradient animate-spin mx-auto"></div>
              <p className="text-xs text-gray-600 mt-2">Loading...</p>
            </div>
          ) : chemicals && chemicals.length > 0 ? (
            <div className="space-y-2">
              {chemicals.map((chemical) => (
                <div key={chemical.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700 font-medium">{chemical.name}</span>
                    <Badge
                      variant={chemical.status === 'Critical' ? 'destructive' : 
                               chemical.status === 'Low' ? 'secondary' : 'default'}
                      className="text-xs h-4"
                    >
                      {chemical.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {chemical.cby} CBY / {chemical.liters}L
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500">
              No chemical data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* CWS Salt Tracker */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-cyan-600" />
            <span>CWS Salt Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {saltLoading ? (
            <div className="text-center">
              <div className="w-6 h-6 rounded-full nums-gradient animate-spin mx-auto"></div>
              <p className="text-xs text-gray-600 mt-2">Loading...</p>
            </div>
          ) : saltData ? (
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {saltData.sacks}
              </div>
              <p className="text-xs text-gray-600">sacks remaining</p>
              <Badge
                variant={saltData.status === 'Critical' ? 'destructive' : 
                         saltData.status === 'Low' ? 'secondary' : 'default'}
                className="text-xs"
              >
                {saltData.status}
              </Badge>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-cyan-600 h-2 rounded-full" 
                  style={{ 
                    width: saltData.status === 'Normal' ? '70%' : 
                           saltData.status === 'Low' ? '35%' : '15%' 
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500">
              No salt data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Power Trend */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>Power Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {powerLoading ? (
            <div className="text-center">
              <div className="w-6 h-6 rounded-full nums-gradient animate-spin mx-auto"></div>
              <p className="text-xs text-gray-600 mt-2">Loading...</p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {currentPower.toFixed(0)}kW
              </div>
              <p className="text-xs text-gray-600">Current Usage</p>
              <Badge
                variant={currentPower > averagePower ? 'destructive' : 'default'}
                className="text-xs"
              >
                {currentPower > averagePower ? 'Above Average' : 'Normal'}
              </Badge>
              <p className="text-xs text-gray-500">
                Avg: {averagePower}kW
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
