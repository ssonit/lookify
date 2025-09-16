
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PageTitle } from "@/components/page-title";
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleForm, type ArticleFormValues } from '@/components/article-form';
import { useArticle } from '@/hooks/use-articles';
import { useArticleMutations } from '@/hooks/use-article-mutations';
import { useToast } from '@/hooks/use-toast';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { updateArticle } = useArticleMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const articleId = params.id as string;
  const { article, isLoading, error } = useArticle(articleId);

  const handleSave = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Form data to update:', data);
      console.log('Article ID:', articleId);
      
      // Update link based on platform if it's a placeholder or needs to be updated
      let updatedLink = data.link;
      
      // If the link is a placeholder or doesn't match the selected platform, update it
      if (data.platform === 'youtube' && !data.link.includes('youtube.com')) {
        // Keep the existing link if it's already a valid URL, otherwise use a placeholder
        if (data.link && data.link.startsWith('http')) {
          updatedLink = data.link; // Keep existing link
        } else {
          updatedLink = 'https://www.youtube.com/watch?v=...'; // Placeholder
        }
      } else if (data.platform === 'tiktok' && !data.link.includes('tiktok.com')) {
        // Keep the existing link if it's already a valid URL, otherwise use a placeholder
        if (data.link && data.link.startsWith('http')) {
          updatedLink = data.link; // Keep existing link
        } else {
          updatedLink = 'https://www.tiktok.com/@.../video/...'; // Placeholder
        }
      }
      
      const updateData = {
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        tags: data.tags,
        level: data.level,
        cta: data.cta,
        link: updatedLink,
        platform: data.platform,
        seo_title: data.seoTitle,
        seo_description: data.seoDescription
      };
      
      console.log('Update data:', updateData);
      console.log('Platform selected:', data.platform);
      console.log('Updated link:', updatedLink);
      
      const result = await updateArticle(articleId, updateData);
      console.log('Update result:', result);

      toast({
        title: "Thành công",
        description: "Bài viết đã được cập nhật thành công!",
      });

      // Refresh the page to ensure data is updated
      router.refresh();
      router.push('/dashboard/articles');
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Đang tải..." backHref="/dashboard/articles" />
        <div className="space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Lỗi" backHref="/dashboard/articles" />
        <p className="text-red-500">Có lỗi xảy ra khi tải bài viết: {error.message}</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Không tìm thấy bài viết" backHref="/dashboard/articles" />
        <p>Không thể tìm thấy bài viết bạn muốn chỉnh sửa.</p>
      </div>
    )
  }

  // Transform article data to form format
  const articleToEdit: ArticleFormValues = {
    title: article.title,
    description: article.description,
    imageUrl: article.image_url,
    tags: article.tags,
    level: article.level,
    cta: article.cta,
    link: article.link,
    platform: article.platform,
    seoTitle: article.seo_title ?? '',
    seoDescription: article.seo_description ?? ''
  };

  console.log('Article data loaded:', article);
  console.log('Article platform from DB:', article.platform);
  console.log('Transformed form data:', articleToEdit);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={`Chỉnh sửa: ${article.title}`} backHref="/dashboard/articles" />
      <ArticleForm 
        onSave={handleSave} 
        initialData={articleToEdit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}
