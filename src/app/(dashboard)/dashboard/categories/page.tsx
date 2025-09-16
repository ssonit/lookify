
'use client';

import { useState } from 'react';
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useCategoryMutations } from "@/hooks/use-categories";
import { CategoryFormDialog } from "@/components/category-form-dialog";
import { CategoryEditDialog } from "@/components/category-edit-dialog";
import { CategoryDeleteDialog } from "@/components/category-delete-dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

export default function DashboardCategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const { createCategory, deleteCategory } = useCategoryMutations();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string | null;
    label: string;
  } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    name: string;
    label: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateCategory = async (data: { name: string; label: string; description: string }) => {
    try {
      await createCategory(data);
      toast({
        title: "Thành công",
        description: "Danh mục đã được tạo thành công.",
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo danh mục.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteCategory = (category: {
    id: string;
    name: string;
    label: string;
  }) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const handleEditCategory = (category: {
    id: string;
    name: string;
    description: string | null;
    label: string;
  }) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Quản lý Danh mục">
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Thêm danh mục
          </Button>
        </PageTitle>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Có lỗi xảy ra khi tải danh sách danh mục: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Danh mục">
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          Thêm danh mục
        </Button>
      </PageTitle>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Giá trị (Value)</TableHead>
              <TableHead className="w-32">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description || 'Không có mô tả'}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono bg-muted p-1 rounded-md text-xs">{category.label}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Chỉnh sửa danh mục"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteCategory(category)}
                        title="Xóa danh mục"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleCreateCategory}
      />

      {/* Category Edit Dialog */}
      <CategoryEditDialog
        category={editingCategory}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Category Delete Dialog */}
      <CategoryDeleteDialog
        category={deletingCategory}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
