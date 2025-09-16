'use client';

import { useState, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useOutfitLikes() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { toast } = useToast();
  const supabase = createClient();

  const toggleLike = useCallback(async (outfitId: string) => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để thích outfit",
          variant: "destructive",
        });
        return;
      }

      // Check if outfit is already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('target_type', 'outfit')
        .eq('target_id', outfitId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Remove like
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;

        toast({
          title: "Đã bỏ thích",
          description: "Outfit đã được bỏ thích",
        });
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            target_type: 'outfit',
            target_id: outfitId,
          });

        if (insertError) throw insertError;

        toast({
          title: "Đã thích",
          description: "Outfit đã được thêm vào danh sách yêu thích",
        });
      }

      // Revalidate related data
      mutate('/api/outfits');
      mutate('/api/user-likes');

    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thích outfit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, mutate, toast]);

  const isLiked = useCallback(async (outfitId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: like, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('target_type', 'outfit')
        .eq('target_id', outfitId)
        .single();

      return !error && !!like;
    } catch {
      return false;
    }
  }, [supabase]);

  return {
    toggleLike,
    isLiked,
    isLoading,
  };
}
