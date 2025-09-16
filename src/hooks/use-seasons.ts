'use client';

import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import type { Season } from '@/types/outfit';

export function useSeasons() {
  const { data, error, isLoading, mutate } = useSWR(
    'seasons',
    async () => {
      const supabase = createClient();
      
      const { data: seasons, error } = await supabase
        .from('seasons')
        .select('id, name, label, description, created_at')
        .order('name', { ascending: true });

      if (error) throw error;

      return seasons as Season[];
    }
  );

  return {
    seasons: data || [],
    isLoading,
    error,
    mutate
  };
}
