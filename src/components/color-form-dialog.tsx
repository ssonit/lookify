"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useColorMutations } from "@/hooks/use-colors";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

interface ColorFormData {
  name: string;
  description: string;
  label: string;
  hex: string;
}

export function ColorFormDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ColorFormData>({
    name: "",
    description: "",
    label: "",
    hex: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createColor } = useColorMutations();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.label.trim() || !formData.hex.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc (Tên màu, Label, Mã Hex).",
        variant: "destructive",
      });
      return;
    }

    // Validate hex color format
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(formData.hex)) {
      toast({
        title: "Lỗi",
        description: "Mã hex không hợp lệ. Ví dụ: #FF0000 hoặc #F00",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createColor({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        label: formData.label.trim(),
        hex: formData.hex.trim().toUpperCase(),
      });
      
      toast({
        title: "Thành công",
        description: "Màu sắc đã được thêm thành công.",
      });
      
      // Reset form and close dialog
      setFormData({ name: "", description: "", label: "", hex: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error creating color:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm màu sắc. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ColorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Thêm màu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm màu sắc mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin màu sắc mới. Mã hex sẽ được tự động chuyển thành chữ hoa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên màu *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Red, Green, Blue..."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Label *
              </Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => handleInputChange("label", e.target.value)}
                className="col-span-3"
                placeholder="Đỏ, Xanh lá, Vàng..."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
                placeholder="Mô tả về màu sắc (tùy chọn)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hex" className="text-right">
                Mã Hex *
              </Label>
              <Input
                id="hex"
                value={formData.hex}
                onChange={(e) => handleInputChange("hex", e.target.value)}
                className="col-span-3"
                placeholder="#FF0000 hoặc #F00"
                required
              />
            </div>
            {formData.hex && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Xem trước</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: formData.hex }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {formData.hex.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang thêm..." : "Thêm màu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
