'use client';
import { useState } from 'react';
import type { z } from 'zod';
import type { OutfitSuggestionOutput } from '@/ai/flows/ai-outfit-suggester';
import { getOutfitSuggestion } from '@/app/actions';
import { OutfitSuggesterForm, type OutfitSuggestionFormSchema } from '@/components/outfit-suggester-form';
import { OutfitSuggestionCard } from '@/components/outfit-suggestion-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function OutfitSuggester() {
  const [suggestion, setSuggestion] = useState<OutfitSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestion = async (values: z.infer<typeof OutfitSuggestionFormSchema>) => {
    setIsLoading(true);
    setSuggestion(null);
    const result = await getOutfitSuggestion(values);
    if (result.success && result.data) {
      setSuggestion(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <section>
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">AI Outfit Suggester</CardTitle>
          <CardDescription>Get a personalized outfit suggestion from our virtual stylist.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <OutfitSuggesterForm onSubmit={handleSuggestion} isLoading={isLoading} />
            <div className="mt-8 md:mt-0">
                <OutfitSuggestionCard suggestion={suggestion} isLoading={isLoading} />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
