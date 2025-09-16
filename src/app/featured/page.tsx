
'use client';

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilteredOutfits } from "@/hooks/use-outfits";
import { OutfitCard } from "@/components/outfit-card";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
    { 
        id: 'confident', 
        label: "Tự tin & Quyền lực", 
        description: "Trang phục tạo ấn tượng mạnh, phù hợp cho thuyết trình hoặc các sự kiện quan trọng.", 
        icon: "🎭",
        categories: ["work/office", "elegant"]
    },
    { 
        id: 'comfortable', 
        label: "Thoải mái & Tối giản", 
        description: "Phong cách nhẹ nhàng, ưu tiên sự tiện dụng cho những ngày làm việc tại nhà hoặc dạo phố.", 
        icon: "😌",
        categories: ["casual", "basic"]
    },
    { 
        id: 'elegant', 
        label: "Thanh lịch & Tinh tế", 
        description: "Vẻ ngoài sang trọng, phù hợp cho các buổi tiệc, hẹn hò hoặc sự kiện đặc biệt.", 
        icon: "🧐",
        categories: ["elegant", "party/date"]
    },
    { 
        id: 'creative', 
        label: "Sáng tạo & Nổi bật", 
        description: "Phá cách với những món đồ độc đáo, thể hiện cá tính riêng của bạn.", 
        icon: "🎨",
        categories: ["streetwear", "game/anime"]
    },
];

export default function MoodStylingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [isGenerating, setIsGenerating] = useState(false);

    const activeMoodId = searchParams.get('mood') || moods[0].id;
    const selectedMood = moods.find(m => m.id === activeMoodId) || moods[0];

    // Fetch outfits based on selected mood categories
    const { outfits: suggestedOutfits, isLoading, error } = useFilteredOutfits({
        category: selectedMood.categories[0], // Use first category for now
        limit: 8
    });

    const handleMoodChange = (moodId: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('mood', moodId);
        router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    };

    const handleGenerateNew = async () => {
        setIsGenerating(true);
        // Simulate AI generation delay
        setTimeout(() => {
            setIsGenerating(false);
            toast({
                title: "Gợi ý mới đã được tạo!",
                description: "Chúng tôi đã cập nhật danh sách outfit phù hợp với mood của bạn.",
            });
        }, 2000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                <PageHeader
                    title="Styling theo Mood"
                    description="Bạn cảm thấy thế nào hôm nay? Hãy chọn một tâm trạng và để AI của chúng tôi gợi ý những bộ trang phục hoàn hảo để thể hiện cá tính của bạn."
                    className="mb-8"
                />

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-6 font-headline">Chọn mood của bạn</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {moods.map((mood) => (
                            <Card
                                key={mood.id}
                                className={`cursor-pointer transition-all duration-300 rounded-2xl ${selectedMood.id === mood.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                                onClick={() => handleMoodChange(mood.id)}
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-3">{mood.icon}</div>
                                    <h3 className="font-semibold text-lg">{mood.label}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{mood.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
                
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold font-headline">Gợi ý cho mood "{selectedMood.label}"</h2>
                        <Button 
                            onClick={handleGenerateNew}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2" />
                            )}
                            {isGenerating ? 'Đang tạo...' : 'Tạo gợi ý mới'}
                        </Button>
                    </div>
                   
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden rounded-2xl">
                                    <CardContent className="p-0">
                                        <Skeleton className="aspect-[4/5] w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">Không thể tải gợi ý outfit</p>
                            <Button onClick={() => window.location.reload()}>
                                Thử lại
                            </Button>
                        </div>
                    ) : suggestedOutfits.length === 0 ? (
                        <div className="text-center py-12">
                            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground mb-4">Chưa có outfit nào phù hợp với mood này</p>
                            <Button onClick={handleGenerateNew}>
                                <Sparkles className="mr-2" />
                                Tạo gợi ý mới
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestedOutfits.map(outfit => (
                                <div key={outfit.id} className="relative">
                                    <OutfitCard outfit={outfit} />
                                    <div className="absolute top-2 left-2 p-1.5 bg-primary/80 text-primary-foreground rounded-full z-10">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>
            <Footer />
        </div>
    );
}
