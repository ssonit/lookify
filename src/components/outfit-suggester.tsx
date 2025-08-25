
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
        title: "Lỗi",
        description: "Không thể nhận gợi ý trang phục. Vui lòng thử lại sau.",
      });
    }
    setIsLoading(false);
  };

  return (
    <section>
      <div className="text-center mb-8">
          <h1 className="font-headline text-3xl md:text-4xl font-bold">Gợi ý trang phục AI</h1>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Nhận gợi ý trang phục được cá nhân hóa từ chuyên gia tạo mẫu ảo của chúng tôi. Hãy điền thông tin bên dưới hoặc tải ảnh của bạn lên!</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
        <Card>
           <CardContent className="p-6">
            <OutfitSuggesterForm onSubmit={handleSuggestion} isLoading={isLoading} />
           </CardContent>
        </Card>
        <div className="sticky top-24">
            <OutfitSuggestionCard suggestion={suggestion} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
