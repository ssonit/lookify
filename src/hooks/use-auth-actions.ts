"use client";

import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Redirect to home page after sign out
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    signInWithGoogle,
    signOut,
    refreshSession,
    isLoading,
  };
}
