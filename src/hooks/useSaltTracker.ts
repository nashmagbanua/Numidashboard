
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SaltTracker {
  id: string;
  sacks: number;
  status: 'Normal' | 'Low' | 'Critical';
  last_updated: string;
  updated_by: string | null;
}

export const useSaltTracker = () => {
  return useQuery({
    queryKey: ['salt-tracker'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salt_tracker')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as SaltTracker;
    }
  });
};

export const useUpdateSaltTracker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sacks, status }: { sacks: number; status: string }) => {
      const { data, error } = await supabase
        .from('salt_tracker')
        .update({ sacks, status, last_updated: new Date().toISOString() })
        .eq('id', (await supabase.from('salt_tracker').select('id').single()).data?.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salt-tracker'] });
    }
  });
};
