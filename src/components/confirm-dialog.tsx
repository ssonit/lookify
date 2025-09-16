'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock, Unlock } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Hủy',
  variant = 'default',
  icon
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AccountLockConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isLocking: boolean; // true = đang khóa, false = đang mở khóa
}

export function AccountLockConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLocking
}: AccountLockConfirmDialogProps) {
  const action = isLocking ? 'khóa' : 'mở khóa';
  const actionPast = isLocking ? 'đã khóa' : 'đã mở khóa';
  
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`${isLocking ? 'Khóa' : 'Mở khóa'} tài khoản`}
      description={`Bạn có chắc chắn muốn ${action} tài khoản "${userName}"? ${isLocking ? 'Người dùng sẽ không thể đăng nhập sau khi tài khoản bị khóa.' : 'Người dùng sẽ có thể đăng nhập lại sau khi tài khoản được mở khóa.'}`}
      confirmText={isLocking ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
      cancelText="Hủy bỏ"
      variant="destructive"
      icon={isLocking ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
    />
  );
}
