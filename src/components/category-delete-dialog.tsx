'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CategoryDeleteDialogProps {
  category: {
    id: string
    name: string
    label: string
  } | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function CategoryDeleteDialog({
  category,
  isOpen,
  onClose,
  onConfirm
}: CategoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    if (!category) return

    try {
      setIsDeleting(true)
      await onConfirm(category.id)
      
      toast({
        title: "Xóa danh mục thành công",
        description: `Danh mục "${category.label}" đã được xóa.`,
      })
      
      onClose()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Lỗi xóa danh mục",
        description: "Không thể xóa danh mục. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Xác nhận xóa danh mục
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa danh mục <strong>"{category.label}"</strong> không?
            <br />
            <br />
            <span className="text-destructive font-medium">
              Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn danh mục này.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa danh mục'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
