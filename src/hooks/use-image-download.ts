import { useState } from 'react';

interface DownloadResult {
  success: boolean;
  error?: string;
}

export function useImageDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async (imageUrl: string, filename?: string): Promise<DownloadResult> => {
    try {
      setIsDownloading(true);
      
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `image-${Date.now()}.webp`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Download failed' 
      };
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadOutfitImage = async (outfitId: string, imageUrl: string, outfitTitle?: string) => {
    const filename = outfitTitle 
      ? `${outfitTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${outfitId}.webp`
      : `outfit_${outfitId}.webp`;
    
    return downloadImage(imageUrl, filename);
  };

  const downloadItemImage = async (itemName: string, imageUrl: string) => {
    const filename = `${itemName.replace(/[^a-zA-Z0-9]/g, '_')}.webp`;
    return downloadImage(imageUrl, filename);
  };

  return {
    isDownloading,
    downloadImage,
    downloadOutfitImage,
    downloadItemImage
  };
}
