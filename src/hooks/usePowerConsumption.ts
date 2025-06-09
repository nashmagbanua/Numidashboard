
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PowerConsumption {
  id: string;
  section: 'Utilities' | 'Bottling' | 'Process' | 'LVSG5';
  consumption_kw: number;
  recorded_at: string;
  created_by: string | null;
}

export const usePowerConsumption = () => {
  return useQuery({
    queryKey: ['power-consumption'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('power_consumption')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data as PowerConsumption[];
    }
  });
};

export const useLatestPowerBySection = () => {
  return useQuery({
    queryKey: ['latest-power-by-section'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_latest_power_by_section');
      
      if (error) {
        // Fallback query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('power_consumption')
          .select('*')
          .order('recorded_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        
        // Group by section and get latest
        const grouped = fallbackData.reduce((acc: any, item: PowerConsumption) => {
          if (!acc[item.section] || new Date(item.recorded_at) > new Date(acc[item.section].recorded_at)) {
            acc[item.section] = item;
          }
          return acc;
        }, {});
        
        return Object.values(grouped) as PowerConsumption[];
      }
      
      return data as PowerConsumption[];
    }
  });
};
