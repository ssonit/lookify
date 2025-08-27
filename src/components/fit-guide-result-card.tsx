
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Ruler } from 'lucide-react';
import type { SuggestedSizes } from '@/app/fit-guide/page';

interface FitGuideResultCardProps {
  suggestedSizes: SuggestedSizes | null;
  isLoading: boolean;
}

const LoadingSkeleton = () => (
  <Card className="h-full rounded-2xl">
    <CardHeader>
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
        </div>
    </CardContent>
  </Card>
);

export function FitGuideResultCard({ suggestedSizes, isLoading }: FitGuideResultCardProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!suggestedSizes) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl h-full bg-muted/50">
        <Ruler className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">Gợi ý size của bạn sẽ xuất hiện ở đây.</p>
        <p className="text-sm text-muted-foreground">Hãy điền thông tin để chúng tôi tìm size phù hợp cho bạn!</p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden h-full rounded-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Gợi ý kích thước cho bạn</CardTitle>
          <CardDescription>Dựa trên thông tin bạn cung cấp, đây là các size đề xuất. Lưu ý đây chỉ là thông tin tham khảo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-xl border bg-card p-4">
                <div className="text-sm text-muted-foreground">Áo (T-shirt, Sơ mi, v.v.)</div>
                <div className="mt-1 text-2xl font-bold">{suggestedSizes.top}</div>
            </div>
             <div className="rounded-xl border bg-card p-4">
                <div className="text-sm text-muted-foreground">Quần (Jeans, Kaki, v.v.)</div>
                <div className="mt-1 text-2xl font-bold">{suggestedSizes.bottom}</div>
            </div>
             <div className="rounded-xl border bg-card p-4">
                <div className="text-sm text-muted-foreground">Váy / Đầm</div>
                <div className="mt-1 text-2xl font-bold">{suggestedSizes.dress}</div>
            </div>
        </CardContent>
    </Card>
  );
}
