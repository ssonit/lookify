'use client';

import { createClient } from '@/utils/supabase/client';
import { useImageUpload } from './use-image-upload';
import { useState } from 'react';

export interface UpdateOutfitData {
  id: string;
  title: string;
  description: string | null;
  gender: 'male' | 'female';
  season: string | null;
  color: string | null;
  image_url: string | null;
  ai_hint: string | null;
  is_ai_generated: boolean;
  is_public: boolean;
  categories: string[];
  items: Array<{
    id?: string;
    name: string;
    type: string;
    image_url: string | null;
    imageFile?: File | null;
    affiliate_links: Array<{
      store: string;
      url: string;
    }>;
  }>;
  mainImageFile?: File;
  deletedItemIds?: string[];
}

export function useOutfitUpdate() {
  const supabase = createClient();
  const { uploadOutfitImage, uploadOutfitItemImage } = useImageUpload();
  const [isLoading, setIsLoading] = useState(false);

  const updateOutfit = async (data: UpdateOutfitData) => {
    try {
      setIsLoading(true);

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Unauthorized');
      }

      // Use season and color IDs directly (no need to fetch from names)
      const seasonId = data.season || null;
      const colorId = data.color || null;

      // Upload main image if provided
      let mainImageUrl = data.image_url;
      if (data.mainImageFile) {
        try {
          const uploadResult = await uploadOutfitImage(data.mainImageFile, data.id);
          if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload main image');
          }
          mainImageUrl = uploadResult.url!;
        } catch (imageError) {
          throw new Error(`Failed to upload main image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
        }
      }

      // Update outfit
      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .update({
          title: data.title,
          description: data.description,
          gender: data.gender,
          season_id: seasonId,
          color_id: colorId,
          image_url: mainImageUrl,
          ai_hint: data.ai_hint,
          is_ai_generated: data.is_ai_generated,
          is_public: data.is_public
        })
        .eq('id', data.id)
        .select()
        .single();

      if (outfitError) {
        throw new Error(`Failed to update outfit: ${outfitError.message}`);
      }

      // Update categories - delete existing and insert new ones
      const { error: deleteCategoriesError } = await supabase
        .from('outfit_categories')
        .delete()
        .eq('outfit_id', data.id);

      if (deleteCategoriesError) {
        console.error('Error deleting categories:', deleteCategoriesError);
      }

      if (data.categories.length > 0) {
        const categoryInserts = data.categories.map(categoryId => ({
          outfit_id: data.id,
          category_id: categoryId
        }));

        const { error: categoryError } = await supabase
          .from('outfit_categories')
          .insert(categoryInserts);

        if (categoryError) {
          throw new Error(`Failed to update categories: ${categoryError.message}`);
        }
      }

      // Delete removed items
      if (data.deletedItemIds && data.deletedItemIds.length > 0) {
        const { error: deleteItemsError } = await supabase
          .from('outfit_items')
          .delete()
          .in('id', data.deletedItemIds);

        if (deleteItemsError) {
          console.error('Error deleting items:', deleteItemsError);
        }
      }

      // Process items sequentially
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        
        if (item.id) {
          // Update existing item
          const { error: updateItemError } = await supabase
            .from('outfit_items')
            .update({
              name: item.name,
              type: item.type,
              image_url: item.image_url,
              affiliate_links: item.affiliate_links
            })
            .eq('id', item.id);

          if (updateItemError) {
            throw new Error(`Failed to update item ${i + 1}: ${updateItemError.message}`);
          }

          // Upload image for existing item if provided
          if (item.imageFile) {
            try {
              const uploadResult = await uploadOutfitItemImage(item.imageFile, data.id);
              if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Failed to upload item image');
              }
              const imageUrl = uploadResult.url!;
              
              // Update item with uploaded image URL
              const { error: updateError } = await supabase
                .from('outfit_items')
                .update({ image_url: imageUrl })
                .eq('id', item.id);

              if (updateError) {
                console.error(`Error updating image for item ${i + 1}:`, updateError);
              }
            } catch (imageError) {
              console.error(`Error uploading image for item ${i + 1}:`, imageError);
            }
          }
        } else {
          // Create new item
          const { data: insertedItem, error: createItemError } = await supabase
            .from('outfit_items')
            .insert({
              outfit_id: data.id,
              name: item.name,
              type: item.type,
              image_url: item.image_url,
              affiliate_links: item.affiliate_links
            })
            .select('id')
            .single();

          if (createItemError) {
            throw new Error(`Failed to create item ${i + 1}: ${createItemError.message}`);
          }

          // Upload image for new item if provided
          if (item.imageFile && insertedItem) {
            try {
              const uploadResult = await uploadOutfitItemImage(item.imageFile, data.id);
              if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Failed to upload item image');
              }
              const imageUrl = uploadResult.url!;
              
              // Update item with uploaded image URL
              const { error: updateError } = await supabase
                .from('outfit_items')
                .update({ image_url: imageUrl })
                .eq('id', insertedItem.id);

              if (updateError) {
                console.error(`Error updating image for item ${i + 1}:`, updateError);
              }
            } catch (imageError) {
              console.error(`Error uploading image for item ${i + 1}:`, imageError);
            }
          }
        }
      }

      return { ...outfit, image_url: mainImageUrl };

    } catch (error) {
      console.error('Error updating outfit:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateOutfit,
    isLoading
  };
}
