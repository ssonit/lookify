import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];
type Season = Database['public']['Tables']['seasons']['Row'];
type Color = Database['public']['Tables']['colors']['Row'];

const supabase = createClient();

// Fetcher functions
const categoriesFetcher = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

const seasonsFetcher = async () => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

const colorsFetcher = async () => {
  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

// Hook to get categories
export function useCategories() {
  const { data, error, isLoading } = useSWR<Category[]>('categories', categoriesFetcher);
  return {
    categories: data || [],
    isLoading,
    error
  };
}

// Hook to get seasons
export function useSeasons() {
  const { data, error, isLoading } = useSWR<Season[]>('seasons', seasonsFetcher);
  return {
    seasons: data || [],
    isLoading,
    error
  };
}

// Hook to get colors
export function useColors() {
  const { data, error, isLoading } = useSWR<Color[]>('colors', colorsFetcher);
  return {
    colors: data || [],
    isLoading,
    error
  };
}
