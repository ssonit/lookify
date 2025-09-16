"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryMutations } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit } from "lucide-react";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().optional(),
  label: z.string().min(1, "Label là bắt buộc"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryEditDialogProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    label: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryEditDialog({ category, open, onOpenChange }: CategoryEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateCategory } = useCategoryMutations();
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      label: "",
    },
  });

  // Update form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        label: category.label,
      });
    }
  }, [category, form]);

  const onSubmit = async (data: CategoryFormData) => {
    if (!category) return;

    setIsSubmitting(true);
    
    try {
      await updateCategory(category.id, {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        label: data.label.trim(),
      });
      
      toast({
        title: "Thành công",
        description: "Danh mục đã được cập nhật thành công.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh mục. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin danh mục. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Party, Date, Casual..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Tiệc tùng, Hẹn hò, Thường ngày..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về danh mục (tùy chọn)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
