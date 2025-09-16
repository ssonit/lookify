'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; label: string; description: string }) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryFormDialog({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}: CategoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên danh mục.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.label.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nhãn hiển thị.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      setFormData({ name: '', label: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', label: '', description: '' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Tạo danh mục mới để phân loại outfits.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ví dụ: casual, work/office, party/date"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Nhãn hiển thị *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              placeholder="Ví dụ: Thường ngày, Công sở, Tiệc / Hẹn hò"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả ngắn về danh mục này..."
              className="resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting || !formData.name.trim() || !formData.label.trim()}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo danh mục'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
