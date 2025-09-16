'use client';

import { useState } from 'react';
import { Download, Share2, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useImageDownload } from '@/hooks/use-image-download';
import { useShare } from '@/hooks/use-share';
import { useToast } from '@/hooks/use-toast';

interface ImageActionsProps {
  imageUrl: string;
  outfitId?: string;
  outfitTitle?: string;
  itemName?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

export function ImageActions({ 
  imageUrl, 
  outfitId, 
  outfitTitle, 
  itemName,
  className,
  variant = 'outline',
  size = 'sm',
  disabled = false
}: ImageActionsProps) {
  const [copied, setCopied] = useState(false);
  const { downloadImage, downloadOutfitImage, downloadItemImage, isDownloading } = useImageDownload();
  const { shareImage, shareOutfit, copyToClipboard, isSharing } = useShare();
  const { toast } = useToast();

  const handleDownload = async () => {
    let result;
    
    if (outfitId && outfitTitle) {
      result = await downloadOutfitImage(outfitId, imageUrl, outfitTitle);
    } else if (itemName) {
      result = await downloadItemImage(itemName, imageUrl);
    } else {
      result = await downloadImage(imageUrl);
    }

    if (result.success) {
      toast({
        title: 'Download started',
        description: 'Your image is being downloaded...',
      });
    } else {
      toast({
        title: 'Download failed',
        description: result.error || 'Failed to download image',
        variant: 'destructive',
      });
    }
  };

  const handleShareImage = async () => {
    const result = await shareImage(imageUrl, outfitTitle || itemName);
    
    if (result.success) {
      toast({
        title: 'Image shared',
        description: 'Image shared successfully!',
      });
    } else {
      toast({
        title: 'Share failed',
        description: result.error || 'Failed to share image',
        variant: 'destructive',
      });
    }
  };

  const handleShareOutfit = async () => {
    if (!outfitId) return;
    
    const result = await shareOutfit(outfitId, outfitTitle);
    
    if (result.success) {
      toast({
        title: 'Outfit shared',
        description: 'Outfit link shared successfully!',
      });
    } else {
      toast({
        title: 'Share failed',
        description: result.error || 'Failed to share outfit',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = async () => {
    const result = await copyToClipboard(imageUrl);
    
    if (result.success) {
      setCopied(true);
      toast({
        title: 'Link copied',
        description: 'Image link copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: 'Copy failed',
        description: result.error || 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const isLoading = isDownloading || isSharing;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isLoading || disabled}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          Tải xuống
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleShareImage} disabled={isSharing}>
          <Share2 className="mr-2 h-4 w-4" />
          Chia sẻ hình ảnh
        </DropdownMenuItem>
        
        {outfitId && (
          <DropdownMenuItem onClick={handleShareOutfit} disabled={isSharing}>
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ outfit
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleCopyLink} disabled={isSharing}>
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Đã sao chép!' : 'Sao chép link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
