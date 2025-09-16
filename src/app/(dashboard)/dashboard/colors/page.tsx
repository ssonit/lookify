
'use client';

import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useColors, useColorMutations } from '@/hooks/use-colors';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ColorFormDialog } from '@/components/color-form-dialog';
import React from 'react';
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
import { Edit, Trash2 } from "lucide-react";

export default function DashboardColorsPage() {
  const { colors, isLoading, error } = useColors();
  const { deleteColor } = useColorMutations();
  const { toast } = useToast();
  const [colorToDelete, setColorToDelete] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (colorToDelete) {
      try {
        await deleteColor(colorToDelete);
        setColorToDelete(null);
        toast({
          title: "Thành công",
          description: "Màu sắc đã được xóa thành công.",
        });
      } catch (error) {
        console.error('Error deleting color:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa màu sắc. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Quản lý Màu sắc">
          <ColorFormDialog />
        </PageTitle>
        <div className="text-center py-12">
          <p className="text-red-500">Lỗi tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Màu sắc">
        <ColorFormDialog />
      </PageTitle>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-30">Xem trước</TableHead>
              <TableHead>Tên màu</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Mã Hex</TableHead>
              <TableHead className="w-32">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
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
              ))
            ) : colors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">Không có màu sắc nào</p>
                </TableCell>
              </TableRow>
            ) : (
              colors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>
                    <div 
                      className="w-10 h-10 rounded-full border" 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                  </TableCell>
                  <TableCell className="font-medium">{color.name}</TableCell>
                  <TableCell>
                    <span className="font-mono bg-muted p-1 rounded-md text-xs">{color.label}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {color.description || 'Không có mô tả'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono bg-muted p-1 rounded-md text-xs">{color.hex}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setColorToDelete(color.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn màu sắc
                              <span className="font-bold"> "{color.name}"</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setColorToDelete(null)}>Hủy</AlertDialogCancel>
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
    </div>
  );
}
