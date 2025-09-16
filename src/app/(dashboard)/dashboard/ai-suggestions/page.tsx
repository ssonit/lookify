'use client';

import { PageHeader } from '@/components/page-header';

export default function AISuggestionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản lý gợi ý AI"
        description="Tính năng tạm ẩn. Chúng tôi đang hoàn thiện trải nghiệm."
        className="mb-8"
      />

      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold">Trang quản lý gợi ý AI tạm thời không hiển thị</h2>
        <p className="text-muted-foreground mt-2">Vui lòng quay lại sau.</p>
      </div>
    </div>
  );
}
