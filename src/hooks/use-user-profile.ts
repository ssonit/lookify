"use client";

import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import useSWR from 'swr';

const supabase = createClient();

// Fetcher function for SWR
const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export function useUserProfile() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile data using SWR
  const {
    data: profile,
    error,
    isLoading: profileLoading,
    mutate
  } = useSWR(
    currentUser ? `profile-${currentUser.id}` : null,
    () => currentUser ? fetchProfile(currentUser.id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const updateProfile = useCallback(async (updates: {
    full_name?: string;
    avatar_url?: string;
    website?: string;
    bio?: string;
    location?: string;
    phone?: string;
    date_of_birth?: string | null;
  }) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    try {
      setIsLoading(true);
      
      // Prepare updates with proper date handling
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Convert empty string to null for date_of_birth
      if (updates.date_of_birth === '') {
        updateData.date_of_birth = null;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', currentUser.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Revalidate the data
      mutate();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    try {
      setIsLoading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: data.publicUrl });

      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, updateProfile]);

  const getUserProfile = useCallback(async (userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) {
      throw new Error('No user ID provided');
    }

    try {
      setIsLoading(true);
      
      // Get user profile from auth.users
      const { data, error } = await supabase.auth.admin.getUserById(targetUserId);
      
      if (error) {
        throw error;
      }
      
      return data.user;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  return {
    profile,
    isLoading: authLoading || profileLoading || isLoading,
    error,
    updateProfile,
    uploadAvatar,
    getUserProfile,
    mutate,
    currentUser,
  };
}
