import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  /**
   * Convert image to WebP format and return blob
   */
  const convertToWebP = (file: File | Blob, maxWidth: number = 1200): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((webpBlob) => {
          if (!webpBlob) {
            reject(new Error('Failed to convert to WebP'));
            return;
          }
          resolve(webpBlob);
        }, 'image/webp', 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  /**
   * Upload image to Supabase Storage
   */
  const uploadImage = async (
    file: File | Blob | string,
    path: string,
    bucketName: string = 'lookify'
  ): Promise<UploadResult> => {
    try {
      setIsUploading(true);

      let blob: Blob;

      // Handle different input types
      if (typeof file === 'string') {
        // Data URI
        const response = await fetch(file);
        blob = await response.blob();
      } else {
        blob = file;
      }

      // Convert to WebP
      const webpBlob = await convertToWebP(blob);

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(path, webpBlob, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image to storage:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path);

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return { success: true, url: urlData.publicUrl };

    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Upload user image for virtual try-on
   */
  const uploadUserImage = async (
    file: File,
    userId: string,
    sessionId: string
  ): Promise<UploadResult> => {
    const filePath = `virtual-try-on/${userId}/${sessionId}/uploaded.webp`;
    return uploadImage(file, filePath, 'lookify');
  };

  /**
   * Upload result image for virtual try-on
   */
  const uploadResultImage = async (
    imageDataUri: string,
    userId: string,
    sessionId: string
  ): Promise<UploadResult> => {
    const filePath = `virtual-try-on/${userId}/${sessionId}/result.webp`;
    return uploadImage(imageDataUri, filePath, 'lookify');
  };

  /**
   * Upload outfit main image
   */
  const uploadOutfitImage = async (
    file: File,
    outfitId: string
  ): Promise<UploadResult> => {
    const fileExt = file.name.split('.').pop() || 'webp';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `outfits/${outfitId}/${fileName}`;
    return uploadImage(file, filePath, 'lookify');
  };

  /**
   * Upload outfit item image
   */
  const uploadOutfitItemImage = async (
    file: File,
    outfitId: string
  ): Promise<UploadResult> => {
    const fileExt = file.name.split('.').pop() || 'webp';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `outfits/${outfitId}/items/${fileName}`;
    return uploadImage(file, filePath, 'lookify');
  };

  /**
   * Upload profile image
   */
  const uploadProfileImage = async (
    file: File,
    userId: string
  ): Promise<UploadResult> => {
    const filePath = `profiles/${userId}.webp`;
    return uploadImage(file, filePath, 'lookify');
  };

  /**
   * Upload user image for AI suggestion
   */
  const uploadUserImageSuggestion = async (
    file: File,
    userId: string,
    aiSuggestionId: string
  ): Promise<UploadResult> => {
    const filePath = `suggestions/${userId}/${aiSuggestionId}.webp`;
    return uploadImage(file, filePath, 'lookify');
  };

  return {
    isUploading,
    uploadImage,
    uploadUserImage,
    uploadResultImage,
    uploadOutfitImage,
    uploadOutfitItemImage,
    uploadProfileImage,
    uploadUserImageSuggestion,
    convertToWebP
  };
}
