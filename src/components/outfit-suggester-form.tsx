
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WandSparkles, UploadCloud, X } from 'lucide-react';
import { useCategories, useSeasons, useColors } from '@/hooks/use-form-options';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useCreateAISuggestion, useUpdateAISuggestion } from '@/hooks/use-ai-suggestions';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AISuggestion } from '@/types/database';

export const OutfitSuggestionFormSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'Vui lòng chọn giới tính.' }),
  category_id: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
  season_id: z.string().min(1, { message: 'Vui lòng chọn mùa.' }),
  color_id: z.string().optional(),
  userImage: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
});

interface OutfitSuggesterFormProps {
  onSubmit: (userImageUrl?: string, categoryName?: string, seasonName?: string, colorName?: string, gender?: 'male' | 'female') => Promise<{ success: boolean; data?: { imageUrl: string; imageDescription: string } }>;
  isLoading: boolean;
}

export function OutfitSuggesterForm({ onSubmit, isLoading }: OutfitSuggesterFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { seasons, isLoading: seasonsLoading } = useSeasons();
  const { colors, isLoading: colorsLoading } = useColors();
  const { uploadUserImageSuggestion } = useImageUpload();
  const { createSuggestion } = useCreateAISuggestion();
  const { updateSuggestion } = useUpdateAISuggestion();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof OutfitSuggestionFormSchema>>({
    resolver: zodResolver(OutfitSuggestionFormSchema),
    defaultValues: {
      gender: 'female',
      category_id: '',
      season_id: '',
      color_id: '',
    },
  });

  const userImageFile = form.watch('userImage');

  useEffect(() => {
    if (userImageFile && userImageFile instanceof File) {
      const objectUrl = URL.createObjectURL(userImageFile);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [userImageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('userImage', file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('userImage', null, { shouldValidate: true });
  };

  const handleFormSubmit = async (values: z.infer<typeof OutfitSuggestionFormSchema>) => {
    let suggestion: AISuggestion | null = null;
    
    try {
      // Get current user ID first
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập để sử dụng tính năng này",
          variant: "destructive",
        });
        return;
      }

      // First create suggestion in database with processing status
      suggestion = await createSuggestion({
        user_id: user.id,
        gender: values.gender,
        category_id: values.category_id,
        season_id: values.season_id,
        color_id: values.color_id || null,
        mood: null,
        ai_generated_image_url: '', // Will be updated after AI generation
        status: 'processing'
      });

      // Upload user image to storage if provided
      let userImageUrl: string | undefined;
      if (values.userImage) {
        const uploadResult = await uploadUserImageSuggestion(values.userImage, user.id, suggestion.id);
        if (uploadResult.success && uploadResult.url) {
          userImageUrl = uploadResult.url;
        } else {
          console.warn('Failed to upload user image:', uploadResult.error);
        }
      }

      // Find category, season, and color names from IDs
      const category = categories.find(c => c.id === values.category_id)?.name;
      const season = seasons.find(s => s.id === values.season_id)?.name;
      const color = values.color_id ? colors.find(c => c.id === values.color_id)?.name : '';

      // Call the original onSubmit function with suggestion ID, user image URL, and names
      try {
        const result = await onSubmit(userImageUrl, category, season, color, values.gender);
        
        // Update suggestion with AI results after onSubmit completes
        if (result && result.success && result.data) {
          await updateSuggestion(suggestion.id, {
            ai_generated_image_url: result.data.imageUrl,
            image_description: result.data.imageDescription,
            status: 'completed'
          });
        } else {
          // Update suggestion as failed if AI generation fails
          await updateSuggestion(suggestion.id, {
            status: 'failed'
          });
        }
      } catch (onSubmitError) {
        // Rollback: Mark suggestion as failed if onSubmit throws error
        await updateSuggestion(suggestion.id, {
          status: 'failed'
        });
        throw onSubmitError; // Re-throw to be caught by outer catch
      }
      
    } catch (error) {
      console.error('Error in form submission:', error);
      
      // Rollback: Delete the ai_suggestions record if it was created
      if (suggestion?.id) {
        try {
          await updateSuggestion(suggestion.id, {
            status: 'failed'
          });
        } catch (rollbackError) {
          console.error('Error rolling back suggestion:', rollbackError);
        }
      }
      
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý form. Vui lòng thử lại sau.",
      });
    }
  };

  const isSubmitting = isLoading || categoriesLoading || seasonsLoading || colorsLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        
        {/* Image Upload */}
        <FormItem>
          <FormLabel>Tải ảnh của bạn (tùy chọn)</FormLabel>
          <FormControl>
            <div className="w-full">
              {imagePreview ? (
                <div className="relative group w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed">
                  <Image src={imagePreview} alt="Xem trước ảnh" layout="fill" objectFit="cover" />
                  <div className="absolute right-2 top-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button type="button" variant="outline" size="icon" onClick={removeImage}>
                        <X />
                        <span className="sr-only">Xóa ảnh</span>
                     </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (tối đa 5MB)</p>
                  </div>
                  <Input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>


        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="season_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mùa</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn mùa" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {seasons.map(season => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Màu sắc</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn màu sắc (tùy chọn)" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color.id} value={color.id}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full !mt-6">
          {isLoading ? (
            'Đang tạo...'
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" /> Gợi ý trang phục
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
