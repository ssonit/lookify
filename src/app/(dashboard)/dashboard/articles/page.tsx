
'use client';

import Link from "next/link";
import { PlusCircle, Youtube, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/page-title";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { articles as initialArticles, type Article } from "@/lib/articles";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { TiktokIcon } from "@/components/icons";


export default function DashboardArticlesPage() {
  const [articles, setArticles] = React.useState<Article[]>(initialArticles);
  const [articleToDelete, setArticleToDelete] = React.useState<Article | null>(null);

  const handleDelete = () => {
    if (articleToDelete) {
      setArticles(articles.filter(o => o.id !== articleToDelete.id));
      setArticleToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Bài viết">
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <PlusCircle className="mr-2" />
            Thêm bài viết
          </Link>
        </Button>
      </PageTitle>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Ảnh</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Nền tảng</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <Image src={article.imageUrl} alt={article.title} width={64} height={64} className="rounded-md object-cover" />
              </TableCell>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>
                  {article.link.includes('youtube') && <Youtube className="h-5 w-5 text-red-600" />}
                  {article.link.includes('tiktok') && <TiktokIcon className="h-5 w-5" />}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      Chỉnh sửa
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive" size="sm" onClick={() => setArticleToDelete(article)}>
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn bài viết
                          <span className="font-bold"> "{articleToDelete?.title}"</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setArticleToDelete(null)}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Tiếp tục</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
