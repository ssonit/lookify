
'use client';

import { useState } from 'react';
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageHeader } from "@/components/page-header";
import { FitGuideForm, type FitGuideFormValues } from '@/components/fit-guide-form';
import { FitGuideResultCard } from '@/components/fit-guide-result-card';
import { Card, CardContent } from '@/components/ui/card';

export type SuggestedSizes = {
    top: string;
    bottom: string;
    dress: string;
};

export default function FitGuidePage() {
    const [suggestedSizes, setSuggestedSizes] = useState<SuggestedSizes | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = (values: FitGuideFormValues) => {
        setIsLoading(true);
        console.log("Fit guide values:", values);
        
        // Mock API call and logic to determine sizes
        setTimeout(() => {
            // This is where you would have logic to determine sizes based on input.
            // For now, we'll return a mock result.
            if (values.gender === 'female') {
                 setSuggestedSizes({
                    top: 'M / 8-10',
                    bottom: 'L / 12',
                    dress: 'M'
                });
            } else {
                 setSuggestedSizes({
                    top: 'L / 40-42',
                    bottom: '32-34',
                    dress: 'N/A'
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                <PageHeader
                    title="Hướng dẫn chọn Size"
                    description="Nhập số đo của bạn hoặc tải ảnh lên để nhận gợi ý về kích cỡ phù hợp nhất, giúp bạn tự tin hơn với mỗi lựa chọn."
                    className="mb-8"
                />

                <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
                    <Card>
                        <CardContent className="p-6">
                            <FitGuideForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                        </CardContent>
                    </Card>
                    <div className="sticky top-24">
                        <FitGuideResultCard suggestedSizes={suggestedSizes} isLoading={isLoading} />
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
