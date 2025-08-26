
'use client';

import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";
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
import { outfits as initialOutfits, type Outfit } from "@/lib/outfits";
import { CATEGORY_MAP, SEASON_MAP } from "@/lib/constants";
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

const ITEMS_PER_PAGE = 5;

export default function DashboardOutfitsPage() {
  const [outfits, setOutfits] = React.useState<Outfit[]>(initialOutfits);
  const [outfitToDelete, setOutfitToDelete] = React.useState<Outfit | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(outfits.length / ITEMS_PER_PAGE);
  const paginatedOutfits = outfits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = () => {
    if (outfitToDelete) {
      const newOutfits = outfits.filter(o => o.id !== outfitToDelete.id);
      setOutfits(newOutfits);
      setOutfitToDelete(null);

      // Reset to page 1 if the last item on the last page is deleted
      if (paginatedOutfits.length === 1 && currentPage > 1 && currentPage === totalPages) {
         setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Outfits">
        <Button asChild>
          <Link href="/dashboard/outfits/new">
            <PlusCircle className="mr-2" />
            Thêm Outfit
          </Link>
        </Button>
      </PageTitle>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Mùa</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOutfits.map((outfit) => (
              <TableRow key={outfit.id}>
                <TableCell className="font-medium">{outfit.title}</TableCell>
                <TableCell>{outfit.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="shrink-0">{CATEGORY_MAP[outfit.category]}</Badge>
                </TableCell>
                <TableCell>{SEASON_MAP[outfit.season]}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/outfits/${outfit.id}/edit`}>
                        Chỉnh sửa
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setOutfitToDelete(outfit)}>
                          Xóa
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
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
