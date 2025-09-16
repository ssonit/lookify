'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateAISuggestion, useUpdateAISuggestion } from '@/hooks/use-ai-suggestions';
import { getOutfitSuggestion } from '@/app/actions';
import { useCategories, useSeasons, useColors } from '@/hooks/use-form-options';
import { useImageUpload } from '@/hooks/use-image-upload';
import { createClient } from '@/utils/supabase/client';
import type { AISuggestion } from '@/types/database';

interface AISuggestionGeneratorProps {
  onSuggestionCreated?: (suggestion: AISuggestion) => void;
  className?: string;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' }
];

const MOOD_OPTIONS = [
  'Confident',
  'Elegant',
  'Playful',
  'Sophisticated',
  'Relaxed',
  'Bold',
  'Romantic',
  'Edgy',
  'Classic',
  'Trendy'
];

export function AISuggestionGenerator({ onSuggestionCreated, className }: AISuggestionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    gender: '' as 'male' | 'female' | '',
    category_id: '',
    season_id: '',
    color_id: '',
    mood: '',
    userImage: null as File | null
  });
  
  const { toast } = useToast();
  const { createSuggestion } = useCreateAISuggestion();
  const { updateSuggestion } = useUpdateAISuggestion();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { seasons, isLoading: seasonsLoading } = useSeasons();
  const { colors, isLoading: colorsLoading } = useColors();
  const { uploadUserImageSuggestion } = useImageUpload();

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateSuggestion = async () => {
    // Validation
    if (!formData.gender) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn giới tính",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn danh mục",
        variant: "destructive",
      });
      return;
    }

    if (!formData.season_id) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn mùa",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
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
      const suggestion = await createSuggestion({
        user_id: user.id,
        gender: formData.gender,
        category_id: formData.category_id,
        season_id: formData.season_id,
        color_id: formData.color_id || null,
        mood: formData.mood || null,
        ai_generated_image_url: '', // Will be updated after AI generation
        status: 'processing'
      });

      // Upload user image to storage if provided
      let userImageUrl: string | undefined;
      if (formData.userImage) {
        const uploadResult = await uploadUserImageSuggestion(formData.userImage, suggestion.user_id, suggestion.id);
        if (uploadResult.success && uploadResult.url) {
          userImageUrl = uploadResult.url;
        } else {
          console.warn('Failed to upload user image:', uploadResult.error);
        }
      }

      // Generate AI suggestion using getOutfitSuggestion
      const aiResult = await getOutfitSuggestion({
        gender: formData.gender,
        category_id: formData.category_id,
        season_id: formData.season_id,
        color_id: formData.color_id,
        mood: formData.mood,
        userImage: formData.userImage
      });

      if (aiResult.success && aiResult.data) {
        // Update suggestion with AI results
        await updateSuggestion(suggestion.id, {
          user_image_url: userImageUrl || null,
          ai_generated_image_url: aiResult.data.image_url,
          image_description: aiResult.data.image_prompt,
          status: 'completed'
        });

        toast({
          title: "Thành công!",
          description: "Đã tạo gợi ý AI thành công",
        });
      } else {
        // Update suggestion as failed
        await updateSuggestion(suggestion.id, {
          status: 'failed'
        });

        toast({
          title: "Lỗi AI",
          description: aiResult.error || "Không thể tạo gợi ý AI",
          variant: "destructive",
        });
      }

      // Reset form
      setFormData({
        gender: '',
        category_id: '',
        season_id: '',
        color_id: '',
        mood: '',
        userImage: null
      });

      // Notify parent component
      onSuggestionCreated?.(suggestion);
      
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo gợi ý AI. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = formData.gender && formData.category_id && formData.season_id;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          AI Gợi ý Thời Trang
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin để AI tạo gợi ý trang phục phù hợp cho bạn
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gender Selection */}
        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category_id">Danh mục *</Label>
          <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
          </Select>
        </div>

        {/* Season Selection */}
        <div className="space-y-2">
          <Label htmlFor="season_id">Mùa *</Label>
          <Select value={formData.season_id} onValueChange={(value) => handleInputChange('season_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn mùa" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <Label htmlFor="color_id">Màu sắc</Label>
          <Select value={formData.color_id} onValueChange={(value) => handleInputChange('color_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn màu sắc (tùy chọn)" />
            </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.id}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
          </Select>
        </div>

        {/* Mood Selection */}
        <div className="space-y-2">
          <Label htmlFor="mood">Tâm trạng / Phong cách</Label>
          <Select value={formData.mood} onValueChange={(value) => handleInputChange('mood', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tâm trạng" />
            </SelectTrigger>
            <SelectContent>
              {MOOD_OPTIONS.map((mood) => (
                <SelectItem key={mood} value={mood}>
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="userImage">Ảnh của bạn (tùy chọn)</Label>
          <input
            id="userImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('userImage', e.target.files?.[0] || null)}
            disabled={isGenerating}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formData.userImage && (
            <p className="text-sm text-muted-foreground">
              Đã chọn: {formData.userImage.name}
            </p>
          )}
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerateSuggestion} 
          disabled={isGenerating || !isFormValid}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tạo gợi ý...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Tạo gợi ý AI
            </>
          )}
        </Button>

        {/* Form Summary */}
        {isFormValid && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Tóm tắt gợi ý:</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Giới tính:</span> {GENDER_OPTIONS.find(opt => opt.value === formData.gender)?.label}</p>
              <p><span className="font-medium">Danh mục:</span> {categories.find(cat => cat.id === formData.category_id)?.label}</p>
              <p><span className="font-medium">Mùa:</span> {seasons.find(season => season.id === formData.season_id)?.label}</p>
              {formData.color_id && <p><span className="font-medium">Màu sắc:</span> {colors.find(color => color.id === formData.color_id)?.label}</p>}
              {formData.mood && <p><span className="font-medium">Tâm trạng:</span> {formData.mood}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
