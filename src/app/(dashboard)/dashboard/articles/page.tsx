
'use client';

import Link from "next/link";
import { PlusCircle, Youtube, Trash2, Edit, Search } from "lucide-react";
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
import { Pagination } from "@/components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";


export default function DashboardArticlesPage() {
  const [articles, setArticles] = React.useState<Article[]>(initialArticles);
  const [articleToDelete, setArticleToDelete] = React.useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 5;

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = () => {
    if (articleToDelete) {
      const newArticles = articles.filter(o => o.id !== articleToDelete.id);
      setArticles(newArticles);
      setArticleToDelete(null);

      const newTotalPages = Math.ceil(newArticles.length / itemsPerPage);
      if (currentPage > newTotalPages) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('page', (newTotalPages || 1).toString());
          router.push(`${pathname}?${newSearchParams.toString()}`);
      }
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('per_page', value);
    newSearchParams.set('page', '1'); // Reset to first page
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

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
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
              type="search"
              placeholder="Tìm kiếm bài viết..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]">Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead className="w-[15%]">Nền tảng</TableHead>
              <TableHead className="w-[15%]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="p-2">
                  <Image src={article.imageUrl} alt={article.title} width={64} height={64} className="rounded-md object-cover aspect-square" />
                </TableCell>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                    {article.link.includes('youtube') && <Youtube className="h-5 w-5 text-red-600" />}
                    {article.link.includes('tiktok') && <TiktokIcon className="h-5 w-5" />}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setArticleToDelete(article)}>
                          <Trash2 className="h-4 w-4" />
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
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <span>Hiển thị</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                  </SelectContent>
              </Select>
              <span>mỗi trang</span>
          </div>
          <Pagination 
            totalPages={totalPages}
          />
       </div>
    </div>
  );
}
