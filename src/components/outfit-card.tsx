'use client';

import { useState, useEffect } from 'react';
import type { Outfit } from "@/hooks/use-outfits";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Bookmark, BookmarkIcon } from "lucide-react";
import { useOutfitSaved } from "@/hooks/use-outfit-saved";
import { ImageActions } from "@/components/ui/image-actions";

interface OutfitCardProps {
  outfit: Outfit;
  className?: string;
}

export function OutfitCard({ outfit, className }: OutfitCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);
  
  const { toggleSaved, isLoading: isSaving, isSaved: checkIsSaved } = useOutfitSaved();

  // Check if outfit is saved on mount
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const saved = await checkIsSaved(outfit.id);
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      } finally {
        setIsCheckingSaved(false);
      }
    };

    checkSaved();
  }, [outfit.id, checkIsSaved]);

  const handleSavedClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaving) return;
    
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    await toggleSaved(outfit.id);
  };

  return (
    <Card className={`overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full rounded-2xl ${className}`}>
      <Link href={`/outfit/${outfit.id}`} passHref className="block">
        <CardContent className="p-0 relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image 
              src={outfit.image_url || '/placeholder-outfit.jpg'} 
              width={400} 
              height={500} 
              alt={outfit.title} 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
              data-ai-hint={outfit.ai_hint} 
            />
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
            
              
              {/* Save Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
                onClick={handleSavedClick}
                disabled={isSaving || isCheckingSaved}
              >
                {isCheckingSaved ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                ) : isSaved ? (
                  <Bookmark className="h-4 w-4 fill-blue-500 text-blue-500" />
                ) : (
                  <BookmarkIcon className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                )}
                <span className="sr-only">
                  {isSaved ? 'Bỏ lưu outfit' : 'Lưu outfit'}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
