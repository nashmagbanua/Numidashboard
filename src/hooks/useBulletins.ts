
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Bulletin {
  id: string;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export const useBulletins = () => {
  return useQuery({
    queryKey: ['bulletins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulletins')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as Bulletin[];
    }
  });
};

export const useCreateBulletin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, message }: { title: string; message: string }) => {
      const { data, error } = await supabase
        .from('bulletins')
        .insert({ title, message })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletins'] });
    }
  });
};

export const useUpdateBulletin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('bulletins')
        .update({ is_active })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletins'] });
    }
  });
};
