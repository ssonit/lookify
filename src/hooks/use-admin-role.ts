"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/auth-context';

export function useAdminRole() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedUserId, setLastCheckedUserId] = useState<string | null>(null);

  useEffect(() => {
    // Nếu không có user, reset state
    if (!currentUser) {
      setIsAdmin(null);
      setIsLoading(false);
      setLastCheckedUserId(null);
      return;
    }

    // Nếu đã check user này rồi, không check lại
    if (lastCheckedUserId === currentUser.id && isAdmin !== null) {
      return;
    }

    const checkAdminRole = async () => {
      try {
        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', currentUser.id)
          .single();
        
        if (error || !profile ) {
          setIsAdmin(false);
        } else {
          setIsAdmin(profile.user_role === 'admin');
        }
        
        setLastCheckedUserId(currentUser.id);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        setLastCheckedUserId(currentUser.id);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [currentUser, lastCheckedUserId]);

  return {
    isAdmin,
    isLoading,
    currentUser
  };
}
