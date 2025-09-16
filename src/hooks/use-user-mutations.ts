import { useSWRConfig } from 'swr'
import { createClient } from '@/utils/supabase/client'
import type { User } from './use-users'

export function useUserMutations() {
  const { mutate } = useSWRConfig()
  const supabase = createClient()

  const updateUser = async (id: string, updates: {
    full_name?: string
    avatar_url?: string
    user_role?: 'admin' | 'user'
    bio?: string
    website?: string
    location?: string
    date_of_birth?: string
    phone?: string
    is_verified?: boolean
    subscription_status?: string
    subscription_expires_at?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Revalidate users list and specific user
      mutate('users')
      mutate(`user-${id}`)
      
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Revalidate users list
      mutate('users')
      
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }


  const changeUserRole = async (id: string, role: 'admin' | 'user') => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          user_role: role,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Revalidate users list and specific user
      mutate('users')
      mutate(`user-${id}`)
      
      return data
    } catch (error) {
      console.error('Error changing user role:', error)
      throw error
    }
  }

  return {
    updateUser,
    deleteUser,
    changeUserRole
  }
}
