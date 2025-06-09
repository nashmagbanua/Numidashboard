
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Chemical {
  id: string;
  name: string;
  cby: number;
  liters: number;
  status: 'Normal' | 'Low' | 'Critical';
  last_updated: string;
  updated_by: string | null;
}

export const useChemicals = () => {
  return useQuery({
    queryKey: ['chemicals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chemicals')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Chemical[];
    }
  });
};

export const useUpdateChemical = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, cby, liters, status }: { id: string; cby: number; liters: number; status: string }) => {
      const { data, error } = await supabase
        .from('chemicals')
        .update({ cby, liters, status, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chemicals'] });
    }
  });
};
