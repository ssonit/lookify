
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from "@/components/page-title";
import { ArticleForm } from "@/components/article-form";
import { useArticleMutations } from '@/hooks/use-article-mutations';
import { useToast } from '@/hooks/use-toast';
import type { ArticleFormValues } from '@/components/article-form';

export default function NewArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createArticle } = useArticleMutations();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (data: ArticleFormValues) => {
    setIsLoading(true);
    try {
      await createArticle({
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        tags: data.tags,
        level: data.level,
        cta: data.cta,
        link: data.link,
        platform: data.platform,
        seo_title: data.seoTitle,
        seo_description: data.seoDescription
      });

      toast({
        title: "Thành công",
        description: "Bài viết đã được tạo thành công!",
      });

      router.push('/dashboard/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Thêm bài viết mới" backHref="/dashboard/articles" />
      <ArticleForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
}
