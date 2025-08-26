
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PageTitle } from "@/components/page-title";
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleForm, type ArticleFormValues } from '@/components/article-form';
import { articles } from '@/lib/articles';

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id;
  
  const [articleToEdit, setArticleToEdit] = useState<ArticleFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchArticle = () => {
      const foundArticle = articles.find(o => o.id.toString() === articleId);
      if (foundArticle) {
        setArticleToEdit(foundArticle);
      }
      setIsLoading(false);
    };

    const timer = setTimeout(fetchArticle, 500); 
    return () => clearTimeout(timer);
  }, [articleId]);


  const handleSave = (data: ArticleFormValues) => {
    console.log("Updated article data:", { ...articleToEdit, ...data });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-9 w-1/3" />
         <div className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!articleToEdit) {
    return (
      <div>
        <PageTitle title="Không tìm thấy bài viết" />
        <p>Không thể tìm thấy bài viết bạn muốn chỉnh sửa.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={`Chỉnh sửa: ${articleToEdit.title}`} />
      <ArticleForm onSave={handleSave} initialData={articleToEdit} isLoading={isLoading} />
    </div>
  );
}
