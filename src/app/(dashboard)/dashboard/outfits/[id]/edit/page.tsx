
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PageTitle } from "@/components/page-title";
import { OutfitForm } from "@/components/outfit-form";
import { outfits } from '@/lib/outfits';
import type { OutfitFormValues } from '@/components/outfit-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditOutfitPage() {
  const params = useParams();
  const outfitId = params.id;
  
  const [outfitToEdit, setOutfitToEdit] = useState<OutfitFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an API
    setIsLoading(true);
    const fetchOutfit = () => {
      const foundOutfit = outfits.find(o => o.id.toString() === outfitId);
      if (foundOutfit) {
        // Map the loaded outfit data to match the form's expected structure
        const initialData = {
          ...foundOutfit,
          mainImage: foundOutfit.mainImage,
          items: foundOutfit.items.map(item => ({
              ...item,
              imageUrl: item.imageUrl
          }))
        };
        setOutfitToEdit(initialData);
      }
      setIsLoading(false);
    };

    // Simulate network delay
    const timer = setTimeout(fetchOutfit, 500); 
    return () => clearTimeout(timer);
  }, [outfitId]);


  const handleSave = (data: OutfitFormValues) => {
    // In a real app, you would send this data to an API to update the outfit
    console.log("Updated outfit data:", { ...outfitToEdit, ...data });
    // You might want to navigate back to the outfits list or show a success toast
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-9 w-1/3" />
         <div className="space-y-8 mt-5">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!outfitToEdit) {
    return (
      <div>
        <PageTitle title="Không tìm thấy Outfit" />
        <p>Không thể tìm thấy trang phục bạn muốn chỉnh sửa.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={`Chỉnh sửa: ${outfitToEdit.title}`} />
      <OutfitForm onSave={handleSave} initialData={outfitToEdit} isLoading={isLoading} />
    </div>
  );
}
