import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/database';

type AISuggestion = Database['public']['Tables']['ai_suggestions']['Row'];
type AISuggestionInsert = Database['public']['Tables']['ai_suggestions']['Insert'];
type AISuggestionUpdate = Database['public']['Tables']['ai_suggestions']['Update'];

// Extended type with joined data
export type AISuggestionWithDetails = AISuggestion & {
  category: Database['public']['Tables']['categories']['Row'];
  season: Database['public']['Tables']['seasons']['Row'];
  color: Database['public']['Tables']['colors']['Row'] | null;
};

const supabase = createClient();

// Fetcher function for SWR with joins
const fetcher = async (url: string) => {
  const { data, error } = await supabase
    .from('ai_suggestions')
    .select(`
      *,
      category:categories(*),
      season:seasons(*),
      color:colors(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as AISuggestionWithDetails[];
};

// Hook to get AI suggestions for current user with details
export function useAISuggestions() {
  const { data, error, isLoading, mutate } = useSWR<AISuggestionWithDetails[]>(
    'ai-suggestions',
    fetcher
  );

  return {
    suggestions: data || [],
    isLoading,
    error,
    mutate
  };
}

// Hook to create AI suggestion
export function useCreateAISuggestion() {
  const createSuggestion = async (suggestion: AISuggestionInsert) => {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .insert(suggestion)
      .select(`
        *,
        category:categories(*),
        season:seasons(*),
        color:colors(*)
      `)
      .single();

    if (error) throw error;
    return data as AISuggestionWithDetails;
  };

  return { createSuggestion };
}

// Hook to update AI suggestion
export function useUpdateAISuggestion() {
  const updateSuggestion = async (id: string, updates: AISuggestionUpdate) => {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(*),
        season:seasons(*),
        color:colors(*)
      `)
      .single();

    if (error) throw error;
    return data as AISuggestionWithDetails;
  };

  return { updateSuggestion };
}

// Hook to delete AI suggestion
export function useDeleteAISuggestion() {
  const deleteSuggestion = async (id: string) => {
    const { error } = await supabase
      .from('ai_suggestions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return { deleteSuggestion };
}

// Hook to get AI suggestion stats
export function useAISuggestionStats() {
  const { data, error, isLoading } = useSWR('ai-suggestion-stats', async () => {
    const { data: suggestions, error } = await supabase
      .from('ai_suggestions')
      .select('status');
    
    if (error) throw error;
    
    const stats = {
      total: suggestions.length,
      completed: suggestions.filter(s => s.status === 'completed').length,
      processing: suggestions.filter(s => s.status === 'processing').length,
      failed: suggestions.filter(s => s.status === 'failed').length
    };
    
    return stats;
  });

  return {
    stats: data,
    isLoading,
    error
  };
}