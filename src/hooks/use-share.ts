import { useState } from 'react';

interface ShareResult {
  success: boolean;
  error?: string;
}

export function useShare() {
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = async (url: string, title?: string, text?: string): Promise<ShareResult> => {
    try {
      setIsSharing(true);

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: title || 'Check out this outfit',
          text: text || 'Look at this amazing outfit!',
          url: url
        });
        return { success: true };
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        return { success: true };
      }
    } catch (error) {
      console.error('Share failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Share failed' 
      };
    } finally {
      setIsSharing(false);
    }
  };

  const shareOutfit = async (outfitId: string, outfitTitle?: string, outfitDescription?: string) => {
    const url = `${window.location.origin}/outfit/${outfitId}`;
    const title = outfitTitle ? `Outfit: ${outfitTitle}` : 'Check out this outfit';
    const text = outfitDescription || 'Look at this amazing outfit!';
    
    return shareUrl(url, title, text);
  };

  const shareImage = async (imageUrl: string, title?: string) => {
    try {
      setIsSharing(true);

      // Check if Web Share API supports files
      if (navigator.share && navigator.canShare) {
        // Fetch the image as blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'outfit-image.webp', { type: 'image/webp' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title || 'Outfit Image',
            files: [file]
          });
          return { success: true };
        }
      }

      // Fallback: share URL
      return shareUrl(imageUrl, title);
    } catch (error) {
      console.error('Share image failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Share image failed' 
      };
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text: string): Promise<ShareResult> => {
    try {
      setIsSharing(true);
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Copy failed' 
      };
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    shareUrl,
    shareOutfit,
    shareImage,
    copyToClipboard
  };
}
