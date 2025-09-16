'use client';

import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import type { Outfit } from '@/types/outfit';

// Type for saved outfit response
interface SavedOutfitResponse {
  id: string;
  created_at: string;
  outfits: {
    id: string;
    title: string;
    description: string;
    gender: string;
    image_url: string;
    ai_hint: string;
    is_ai_generated: boolean;
    is_public: boolean;
    saved_count: number;
    created_at: string;
    updated_at: string;
    seasons: { name: string } | null;
    colors: { name: string } | null;
    outfit_categories: { categories: { name: string } }[];
  } | null;
}

export function useUserSavedOutfits(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? 'user-saved-outfits' : null,
    async () => {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get saved outfits with full outfit details
      const { data: savedOutfits, error: savedError } = await supabase
        .from('user_saved_outfits')
        .select(`
          id,
          created_at,
          outfits:outfit_id (
            id,
            title,
            description,
            gender,
            image_url,
            ai_hint,
            is_ai_generated,
            is_public,
            saved_count,
            created_at,
            updated_at,
            seasons:season_id(name),
            colors:color_id(name),
            outfit_categories(
              categories:category_id(name)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) as { data: SavedOutfitResponse[] | null, error: any };

      if (savedError) {
        throw savedError;
      }

      // Transform the data to match Outfit type
      const transformedOutfits = savedOutfits
        ?.filter(item => item.outfits) // Only include items with outfit data
        .map(item => {
          const outfit = item.outfits!; // We know it's not null due to filter above
          return {
            id: outfit.id,
            title: outfit.title,
            description: outfit.description,
            gender: outfit.gender,
            season: outfit.seasons?.name || undefined,
            color: outfit.colors?.name || undefined,
            image_url: outfit.image_url,
            ai_hint: outfit.ai_hint,
            is_ai_generated: outfit.is_ai_generated,
            is_public: outfit.is_public,
            saved_count: outfit.saved_count,
            categories: outfit.outfit_categories?.map(oc => oc.categories?.name).filter(Boolean) as string[] || [],
            items: [], // We don't need items for the profile view
            created_at: outfit.created_at,
            updated_at: outfit.updated_at,
            // Add missing fields with default values
            user_id: '',
            season_id: '',
            color_id: ''
          } as unknown as Outfit;
        }) || [];

      return transformedOutfits;
    }
  );

  return {
    savedOutfits: data || [],
    isLoading,
    error,
    mutate
  };
}
