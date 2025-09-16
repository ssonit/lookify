import { useSWRConfig } from 'swr'
import { createClient } from '@/utils/supabase/client'


export function useOutfitMutations() {
  const { mutate } = useSWRConfig()
  const supabase = createClient()

  const createOutfit = async (outfitData: {
    title: string
    description?: string
    gender: 'male' | 'female'
    season?: string
    color?: string
    image_url?: string
    ai_hint?: string
    categories: string[]
    items: Array<{
      name: string
      type: string
      image_url?: string
      affiliate_links: Array<{ store: string; url: string }>
    }>
  }) => {
    try {
      // Get season and color IDs if provided
      let seasonId = null
      let colorId = null

      if (outfitData.season) {
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id')
          .eq('name', outfitData.season)
          .single()
        seasonId = seasonData?.id
      }

      if (outfitData.color) {
        const { data: colorData } = await supabase
          .from('colors')
          .select('id')
          .eq('name', outfitData.color)
          .single()
        colorId = colorData?.id
      }

      // Create the outfit
      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .insert({
          title: outfitData.title,
          description: outfitData.description,
          gender: outfitData.gender,
          season_id: seasonId,
          color_id: colorId,
          image_url: outfitData.image_url,
          ai_hint: outfitData.ai_hint,
          is_ai_generated: false,
          is_public: true,
          saved_count: 0
        })
        .select()
        .single()

      if (outfitError) throw outfitError

      // Add categories
      if (outfitData.categories.length > 0) {
        const categoryInserts = outfitData.categories.map(async (categoryName) => {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single()
          
          if (categoryData) {
            return {
              outfit_id: outfit.id,
              category_id: categoryData.id
            }
          }
          return null
        })

        const categoryResults = await Promise.all(categoryInserts)
        const validCategories = categoryResults.filter(Boolean)

        if (validCategories.length > 0) {
          const { error: categoryError } = await supabase
            .from('outfit_categories')
            .insert(validCategories)

          if (categoryError) throw categoryError
        }
      }

      // Add items
      if (outfitData.items.length > 0) {
        const itemInserts = outfitData.items.map(item => ({
          outfit_id: outfit.id,
          name: item.name,
          type: item.type,
          image_url: item.image_url,
          affiliate_links: item.affiliate_links
        }))

        const { error: itemsError } = await supabase
          .from('outfit_items')
          .insert(itemInserts)

        if (itemsError) throw itemsError
      }

      // Revalidate outfits list
      mutate('outfits')
      
      return outfit
    } catch (error) {
      console.error('Error creating outfit:', error)
      throw error
    }
  }

  const updateOutfit = async (id: string, updates: {
    title?: string
    description?: string
    gender?: 'male' | 'female'
    season?: string
    color?: string
    image_url?: string
    ai_hint?: string
    categories?: string[]
    items?: Array<{
      id?: string
      name: string
      type: string
      image_url?: string
      affiliate_links: Array<{ store: string; url: string }>
    }>
  }) => {
    try {
      // Get season and color IDs if provided
      let seasonId = null
      let colorId = null

      if (updates.season) {
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id')
          .eq('name', updates.season)
          .single()
        seasonId = seasonData?.id
      }

      if (updates.color) {
        const { data: colorData } = await supabase
          .from('colors')
          .select('id')
          .eq('name', updates.color)
          .single()
        colorId = colorData?.id
      }

      // Update the outfit
      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .update({
          title: updates.title,
          description: updates.description,
          gender: updates.gender,
          season_id: seasonId,
          color_id: colorId,
          image_url: updates.image_url,
          ai_hint: updates.ai_hint,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (outfitError) throw outfitError

      // Update categories if provided
      if (updates.categories) {
        // Remove existing categories
        await supabase
          .from('outfit_categories')
          .delete()
          .eq('outfit_id', id)

        // Add new categories
        if (updates.categories.length > 0) {
          const categoryInserts = updates.categories.map(async (categoryName) => {
            const { data: categoryData } = await supabase
              .from('categories')
              .select('id')
              .eq('name', categoryName)
              .single()
            
            if (categoryData) {
              return {
                outfit_id: id,
                category_id: categoryData.id
              }
            }
            return null
          })

          const categoryResults = await Promise.all(categoryInserts)
          const validCategories = categoryResults.filter(Boolean)

          if (validCategories.length > 0) {
            const { error: categoryError } = await supabase
              .from('outfit_categories')
              .insert(validCategories)

            if (categoryError) throw categoryError
          }
        }
      }

      // Update items if provided
      if (updates.items) {
        // Remove existing items
        await supabase
          .from('outfit_items')
          .delete()
          .eq('outfit_id', id)

        // Add new items
        if (updates.items.length > 0) {
          const itemInserts = updates.items.map(item => ({
            outfit_id: id,
            name: item.name,
            type: item.type,
            image_url: item.image_url,
            affiliate_links: item.affiliate_links
          }))

          const { error: itemsError } = await supabase
            .from('outfit_items')
            .insert(itemInserts)

          if (itemsError) throw itemsError
        }
      }

      // Revalidate specific outfit and outfits list
      mutate(`outfit-${id}`)
      mutate('outfits')
      
      return outfit
    } catch (error) {
      console.error('Error updating outfit:', error)
      throw error
    }
  }

  const deleteOutfit = async (id: string) => {
    try {
      // Delete related records first
      await supabase
        .from('outfit_categories')
        .delete()
        .eq('outfit_id', id)

      await supabase
        .from('outfit_items')
        .delete()
        .eq('outfit_id', id)

      // Delete the outfit
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Revalidate outfits list
      mutate('outfits')
      
      return true
    } catch (error) {
      console.error('Error deleting outfit:', error)
      throw error
    }
  }

  const addOutfitItem = async (item: {
    outfit_id: string
    name: string
    type: string
    image_url?: string
    affiliate_links?: Array<{ store: string; url: string }>
  }) => {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert({
          outfit_id: item.outfit_id,
          name: item.name,
          type: item.type,
          image_url: item.image_url,
          affiliate_links: item.affiliate_links || []
        })
        .select()
        .single()

      if (error) throw error

      // Revalidate the outfit that contains this item
      mutate(`outfit-${item.outfit_id}`)
      mutate('outfits')
      
      return data
    } catch (error) {
      console.error('Error adding outfit item:', error)
      throw error
    }
  }

  const updateOutfitItem = async (id: string, updates: {
    name?: string
    type?: string
    image_url?: string
    affiliate_links?: Array<{ store: string; url: string }>
  }) => {
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Revalidate outfits
      mutate('outfits')
      
      return data
    } catch (error) {
      console.error('Error updating outfit item:', error)
      throw error
    }
  }

  const deleteOutfitItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Revalidate outfits
      mutate('outfits')
      
      return true
    } catch (error) {
      console.error('Error deleting outfit item:', error)
      throw error
    }
  }

  const incrementViewCount = async (outfitId: string) => {
    try {
      // Try RPC function first, fallback to direct update
      const { error: rpcError } = await supabase
        .rpc('increment_view_count', { outfit_id: outfitId })

      if (rpcError) {
        // Fallback to direct update if RPC function doesn't exist
        const { error: updateError } = await supabase
          .rpc('increment_view_count', { outfit_id: outfitId })

        if (updateError) throw updateError
      }

      // Revalidate specific outfit to update view count
      mutate(`outfit-${outfitId}`)
    } catch (error) {
      console.error('Error incrementing view count:', error)
      throw error
    }
  }

  const toggleSaveOutfit = async (outfitId: string, userId: string) => {
    try {
      // Check if already saved
      const { data: existingSave } = await supabase
        .from('user_saved_outfits')
        .select('id')
        .eq('outfit_id', outfitId)
        .eq('user_id', userId)
        .single()

      if (existingSave) {
        // Remove save
        const { error } = await supabase
          .from('user_saved_outfits')
          .delete()
          .eq('id', existingSave.id)

        if (error) throw error

        // Decrement saved count
        const { error: rpcError } = await supabase
          .rpc('decrement_saved_count', { outfit_id: outfitId })

        if (rpcError) {
          // Fallback to direct update if RPC function doesn't exist
                  const { error: updateError } = await supabase
          .rpc('decrement_saved_count', { outfit_id: outfitId })

          if (updateError) throw updateError
        }

        return { saved: false }
      } else {
        // Add save
        const { data, error } = await supabase
          .from('user_saved_outfits')
          .insert({
            outfit_id: outfitId,
            user_id: userId
          })
          .select()
          .single()

        if (error) throw error

        // Increment saved count
        const { error: rpcError } = await supabase
          .rpc('increment_saved_count', { outfit_id: outfitId })

        if (rpcError) {
          // Fallback to direct update if RPC function doesn't exist
                  const { error: updateError } = await supabase
          .rpc('increment_saved_count', { outfit_id: outfitId })

          if (updateError) throw updateError
        }

        return { saved: true, data }
      }
    } catch (error) {
      console.error('Error toggling save outfit:', error)
      throw error
    } finally {
      // Revalidate saved outfits and specific outfit
      mutate(`user-saved-outfits-${userId}`)
      mutate(`outfit-${outfitId}`)
      mutate(`is-outfit-saved-${outfitId}-${userId}`)
    }
  }

  return {
    createOutfit,
    updateOutfit,
    deleteOutfit,
    addOutfitItem,
    updateOutfitItem,
    deleteOutfitItem,
    incrementViewCount,
    toggleSaveOutfit,
  }
}

