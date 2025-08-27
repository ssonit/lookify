
'use client';

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { outfits } from "@/lib/outfits";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Bot } from "lucide-react";

const moods = [
    { id: 'confident', label: "Tự tin & Quyền lực", description: "Trang phục tạo ấn tượng mạnh, phù hợp cho thuyết trình hoặc các sự kiện quan trọng.", icon: "🎭" },
    { id: 'comfortable', label: "Thoải mái & Tối giản", description: "Phong cách nhẹ nhàng, ưu tiên sự tiện dụng cho những ngày làm việc tại nhà hoặc dạo phố.", icon: "😌" },
    { id: 'elegant', label: "Thanh lịch & Tinh tế", description: "Vẻ ngoài sang trọng, phù hợp cho các buổi tiệc, hẹn hò hoặc sự kiện đặc biệt.", icon: "🧐" },
    { id: 'creative', label: "Sáng tạo & Nổi bật", description: "Phá cách với những món đồ độc đáo, thể hiện cá tính riêng của bạn.", icon: "🎨" },
];

export default function MoodStylingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeMoodId = searchParams.get('mood') || moods[0].id;
    const selectedMood = moods.find(m => m.id === activeMoodId) || moods[0];

    const suggestedOutfits = outfits.slice(0, 4); // Placeholder for suggested outfits

    const handleMoodChange = (moodId: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('mood', moodId);
        router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
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
                         <Button>
                            <Sparkles className="mr-2"/>
                            Tạo gợi ý mới
                        </Button>
                    </div>
                   
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestedOutfits.map(outfit => (
                            <Link key={outfit.id} href={`/outfit/${outfit.id}`} passHref>
                                <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full rounded-2xl">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <Image src={outfit.mainImage} width={400} height={500} alt={outfit.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" data-ai-hint={outfit.aiHint} />
                                             <div className="absolute top-2 right-2 p-1.5 bg-primary/80 text-primary-foreground rounded-full">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
