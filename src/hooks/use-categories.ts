import useSWR, { useSWRConfig } from 'swr'
import { createClient } from '@/utils/supabase/client'

export type Category = {
  id: string
  name: string
  label: string
  description: string | null
  created_at: string
}

const fetcher = async (url: string): Promise<Category[]> => {
  const supabase = createClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return categories || []
}

export function useCategories() {
  const { data: categories, error, isLoading, mutate } = useSWR<Category[]>(
    'categories',
    fetcher
  )

  return {
    categories: categories || [],
    isLoading,
    error,
    mutate
  }
}

export function useCategory(id: string) {
  const { data: category, error, isLoading, mutate } = useSWR<Category>(
    id ? `category-${id}` : null,
    async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    }
  )

  return {
    category,
    isLoading,
    error,
    mutate
  }
}

// Hook để thực hiện mutations trên categories
export function useCategoryMutations() {
  const { mutate } = useSWRConfig()
  const supabase = createClient()

  const createCategory = async (data: {
    name: string
    label: string
    description?: string
  }) => {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          name: data.name,
          label: data.label,
          description: data.description || null
        })
        .select()
        .single()

      if (error) throw error

      // Revalidate categories list
      mutate('categories')
      
      return category
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  const updateCategory = async (id: string, data: {
    name?: string
    label?: string
    description?: string | null
  }) => {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Category updated successfully:', category)

      mutate('categories')
      mutate(`category-${id}`)
      
      return category
    } catch (error) {
      console.error('Error updating category:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Revalidate categories list
      mutate('categories')
      
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory
  }
}
