import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'

export interface Color {
  id: string
  name: string
  label: string
  description: string | null
  hex: string
  created_at: string
}

// Hook to fetch all colors
export function useColors() {
  const { data, error, isLoading, mutate } = useSWR(
    'colors',
    async () => {
      const supabase = createClient()
      
      const { data: colors, error } = await supabase
        .from('colors')
        .select('id, name, label, description, hex, created_at')
        .order('name', { ascending: true })

      if (error) throw error
      return colors || []
    }
  )

  return {
    colors: data || [],
    isLoading,
    error,
    mutate
  }
}

// Hook to fetch single color by ID
export function useColor(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `color-${id}` : null,
    async () => {
      const supabase = createClient()
      
      const { data: color, error } = await supabase
        .from('colors')
        .select('id, name, label, description, hex, created_at')
        .eq('id', id)
        .single()

      if (error) throw error
      return color
    }
  )

  return {
    color: data,
    isLoading,
    error,
    mutate
  }
}

// Hook for color mutations
export function useColorMutations() {
  const { mutate: mutateColors } = useColors()

  const createColor = async (colorData: Omit<Color, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('colors')
      .insert([colorData])
      .select()
      .single()

    if (error) throw error
    
    // Revalidate colors list
    mutateColors()
    
    return data
  }

  const updateColor = async (id: string, colorData: Partial<Omit<Color, 'id' | 'created_at' | 'updated_at'>>) => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('colors')
      .update(colorData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    // Revalidate colors list
    mutateColors()
    
    return data
  }

  const deleteColor = async (id: string) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    // Revalidate colors list
    mutateColors()
  }

  return {
    createColor,
    updateColor,
    deleteColor
  }
}
