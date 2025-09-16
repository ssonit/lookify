
'use client';
import { useState } from 'react';
import { getOutfitSuggestion } from '@/app/actions';
import { OutfitSuggesterForm } from '@/components/outfit-suggester-form';
import { OutfitSuggestionCard } from '@/components/outfit-suggestion-card';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from '@/components/page-header';

interface SuggestionResult {
  imageUrl: string;
  imageDescription: string;
}

export default function OutfitSuggester() {
  const [suggestion, setSuggestion] = useState<SuggestionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestion = async (userImageUrl?: string, categoryName?: string, seasonName?: string, colorName?: string, gender?: 'male' | 'female') => {
    setIsLoading(true);
    setSuggestion(null);
    
    try {
      // Random mood options
      const moods = ['Confident', 'Elegant', 'Playful', 'Sophisticated', 'Relaxed', 'Bold', 'Romantic', 'Edgy', 'Classic', 'Trendy'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      const result = await getOutfitSuggestion({
        gender: gender || 'female',
        category: categoryName || 'casual',
        colorPreference: colorName || 'neutral colors',
        season: seasonName || 'spring',
        mood: randomMood,
        userImage: userImageUrl
      });
      
      if (result.success && result.data) {
        // Simple suggestion result for display
        const suggestionData: SuggestionResult = {
          imageUrl: result.data.imageUrl,
          imageDescription: result.data.imageDescription
        };
        setSuggestion(suggestionData);

        toast({
          title: "Thành công!",
          description: "Đã tạo gợi ý AI thành công",
        });

        return { success: true, data: result.data };
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể nhận gợi ý trang phục. Vui lòng thử lại sau.",
        });

        return { success: false };
      }
    } catch (error) {
      console.error('Error generating outfit suggestion:', error);

      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo gợi ý. Vui lòng thử lại sau.",
      });

      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <PageHeader 
        title="Gợi ý trang phục AI"
        description="Nhận gợi ý trang phục được cá nhân hóa từ chuyên gia tạo mẫu ảo của chúng tôi. Hãy điền thông tin bên dưới hoặc tải ảnh của bạn lên!"
        className="mb-8"
      />
      <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
        <Card>
           <CardContent className="p-6">
              <OutfitSuggesterForm onSubmit={handleSuggestion} isLoading={isLoading} />
           </CardContent>
        </Card>
        <div className="sticky top-24">
            <OutfitSuggestionCard 
              suggestion={suggestion} 
              isLoading={isLoading} 
            />
        </div>
      </div>
    </section>
  );
}
