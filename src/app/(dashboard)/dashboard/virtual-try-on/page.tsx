'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PageTitle } from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Search, Filter } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Pagination } from "@/components/pagination";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useVirtualTryOns, useDeleteVirtualTryOn } from "@/hooks/use-virtual-try-on";
import { ImageActions } from "@/components/ui/image-actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardVirtualTryOnPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL parameters
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 10;
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';

  // State
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [virtualTryOnToDelete, setVirtualTryOnToDelete] = useState<string | null>(null);

  // Fetch data
  const { virtualTryOns, totalCount, isLoading, error, mutate } = useVirtualTryOns({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    status: statusFilter || undefined,
    search: searchTerm || "",
  });

  const { deleteVirtualTryOn } = useDeleteVirtualTryOn();


  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

  // Handlers
  const handleItemsPerPageChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('per_page', value);
    newSearchParams.set('page', '1');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSearchSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newSearchParams.set('search', searchInput.trim());
    } else {
      newSearchParams.delete('search');
    }
    newSearchParams.set('page', '1');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleStatusFilterChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newSearchParams.set('status', value);
    } else {
      newSearchParams.delete('status');
    }
    newSearchParams.set('page', '1');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleDeleteClick = (id: string) => {
    setVirtualTryOnToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!virtualTryOnToDelete) return;
    
    try {
      setIsDeleting(virtualTryOnToDelete);
      await deleteVirtualTryOn(virtualTryOnToDelete);
      await mutate(); // Refresh data
      setDeleteDialogOpen(false);
      setVirtualTryOnToDelete(null);
    } catch (error) {
      console.error('Error deleting virtual try-on:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVirtualTryOnToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Hoàn thành
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            Thất bại
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
            Đang xử lý
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline">
            Chờ xử lý
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Quản lý Lịch sử Thử đồ" />
        <div className="text-center py-8">
          <p className="text-red-500">Lỗi tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );
  }

  console.log(virtualTryOns);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Lịch sử Thử đồ" />
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên người dùng, tên outfit..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearchSubmit}
          variant="outline"
          className="shrink-0"
        >
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>
        <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Ảnh gốc</TableHead>
              <TableHead className="w-[10%]">Outfit</TableHead>
              <TableHead className="w-[10%]">Kết quả</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[15%]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-16 h-16" /></TableCell>
                  <TableCell><Skeleton className="w-16 h-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : virtualTryOns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có virtual try-on nào'}
                </TableCell>
              </TableRow>
            ) : (
              virtualTryOns.map((vto) => (
                <TableRow key={vto.id}>
                  <TableCell className="p-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image 
                            src={vto.uploaded_image_url || '/placeholder-user.jpg'} 
                            alt={`Ảnh gốc ${vto.id}`} 
                            width={64} 
                            height={64} 
                            className="object-cover w-full h-full" 
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Ảnh gốc</DialogTitle>
                        </DialogHeader>
                        <AspectRatio ratio={9/16}>
                          <Image 
                            src={vto.uploaded_image_url || '/placeholder-user.jpg'} 
                            alt={`Ảnh gốc ${vto.id}`} 
                            fill 
                            className="object-contain rounded-md" 
                          />
                        </AspectRatio>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                
                  <TableCell className="font-medium">
                  <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image 
                            src={vto.outfit_image || '/placeholder-user.jpg'} 
                            alt={`Outfit ${vto.id}`} 
                            width={64} 
                            height={64} 
                            className="object-cover w-full h-full" 
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Outfit</DialogTitle>
                        </DialogHeader>
                        <AspectRatio ratio={9/16}>
                          <Image 
                            src={vto.outfit_image || '/placeholder-user.jpg'} 
                            alt={`Outfit ${vto.id}`} 
                            fill 
                            className="object-contain rounded-md" 
                          />
                        </AspectRatio>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="p-2">
                    {vto.result_image_url ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-16 h-16 rounded-md overflow-hidden border">
                            <Image 
                              src={vto.result_image_url} 
                              alt={`Kết quả ${vto.id}`} 
                              width={64} 
                              height={64} 
                              className="object-cover w-full h-full" 
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Ảnh kết quả</DialogTitle>
                          </DialogHeader>
                          <AspectRatio ratio={9/16}>
                            <Image 
                              src={vto.result_image_url} 
                              alt={`Kết quả ${vto.id}`} 
                              fill 
                              className="object-contain rounded-md" 
                            />
                          </AspectRatio>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="w-16 h-16 rounded-md border flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground">Chưa có</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{vto.full_name || 'Không rõ'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(vto.created_at).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(vto.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {vto.result_image_url && (
                        <ImageActions
                          imageUrl={vto.result_image_url}
                          outfitId={vto.selected_outfit_id}
                          outfitTitle={vto.outfit_title}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8"
                        />
                      )}
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteClick(vto.id)}
                        disabled={isDeleting === vto.id}
                        className="h-8 w-8"
                      >
                        {isDeleting === vto.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>mỗi trang</span>
          <span className="ml-4">
            Tổng: {totalCount || 0} virtual try-on
          </span>
        </div>
        <Pagination 
          totalPages={totalPages}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        title="Xóa Virtual Try-on"
        description="Bạn có chắc chắn muốn xóa virtual try-on này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
