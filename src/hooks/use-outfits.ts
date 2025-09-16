import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'
import type { Outfit, OutfitItem, Category, AffiliateLink } from '@/types/outfit'

// Re-export types for backward compatibility
export type { Outfit, OutfitItem, Category, AffiliateLink } from '@/types/outfit'

export interface OutfitsResponse {
  success: boolean
  data: Outfit[]
  count: number
}

export interface OutfitResponse {
  success: boolean
  data: Outfit
}

export interface FilterParams {
  category?: string
  season?: string
  color?: string
  gender?: string
  search?: string
  limit?: number
  offset?: number
}

// Legacy hooks for backward compatibility
export function useOutfits() {
  const { outfits, totalCount, isLoading, error, mutate } = useFilteredOutfits({})
  
  return {
    outfits,
    count: totalCount,
    isLoading,
    error,
    mutate
  }
}

export function useSearchOutfits(searchTerm: string) {
  const { outfits, totalCount, isLoading, error, mutate } = useFilteredOutfits({ 
    search: searchTerm 
  })
  
  return {
    outfits,
    count: totalCount,
    isLoading,
    error,
    mutate
  }
}

// Hook to fetch single outfit by ID
export function useOutfit(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `outfit-${id}` : null,
    async () => {
      const supabase = createClient()
      
      const { data: outfit, error } = await supabase
        .from('outfits')
        .select(`
          *,
          seasons:season_id(id, name, label),
          colors:color_id(id, name, label),
          outfit_categories(
            categories:category_id(id, name, label)
          ),
          outfit_items(
            id,
            name,
            type,
            image_url,
            affiliate_links
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      console.log('Raw outfit data:', outfit)
      console.log('Outfit items:', outfit?.outfit_items)

      // Transform the data
      return {
        id: outfit.id,
        title: outfit.title,
        description: outfit.description,
        gender: outfit.gender,
        season: outfit.seasons || null,
        color: outfit.colors || null,
        image_url: outfit.image_url,
        ai_hint: outfit.ai_hint,
        is_ai_generated: outfit.is_ai_generated,
        is_public: outfit.is_public,
        saved_count: outfit.saved_count,
        categories: outfit.outfit_categories?.map((oc: { categories: { id: string, name: string } }) => oc.categories).filter(Boolean) || [],
        items: outfit.outfit_items?.map((item: OutfitItem) => {
          return {
            id: item.id,
            name: item.name,
            type: item.type,
            image_url: item.image_url,
            affiliate_links: item.affiliate_links || []
          }
        }) || [],
        created_at: outfit.created_at,
        updated_at: outfit.updated_at
      }
    }
  )

  return {
    outfit: data,
    isLoading,
    error,
    mutate
  }
}

// Hook to fetch filtered outfits
export function useFilteredOutfits(params: FilterParams) {
  const { data, error, isLoading, mutate } = useSWR(
    `filtered-outfits-${JSON.stringify(params)}`,
    async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('outfits')
        .select(`
          *,
          seasons:season_id(name, label),
          colors:color_id(name, label, hex),
          outfit_categories(
            categories:category_id(name, label)
          ),
          outfit_items(
            id,
            name,
            type,
            image_url,
            affiliate_links
          )
        `, { count: 'exact' })
        .eq('is_public', true)

      // Apply filters
      if (params.season) {
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id')
          .eq('name', params.season)
          .single()
        if (seasonData) {
          query = query.eq('season_id', seasonData.id)
        }
      }

      if (params.color) {
        const { data: colorData } = await supabase
          .from('colors')
          .select('id')
          .eq('name', params.color)
          .single()
        if (colorData) {
          query = query.eq('color_id', colorData.id)
        }
      }

      if (params.gender) {
        query = query.eq('gender', params.gender)
      }

      // Apply category filter using proper join
      if (params.category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', params.category)
          .single()
        if (categoryData) {
          // Use a subquery to filter by category
          const { data: outfitIds } = await supabase
            .from('outfit_categories')
            .select('outfit_id')
            .eq('category_id', categoryData.id)
          
          if (outfitIds && outfitIds.length > 0) {
            const ids = outfitIds.map(item => item.outfit_id)
            query = query.in('id', ids)
          } else {
            // If no outfits found for this category, return empty result
            return { outfits: [], totalCount: 0 }
          }
        } else {
          // If category not found, return empty result
          return { outfits: [], totalCount: 0 }
        }
      }

      // Apply search filter
      if (params.search && params.search.trim()) {
        const searchTerm = params.search.trim()
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      // Apply pagination
      if (params.limit) {
        const start = params.offset || 0
        const end = start + params.limit - 1
        query = query.range(start, end)
      }

      query = query.order('created_at', { ascending: false })

      const { data: outfits, error, count } = await query

      if (error) throw error

      // Transform the data
      const transformedOutfits = (outfits || []).map(outfit => ({
        id: outfit.id,
        title: outfit.title,
        description: outfit.description,
        gender: outfit.gender,
        season: outfit.seasons?.label || outfit.seasons?.name || null,
        color: outfit.colors?.label || outfit.colors?.name || null,
        image_url: outfit.image_url,
        ai_hint: outfit.ai_hint,
        is_ai_generated: outfit.is_ai_generated,
        is_public: outfit.is_public,
        saved_count: outfit.saved_count,
        categories: outfit.outfit_categories?.map((oc: { categories: { name: string, label: string } }) => oc.categories?.label || oc.categories?.name).filter(Boolean) || [],
        items: outfit.outfit_items?.map((item: OutfitItem) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          image_url: item.image_url,
          affiliate_links: item.affiliate_links || []
        })) || [],
        created_at: outfit.created_at,
        updated_at: outfit.updated_at
      })) 

      return {
        outfits: transformedOutfits as Outfit[],
        totalCount: count || 0,
        filters: params
      }
    }
  )

  return {
    outfits: data?.outfits || [],
    totalCount: data?.totalCount || 0,
    filters: data?.filters,
    isLoading,
    error,
    mutate
  }
}

// Hook to fetch outfits by category
export function useOutfitsByCategory({ category, limit = 6 }: { category: string, limit?: number }) {
  return useFilteredOutfits({ category, limit })
}

// Hook to fetch outfits by season
export function useOutfitsBySeason({ season, limit = 6 }: { season: string, limit?: number }) {
  return useFilteredOutfits({ season, limit })
}

// Hook to fetch outfits by color
export function useOutfitsByColor({ color, limit = 6 }: { color: string, limit?: number }) {
  return useFilteredOutfits({ color, limit })
}

// Hook to fetch outfits by gender
export function useOutfitsByGender({ gender, limit = 6 }: { gender: 'male' | 'female', limit?: number }) {
  return useFilteredOutfits({ gender, limit })
}

// Hook to fetch outfit items by outfit ID
export function useOutfitItems(outfitId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    outfitId ? `outfit-items-${outfitId}` : null,
    async () => {
      const supabase = createClient()
      
      const { data: items, error } = await supabase
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Transform the data
      console.log('Raw outfit items from useOutfitItems:', items)
      return items?.map((item: OutfitItem) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        image_url: item.image_url,
        affiliate_links: item.affiliate_links || []
      })) || []
    }
  )

  return {
    items: data ?? [],
    isLoading,
    error,
    mutate
  }
}

// Hook to manage outfit items (CRUD operations)
export function useOutfitItemMutations() {
  const supabase = createClient()

  const addOutfitItem = async (outfitId: string, item: {
    name: string
    type: string
    image_url?: string
    affiliate_links?: Array<{ store: string; url: string }>
  }) => {
    const { data, error } = await supabase
      .from('outfit_items')
      .insert({
        outfit_id: outfitId,
        name: item.name,
        type: item.type,
        image_url: item.image_url,
        affiliate_links: item.affiliate_links || []
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateOutfitItem = async (itemId: string, updates: {
    name?: string
    type?: string
    image_url?: string
    affiliate_links?: Array<{ store: string; url: string }>
  }) => {
    const { data, error } = await supabase
      .from('outfit_items')
      .update({
        name: updates.name,
        type: updates.type,
        image_url: updates.image_url,
        affiliate_links: updates.affiliate_links
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteOutfitItem = async (itemId: string) => {
    const { error } = await supabase
      .from('outfit_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  }

  return {
    addOutfitItem,
    updateOutfitItem,
    deleteOutfitItem
  }
}