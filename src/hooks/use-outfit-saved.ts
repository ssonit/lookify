'use client';

import { useState, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useOutfitSaved() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { toast } = useToast();
  const supabase = createClient();

  const toggleSaved = useCallback(async (outfitId: string) => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để lưu outfit",
          variant: "destructive",
        });
        return;
      }

      // Check if outfit is already favorited
      const { data: existingFavorite, error: checkError } = await supabase
        .from('user_saved_outfits')
        .select('id')
        .eq('user_id', user.id)
        .eq('outfit_id', outfitId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('user_saved_outfits')
          .delete()
          .eq('id', existingFavorite.id);

        if (deleteError) throw deleteError;

        toast({
          title: "Đã bỏ lưu",
          description: "Outfit đã được xóa khỏi bộ sưu tập của bạn",
        });
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('user_saved_outfits')
          .insert({
            user_id: user.id,
            outfit_id: outfitId,
          });

        if (insertError) throw insertError;

        toast({
          title: "Đã lưu",
          description: "Outfit đã được thêm vào bộ sưu tập của bạn",
        });
      }

      // Revalidate related data
      mutate('/api/outfits');
      mutate('/api/user-favorites');

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu outfit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, mutate, toast]);

  const isSaved = useCallback(async (outfitId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: favorite, error } = await supabase
        .from('user_saved_outfits')
        .select('id')
        .eq('user_id', user.id)
        .eq('outfit_id', outfitId)
        .single();

      return !error && !!favorite;
    } catch {
      return false;
    }
  }, [supabase]);

  return {
    toggleSaved,
    isSaved,
    isLoading,
  };
}
