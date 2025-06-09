
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CoalYard {
  id: string;
  yard_name: string;
  yard_number: number;
  status: 'Available' | 'Depleted';
  last_updated: string;
  updated_by: string | null;
}

export const useCoalYards = () => {
  return useQuery({
    queryKey: ['coal-yards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coal_yards')
        .select('*')
        .order('yard_number');
      
      if (error) throw error;
      return data as CoalYard[];
    }
  });
};

export const useUpdateCoalYardStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'Available' | 'Depleted' }) => {
      const { data, error } = await supabase
        .from('coal_yards')
        .update({ status, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coal-yards'] });
    }
  });
};
