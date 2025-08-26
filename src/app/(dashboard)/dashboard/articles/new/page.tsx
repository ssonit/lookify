
'use client';

import { PageTitle } from "@/components/page-title";
import { ArticleForm } from "@/components/article-form";

export default function NewArticlePage() {
  const handleSave = (data: any) => {
    console.log("New article data:", data);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Thêm bài viết mới" backHref="/dashboard/articles" />
      <ArticleForm onSave={handleSave} />
    </div>
  );
}
