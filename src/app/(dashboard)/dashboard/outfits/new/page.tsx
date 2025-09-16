
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from "@/components/page-title";
import { OutfitForm } from "@/components/outfit-form";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { OutfitFormValues } from '@/components/outfit-form';

export default function NewOutfitPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async (data: OutfitFormValues) => {
    try {
      toast({
        title: "Thành công",
        description: "Outfit đã được tạo thành công!",
      });

      // Navigate back to outfits list
      router.push('/dashboard/outfits');
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo outfit. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Thêm Outfit mới">
        <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </PageTitle>
      <OutfitForm onSave={handleSave} />
    </div>
  );
}
