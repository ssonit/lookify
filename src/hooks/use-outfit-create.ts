'use client';

import { createClient } from '@/utils/supabase/client';
import { useImageUpload } from './use-image-upload';
import { useState } from 'react';

export interface CreateOutfitData {
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
}

export function useOutfitCreate() {
  const supabase = createClient();
  const { uploadOutfitImage, uploadOutfitItemImage } = useImageUpload();
  const [isLoading, setIsLoading] = useState(false);

  const createOutfit = async (data: CreateOutfitData) => {
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

      // Create outfit first to get outfit_id
      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          gender: data.gender,
          season_id: seasonId,
          color_id: colorId,
          image_url: data.image_url,
          ai_hint: data.ai_hint,
          is_ai_generated: data.is_ai_generated,
          is_public: data.is_public
        })
        .select()
        .single();

      if (outfitError) {
        throw new Error(`Failed to create outfit: ${outfitError.message}`);
      }

      // Upload main image if provided
      let mainImageUrl = data.image_url;
      if (data.mainImageFile) {
        try {
          const uploadResult = await uploadOutfitImage(data.mainImageFile, outfit.id);
          if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload main image');
          }
          mainImageUrl = uploadResult.url!;
          
          // Update outfit with main image URL
          const { error: updateError } = await supabase
            .from('outfits')
            .update({ image_url: mainImageUrl })
            .eq('id', outfit.id);

          if (updateError) {
            throw new Error(`Failed to update outfit with main image: ${updateError.message}`);
          }
        } catch (imageError) {
          // Rollback: delete the created outfit if image upload/update fails
          await supabase.from('outfits').delete().eq('id', outfit.id);
          throw new Error(`Failed to upload main image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
        }
      }

      // Add categories
      if (data.categories.length > 0) {
        const categoryInserts = data.categories.map(categoryId => ({
          outfit_id: outfit.id,
          category_id: categoryId
        }));

        const { error: categoryError } = await supabase
          .from('outfit_categories')
          .insert(categoryInserts);

        if (categoryError) {
          // Rollback: delete the created outfit if categories insert fails
          await supabase.from('outfits').delete().eq('id', outfit.id);
          throw new Error(`Failed to add categories: ${categoryError.message}`);
        }
      }

      // Create items sequentially with image upload
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        
        // Create item first
        const { data: insertedItem, error: itemError } = await supabase
          .from('outfit_items')
          .insert({
            outfit_id: outfit.id,
            name: item.name,
            type: item.type,
            image_url: item.image_url,
            affiliate_links: item.affiliate_links
          })
          .select('id')
          .single();

        if (itemError) {
          // Rollback: delete the created outfit if item creation fails
          await supabase.from('outfits').delete().eq('id', outfit.id);
          throw new Error(`Failed to create item ${i + 1}: ${itemError.message}`);
        }

        // Upload image for this item if provided
        if (item.imageFile && insertedItem) {
          try {
            const uploadResult = await uploadOutfitItemImage(item.imageFile, outfit.id);
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

      return { ...outfit, image_url: mainImageUrl };

    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOutfit,
    isLoading
  };
}
