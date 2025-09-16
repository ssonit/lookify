
'use client';

import Link from "next/link";
import { PlusCircle, YoutubeIcon, Trash2, Edit, Search } from "lucide-react";
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
import { useFilteredArticles } from "@/hooks/use-articles";
import { useArticleMutations } from "@/hooks/use-article-mutations";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@/hooks/use-articles";
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
  const [articleToDelete, setArticleToDelete] = React.useState<Article | null>(null);
  const { deleteArticle } = useArticleMutations();
  const { toast } = useToast();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 5;
  const urlSearchTerm = searchParams.get('search') || '';
  const [localSearchTerm, setLocalSearchTerm] = React.useState(urlSearchTerm);

  // Server-side filtering and pagination
  const { articles, totalCount, isLoading, error } = useFilteredArticles({
    search: urlSearchTerm || undefined,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleDelete = async () => {
    if (articleToDelete) {
      try {
        await deleteArticle(articleToDelete.id);
        setArticleToDelete(null);
        
        toast({
          title: "Thành công",
          description: "Bài viết đã được xóa thành công!",
        });

        // Refresh data after delete
        router.refresh();
      } catch (error) {
        console.error('Error deleting article:', error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('per_page', value);
    newSearchParams.set('page', '1'); // Reset to first page
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (localSearchTerm) {
      newSearchParams.set('search', localSearchTerm);
    } else {
      newSearchParams.delete('search');
    }
    newSearchParams.set('page', '1'); // Reset to first page on search
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  React.useEffect(() => {
    setLocalSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  if (error) {
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
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Lỗi tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );
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
      <div className="flex gap-2">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Tìm kiếm bài viết..."
                className="pl-10 w-full"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
        </div>
        <Button onClick={handleSearch}>Tìm kiếm</Button>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-8 w-8 bg-gray-200 rounded animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy bài viết nào
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="p-2">
                  <Image src={article.image_url} alt={article.title} width={64} height={64} className="rounded-md object-cover aspect-square" />
                </TableCell>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                    {article.platform === 'youtube' && <YoutubeIcon className="h-5 w-5 text-red-600" />}
                    {article.platform === 'tiktok' && <TiktokIcon className="h-5 w-5" />}
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
              ))
            )}
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
