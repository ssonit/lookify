
'use client';

import { useParams } from 'next/navigation';
import { PageTitle } from "@/components/page-title";
import { OutfitForm } from "@/components/outfit-form";
import { outfits } from '@/lib/outfits';
import { OutfitFormValues } from '@/components/outfit-form';

export default function EditOutfitPage() {
  const params = useParams();
  const outfitId = params.id;

  // In a real app, you would fetch this data from an API
  const outfitToEdit = outfits.find(o => o.id.toString() === outfitId);

  const handleSave = (data: OutfitFormValues) => {
    // In a real app, you would send this data to an API to update the outfit
    console.log("Updated outfit data:", { ...outfitToEdit, ...data });
    // You might want to navigate back to the outfits list or show a success toast
  };

  if (!outfitToEdit) {
    return (
      <div>
        <PageTitle title="Không tìm thấy Outfit" />
        <p>Không thể tìm thấy trang phục bạn muốn chỉnh sửa.</p>
      </div>
    )
  }

  // Map the loaded outfit data to match the form's expected structure
  const initialData = {
    ...outfitToEdit,
    mainImage: outfitToEdit.mainImage, // Assuming this is a URL string
    items: outfitToEdit.items.map(item => ({
        ...item,
        imageUrl: item.imageUrl // Assuming this is a URL string
    }))
  };


  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={`Chỉnh sửa: ${outfitToEdit.title}`} />
      <OutfitForm onSave={handleSave} initialData={initialData} />
    </div>
  );
}
