
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { PageTitle } from "@/components/page-title";
import { OutfitForm } from "@/components/outfit-form";
import type { OutfitFormValues } from '@/components/outfit-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useOutfit } from '@/hooks/use-outfits';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditOutfitPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const outfitId = params.id as string;
  
  const { 
    outfit, 
    isLoading, 
    error, 
    mutate 
  } = useOutfit(outfitId);

  // Transform outfit data to match OutfitForm structure
  const outfitToEdit = useMemo(() => {
    if (!outfit) return undefined;

    console.log('Raw outfit data for edit:', outfit);
    console.log('Season data:', outfit.season);
    console.log('Color data:', outfit.color);
    console.log('Categories data:', outfit.categories);

    const transformed = {
      title: outfit.title,
      description: outfit.description || '',
      gender: outfit.gender,
      season: outfit.season?.id || '',
      color: outfit.color?.id || '',
      mainImage: outfit.image_url || null,
      ai_hint: outfit.ai_hint || '',
      categories: outfit.categories?.map((cat: any) => cat.id) || [],
      items: (outfit.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        imageUrl: item.image_url || null,
        affiliate_links: item.affiliate_links || []
      }))
    } as OutfitFormValues;

    console.log('Transformed outfit data for form:', transformed);
    return transformed;
  }, [outfit]);

  const handleSave = async (data: OutfitFormValues) => {
    try {
      toast({
        title: "Thành công",
        description: "Outfit đã được cập nhật thành công!",
      });

      // Refresh data
      mutate();
      
      // Navigate back to outfits list
      router.push('/dashboard/outfits');
    } catch (error) {
      console.error('Error updating outfit:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật outfit. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Đang tải...">
          <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </PageTitle>
        <div className="space-y-8 mt-5">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error || !outfit) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Lỗi tải outfit">
          <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </PageTitle>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {error ? `Lỗi tải outfit: ${error.message}` : 'Không tìm thấy outfit'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  if (!outfitToEdit) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Không tìm thấy Outfit">
          <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </PageTitle>
        <div className="text-center py-12">
          <p>Không thể tìm thấy trang phục bạn muốn chỉnh sửa.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={`Chỉnh sửa: ${outfitToEdit.title}`}>
        <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </PageTitle>
      
      <OutfitForm 
        onSave={handleSave} 
        initialData={outfitToEdit} 
        mode="edit"
        outfitId={outfitId}
      />
    </div>
  );
}