import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_role: 'admin' | 'user'
  bio: string | null
  website: string | null
  location: string | null
  date_of_birth: string | null
  phone: string | null
  is_verified: boolean
  subscription_status: string | null
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface UsersResponse {
  users: User[]
  totalCount: number
}

export interface UserFilterParams {
  search?: string
  role?: string
  is_verified?: boolean
  limit?: number
  offset?: number
}

const fetcher = async (url: string): Promise<User[]> => {
  const supabase = createClient()
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      user_role,
      bio,
      website,
      location,
      date_of_birth,
      phone,
      is_verified,
      subscription_status,
      subscription_expires_at,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return users || []
}

// Server-side filtering and pagination
export function useFilteredUsers(params: UserFilterParams = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    `users-filtered-${JSON.stringify(params)}`,
    async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          user_role,
          bio,
          website,
          location,
          date_of_birth,
          phone,
          is_verified,
          subscription_status,
          subscription_expires_at,
          created_at,
          updated_at
        `, { count: 'exact' })

      // Apply filters
      if (params.search) {
        query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
      }

      if (params.role) {
        query = query.eq('user_role', params.role)
      }

      if (params.is_verified !== undefined) {
        query = query.eq('is_verified', params.is_verified)
      }

      // Apply pagination
      const limit = params.limit || 10
      const offset = params.offset || 0
      query = query.range(offset, offset + limit - 1)

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      const { data: users, error, count } = await query

      if (error) throw error

      return {
        users: users || [],
        totalCount: count || 0
      } as UsersResponse
    }
  )

  return {
    users: data?.users || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    mutate
  }
}

// Legacy hook for backward compatibility
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR('users', fetcher)

  return {
    users: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `user-${id}` : null,
    async () => {
      const supabase = createClient()
      
      const { data: user, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          user_role,
          bio,
          website,
          location,
          date_of_birth,
          phone,
          is_verified,
          subscription_status,
          subscription_expires_at,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return user
    }
  )

  return {
    user: data,
    isLoading,
    error,
    mutate
  }
}
