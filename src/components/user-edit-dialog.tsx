'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Shield, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '@/hooks/use-users';

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: {
    full_name?: string;
    avatar_url?: string;
    user_role?: 'admin' | 'user';
    bio?: string;
    website?: string;
    location?: string;
    date_of_birth?: string;
    phone?: string;
    is_verified?: boolean;
    subscription_status?: string;
  }) => Promise<void>;
}

export function UserEditDialog({ user, isOpen, onClose, onSave }: UserEditDialogProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    user_role: 'user' as 'admin' | 'user',
    bio: '',
    website: '',
    location: '',
    date_of_birth: '',
    phone: '',
    is_verified: false,
    subscription_status: 'none',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
        user_role: user.user_role,
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        date_of_birth: user.date_of_birth || '',
        phone: user.phone || '',
        is_verified: user.is_verified,
        subscription_status: user.subscription_status || 'none',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Xử lý dữ liệu trước khi gửi
      const processedData = {
        ...formData,
        // Chuyển đổi subscription_status từ "none" thành undefined
        subscription_status: formData.subscription_status === 'none' ? undefined : formData.subscription_status,
        // Xử lý date_of_birth - nếu rỗng thì set undefined
        date_of_birth: formData.date_of_birth || undefined,
        // Xử lý các field khác có thể rỗng
        bio: formData.bio || undefined,
        website: formData.website || undefined,
        location: formData.location || undefined,
        phone: formData.phone || undefined,
        avatar_url: formData.avatar_url || undefined,
      };

      console.log('Sending user data:', processedData);
      await onSave(user.id, processedData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'subscription_status' && value === 'none' ? '' : value
    }));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Chỉnh sửa thông tin người dùng
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết cho {user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Thông tin cơ bản</h3>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL ảnh đại diện</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Ngày sinh</Label>
              <DateInput
                id="date_of_birth"
                value={formData.date_of_birth}
                onChange={(value) => handleInputChange('date_of_birth', value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Thông tin bổ sung</h3>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Địa chỉ</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Thành phố, quốc gia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription_status">Trạng thái gói</Label>
              <Select
                value={formData.subscription_status}
                onValueChange={(value) => handleInputChange('subscription_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái gói" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có gói</SelectItem>
                  <SelectItem value="free">Miễn phí</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Tiểu sử</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Giới thiệu về bản thân"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Quyền và trạng thái */}
        <div className="space-y-4 py-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground">Quyền và trạng thái</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={formData.user_role}
                  onValueChange={(value: 'admin' | 'user') => handleInputChange('user_role', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        User
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái xác thực</Label>
              <div className="flex items-center gap-2 md:h-[40px]">
                <Switch
                  checked={formData.is_verified}
                  onCheckedChange={(checked) => handleInputChange('is_verified', checked)}
                />
                <div className="flex items-center gap-2">
                  {formData.is_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm">
                    {formData.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
