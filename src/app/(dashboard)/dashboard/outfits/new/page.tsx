
'use client';

import { PageTitle } from "@/components/page-title";
import { OutfitForm } from "@/components/outfit-form";

export default function NewOutfitPage() {
  const handleSave = (data: any) => {
    // Tạm thời log dữ liệu ra console để kiểm tra cấu trúc
    console.log("Outfit data:", data);
    // Sau này sẽ thêm logic gọi API để lưu vào DB
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Thêm Outfit mới" backHref="/dashboard/outfits" />
      <OutfitForm onSave={handleSave} />
    </div>
  );
}
