'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Camera, Upload, Wand2, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateVirtualTryOn, useUpdateVirtualTryOn } from '@/hooks/use-virtual-try-on';
import { useImageUpload } from '@/hooks/use-image-upload';
import { tryOnOutfit } from '@/app/actions';
import { createClient } from '@/utils/supabase/client';
import { ImageActions } from '@/components/ui/image-actions';
import { OutfitSelectionDialog } from '@/components/outfit-selection-dialog';
import type { Outfit } from '@/types/outfit';

interface VirtualTryOnFormData {
  uploadedImage?: File;
  selectedOutfitId?: string;
  selectedOutfit?: Outfit;
}


export function VirtualTryOnForm() {
  const [formData, setFormData] = useState<VirtualTryOnFormData>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isOutfitDialogOpen, setIsOutfitDialogOpen] = useState(false);
  const { toast } = useToast();
  const { uploadUserImage, uploadResultImage } = useImageUpload();
  
  // Virtual try-on mutations
  const { createVirtualTryOn } = useCreateVirtualTryOn();
  const { updateVirtualTryOn } = useUpdateVirtualTryOn();

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, uploadedImage: file }));
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData(prev => ({ ...prev, uploadedImage: undefined }));
  };

  const handleOutfitSelect = (outfit: Outfit) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedOutfitId: outfit.id,
      selectedOutfit: outfit
    }));
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper function to convert image URL to base64
  const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
    }
  };


  const handleTryOn = async () => {
    if (!formData.uploadedImage) {
      toast({
        title: "Thiếu ảnh",
        description: "Vui lòng tải ảnh của bạn lên",
        variant: "destructive",
      });
      return;
    }

    if (!formData.selectedOutfitId) {
      toast({
        title: "Chưa chọn outfit",
        description: "Vui lòng chọn một outfit để thử",
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
        throw new Error('User not authenticated');
      }

      // Create virtual try-on record first to get the ID
      const virtualTryOnData = await createVirtualTryOn({
        uploaded_image_url: '', // Will be updated after upload
        selected_outfit_id: formData.selectedOutfitId,
        status: 'processing',
      });

      console.log('Virtual try-on record created:', virtualTryOnData);

      // Upload user image to storage using virtual try-on ID
      console.log('Uploading user image to storage...');
      const uploadResult = await uploadUserImage(formData.uploadedImage, user.id, virtualTryOnData.id);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload user image');
      }
      const uploadedImageUrl = uploadResult.url!;
      console.log('User image uploaded:', uploadedImageUrl);
      
      // Update virtual try-on record with uploaded image URL
      await updateVirtualTryOn(virtualTryOnData.id, {
        uploaded_image_url: uploadedImageUrl,
      });

      // Convert images to base64 for AI
      console.log('Converting user image to base64...');
      const userImageBase64 = await fileToBase64(formData.uploadedImage);
      console.log('User image converted, length:', userImageBase64.length);
      
      const selectedOutfit = formData.selectedOutfit;
      console.log('Selected outfit:', selectedOutfit?.title);
      
      console.log('Converting outfit image to base64...');
      const outfitImageBase64 = await imageUrlToBase64(selectedOutfit?.image_url || '/api/placeholder/300/400');
      console.log('Outfit image converted, length:', outfitImageBase64.length);

      // Process with AI
      console.log('Calling AI tryOnOutfit...');
      const aiResult = await tryOnOutfit({
        userImage: userImageBase64,
        outfitImage: outfitImageBase64,
      });
      console.log('AI result:', aiResult);

      if (aiResult.success && aiResult.data) {
        // Upload result image to storage using virtual try-on ID
        console.log('Uploading result image to storage...');
        const resultUploadResult = await uploadResultImage(aiResult.data.resultImage, user.id, virtualTryOnData.id);
        if (!resultUploadResult.success) {
          throw new Error(resultUploadResult.error || 'Failed to upload result image');
        }
        const resultImageUrl = resultUploadResult.url!;
        
        // Set result image for display
        setResultImage(resultImageUrl);
        
        // Update record with result image URL
        try {
          await updateVirtualTryOn(virtualTryOnData.id, {
            result_image_url: resultImageUrl,
            status: 'completed',
          });
          console.log('Virtual try-on completed with uploaded images:', { 
            virtualTryOnId: virtualTryOnData.id,
            uploadedImageUrl, 
            resultImageUrl 
          });
        } catch (error) {
          console.error('Error updating virtual try-on record:', error);
        }
        
        toast({
          title: "Thành công!",
          description: "Đã tạo và lưu ảnh thử outfit với AI Gemini 2.5 Flash Image Preview",
        });
      } else {
        // Update record as failed
        try {
          await updateVirtualTryOn(virtualTryOnData.id, {
            status: 'failed',
          });
        } catch (error) {
          console.error('Error updating virtual try-on record:', error);
        }
        
        toast({
          variant: "destructive",
          title: "Lỗi AI",
          description: aiResult.error || "Không thể tạo ảnh thử outfit với AI.",
        });
      }
    } catch (error) {
      console.error('Error creating virtual try-on:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed error:', errorMessage);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: `Không thể tạo ảnh thử outfit. Chi tiết: ${errorMessage}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto space-y-8">
      <PageHeader
        title="Thử outfit"
        description="Thử trang phục ảo với AI. Tải ảnh của bạn lên và chọn outfit để xem kết quả thử trên người!"
        className="mb-8"
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload & Select */}
        <div className="space-y-6">
          {/* Upload Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Ảnh của bạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                {imagePreview ? (
                  <div className="relative group w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed">
                    <Image src={imagePreview} alt="Xem trước ảnh" fill className="object-cover" />
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
                      <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Nhấn để tải ảnh</span> hoặc kéo thả
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Outfit Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                2. Chọn trang phục
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Bạn phải chọn một trang phục để bắt đầu thử.
              </p>
            </CardHeader>
            <CardContent>
              {formData.selectedOutfit ? (
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOutfitDialogOpen(true)}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Chọn trang phục khác
                  </Button>
                  
                  {/* Selected Outfit Display */}
                  <div className="relative bg-muted rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={formData.selectedOutfit.image_url || '/placeholder-outfit.jpg'}
                          alt={formData.selectedOutfit.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {formData.selectedOutfit.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {formData.selectedOutfit.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.selectedOutfit.categories?.slice(0, 2).map((category, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          selectedOutfitId: undefined,
                          selectedOutfit: undefined
                        }))}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOutfitDialogOpen(true)}
                  className="w-full h-32 flex flex-col items-center justify-center gap-2"
                >
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                  <span className="text-lg font-medium">Chọn trang phục</span>
                  <span className="text-sm text-muted-foreground">
                    Nhấn để mở thư viện trang phục
                  </span>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Try On Button */}
          <Button 
            onClick={handleTryOn} 
            disabled={isGenerating || !formData.uploadedImage || !formData.selectedOutfitId}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo ảnh thử...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Thử outfit
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Kết quả
              </CardTitle>
              <div className="flex gap-2">
                    <ImageActions
                      imageUrl={resultImage || ''}
                      outfitId={formData.selectedOutfitId}
                      outfitTitle={formData.selectedOutfit?.title}
                      variant="default"
                      size="sm"
                      disabled={isGenerating || !resultImage}
                    />
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden border">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4 animate-spin" />
                          <h3 className="text-lg font-semibold mb-2">Đang tạo ảnh thử...</h3>
                          <p className="text-muted-foreground">
                            AI đang xử lý và tạo kết quả thử outfit
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="space-y-4">
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden border">
                    <Image
                      src={resultImage}
                      alt="Kết quả thử outfit"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có kết quả</h3>
                    <p className="text-muted-foreground">
                      Tải ảnh và chọn outfit để xem kết quả thử
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Outfit Selection Dialog */}
      <OutfitSelectionDialog
        isOpen={isOutfitDialogOpen}
        onClose={() => setIsOutfitDialogOpen(false)}
        onSelect={handleOutfitSelect}
        selectedOutfitId={formData.selectedOutfitId}
      />
    </div>
  );
}
