import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'
import type { 
  Profile, 
  ProfileInsert, 
  ProfileUpdate
} from '@/types/database'

const supabase = createClient()

// Fetcher functions
const fetchers = {
  // Get current user profile
  getCurrentUserProfile: async (): Promise<Profile | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  },

  // Get profile by ID
  getProfileById: async (id: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  // Get all profiles (admin only)
  getAllProfiles: async (limit?: number, offset?: number): Promise<Profile[]> => {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching profiles:', error)
      throw error
    }

    return data || []
  }
}

// Mutation functions
const mutations = {
  // Create new profile
  createProfile: async (profile: ProfileInsert): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw error
    }

    return data
  },

  // Update profile
  updateProfile: async (id: string, updates: ProfileUpdate): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  },

  // Update current user profile
  updateCurrentUserProfile: async (updates: ProfileUpdate): Promise<Profile | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating current user profile:', error)
      throw error
    }

    return data
  },

  // Delete profile
  deleteProfile: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting profile:', error)
      throw error
    }

    return true
  }
}

// SWR Hooks
export function useCurrentUserProfile() {
  return useSWR<Profile | null, Error>(
    ['current-user-profile'],
    fetchers.getCurrentUserProfile,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )
}

export function useProfile(id: string) {
  return useSWR<Profile | null, Error>(
    id ? ['profile', id] : null,
    () => fetchers.getProfileById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )
}

export function useAllProfiles(limit?: number, offset?: number) {
  return useSWR<Profile[], Error>(
    ['all-profiles', limit, offset],
    () => fetchers.getAllProfiles(limit, offset),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )
}

// Export mutations for use in components
export const profileMutations = mutations
