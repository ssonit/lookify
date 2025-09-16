
'use client';

import Link from "next/link";
import { PlusCircle, Trash2, Edit, Search, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useFilteredOutfits, type Outfit } from "@/hooks/use-outfits";
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
import { Pagination } from "@/components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";



export default function DashboardOutfitsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 5;
  const urlSearchTerm = searchParams.get('search') || '';
  const [localSearchTerm, setLocalSearchTerm] = React.useState(urlSearchTerm);

  // Calculate pagination parameters
  const offset = (currentPage - 1) * itemsPerPage;
  
  // Use filtered outfits hook with server-side pagination
  const { outfits, totalCount, isLoading, error, mutate } = useFilteredOutfits({
    search: urlSearchTerm || undefined,
    limit: itemsPerPage,
    offset: offset
  });
  
  const [outfitToDelete, setOutfitToDelete] = React.useState<Outfit | null>(null);

  // Calculate total pages from server count
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Auto-reset to page 1 if current page is greater than total pages
  React.useEffect(() => {
    if (totalCount > 0 && currentPage > totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', '1');
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [totalCount, currentPage, totalPages, searchParams, pathname, router]);

  // Server-side pagination - no need for client-side slicing

  const handleDelete = async () => {
    if (outfitToDelete) {
      try {
        // TODO: Implement delete API call
        // await deleteOutfit(outfitToDelete.id);
        // mutate(); // Refresh the data
        
        // For now, just remove from local state
        mutate();
        setOutfitToDelete(null);

        const newTotalPages = Math.ceil((totalCount - 1) / itemsPerPage);
        if (currentPage > newTotalPages) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('page', (newTotalPages || 1).toString());
          router.push(`${pathname}?${newSearchParams.toString()}`);
        }
      } catch (error) {
        console.error('Error deleting outfit:', error);
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


  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Quản lý Outfits">
          <div className="flex gap-2">
            <Link href="/dashboard/outfits/new">
              <Button>
                <PlusCircle className="mr-2" />
                Thêm Outfit
              </Button>
            </Link>
          </div>
        </PageTitle>
        <div className="flex gap-2">
          <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                  type="search"
                  placeholder="Tìm kiếm outfits..."
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
                <TableHead className="w-[15%]">Giới tính</TableHead>
                <TableHead className="w-[15%]">Danh mục</TableHead>
                <TableHead className="w-[15%]">Mùa</TableHead>
                <TableHead className="w-[15%]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-2">
                    <Skeleton className="w-16 h-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-3/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Quản lý Outfits">
          <div className="flex gap-2">
            <Link href="/dashboard/outfits/new">
              <Button>
                <PlusCircle className="mr-2" />
                Thêm Outfit
              </Button>
            </Link>
          </div>
        </PageTitle>
        <div className="text-center py-12">
          <p className="text-red-500">Lỗi tải dữ liệu: {error.message}</p>
          <Button onClick={() => mutate()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Outfits">
        <div className="flex gap-2">
          <Link href="/dashboard/outfits/new">
            <Button>
              <PlusCircle className="mr-2" />
              Thêm Outfit
            </Button>
          </Link>
        </div>
      </PageTitle>
      <div className="flex gap-2">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Tìm kiếm outfits..."
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
              <TableHead className="w-[15%]">Giới tính</TableHead>
              <TableHead className="w-[15%]">Danh mục</TableHead>
              <TableHead className="w-[15%]">Mùa</TableHead>
              <TableHead className="w-[15%]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
                  <TableBody>
          {outfits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Không tìm thấy outfits nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              outfits.map((outfit) => (
                <TableRow 
                  key={outfit.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/outfits/${outfit.id}`)}
                >
                  <TableCell className="p-2">
                    <div className="w-16">
                       <AspectRatio ratio={4 / 5}>
                          {outfit.image_url ? (
                            <Image 
                              src={outfit.image_url} 
                              alt={outfit.title} 
                              fill 
                              className="rounded-md object-cover" 
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                              <Eye className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                      </AspectRatio>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{outfit.title}</TableCell>
                  <TableCell>{outfit.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {outfit.categories?.map((category) => (
                        <Badge key={typeof category === 'string' ? category : category.name} variant="outline" className="shrink-0 text-xs">
                          {typeof category === 'string' ? category : category.label}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{outfit.season ? (typeof outfit.season === 'string' ? outfit.season : outfit.season.label) : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/outfits/${outfit.id}/edit`}>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOutfitToDelete(outfit);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn trang phục
                              <span className="font-bold"> "{outfitToDelete?.title}"</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setOutfitToDelete(null)}>Hủy</AlertDialogCancel>
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
              {urlSearchTerm && (
                <span className="ml-4">
                  Tìm thấy {totalCount} kết quả cho "{urlSearchTerm}"
                </span>
              )}
          </div>
          <Pagination
            totalPages={totalPages}
          />
             </div>
    </div>
  );
 }
