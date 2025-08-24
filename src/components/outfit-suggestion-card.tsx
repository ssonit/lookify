import type { OutfitSuggestionOutput } from '@/ai/flows/ai-outfit-suggester';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Paintbrush } from 'lucide-react';

interface OutfitSuggestionCardProps {
  suggestion: OutfitSuggestionOutput | null;
  isLoading: boolean;
}

const LoadingSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <Skeleton className="h-7 w-48" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-64 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);

export function OutfitSuggestionCard({ suggestion, isLoading }: OutfitSuggestionCardProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!suggestion) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full bg-muted/50">
        <Paintbrush className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">Your outfit suggestion will appear here.</p>
        <p className="text-sm text-muted-foreground">Fill out the form and let our AI style you!</p>
      </div>
    );
  }

  const unsplashUrl = `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop`;

  return (
    <Card className="overflow-hidden h-full">
        <CardHeader>
          <CardTitle className="font-headline">Your Style Suggestion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
              <Image src={suggestion.imageUrl || unsplashUrl} alt={suggestion.outfitDescription} fill className="object-cover" data-ai-hint="fashion style" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-sm text-muted-foreground">{suggestion.outfitDescription}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Key Items</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestion.keyItems.map((item) => <Badge key={item} variant="secondary" className="text-sm">{item}</Badge>)}
              </div>
            </div>
             <div>
              <h3 className="font-semibold text-lg">Colors</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestion.colors.map((color) => <Badge key={color} variant="outline" className="text-sm">{color}</Badge>)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Styling Tips</h3>
              <p className="text-sm text-muted-foreground">{suggestion.stylingTips}</p>
            </div>
        </CardContent>
    </Card>
  );
}
