
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
import { Edit, Shield, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useFilteredUsers } from "@/hooks/use-users";
import { useUserMutations } from "@/hooks/use-user-mutations";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { UserEditDialog } from "@/components/user-edit-dialog";
import type { User } from "@/hooks/use-users";



export default function DashboardUsersPage() {
  const { updateUser } = useUserMutations();
  const { toast } = useToast();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Dialog state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 5;
  const urlSearchTerm = searchParams.get('search') || '';
  const [localSearchTerm, setLocalSearchTerm] = React.useState(urlSearchTerm);

  // Server-side filtering and pagination
  const { users, totalCount, isLoading, error } = useFilteredUsers({
    search: urlSearchTerm || undefined,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('per_page', value);
    newSearchParams.set('page', '1'); // Reset to first page
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (localSearchTerm) {
      newSearchParams.set('search', localSearchTerm);
    } else {
      newSearchParams.delete('search');
    }
    newSearchParams.set('page', '1'); // Reset to first page on search
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  React.useEffect(() => {
    setLocalSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);



  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  const handleSaveUser = async (userId: string, updates: any) => {
    try {
      console.log('Updating user with data:', { userId, updates });
      const result = await updateUser(userId, updates);
      console.log('Update result:', result);
      
      toast({
        title: "Thành công",
        description: "Thông tin người dùng đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật thông tin người dùng.';
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
      throw error; // Re-throw để dialog có thể xử lý
    }
  };


  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Quản lý người dùng" />
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Lỗi tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý người dùng" />
        <div className="flex gap-2">
          <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                  type="search"
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-10 w-full"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                          handleSearch();
                      }
                  }}
              />
          </div>
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]">Avatar</TableHead>
              <TableHead className="w-[20%]">Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[10%]">Vai trò</TableHead>
              <TableHead className="w-[15%]">Ngày tạo</TableHead>
              <TableHead className="w-[15%]">Trạng thái</TableHead>
              <TableHead className="w-[10%]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                      <AvatarFallback>
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.full_name || 'Chưa cập nhật'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.user_role === 'admin' ? 'default' : 'secondary'}>
                      {user.user_role === 'admin' && <Shield className="mr-1 h-3 w-3" />}
                      {user.user_role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.is_verified ? 'default' : 'destructive'}
                      className={user.is_verified ? 'bg-green-500' : ''}
                    >
                      {user.is_verified ? 'Đã mở' : 'Bị khóa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditUser(user)}
                      title="Chỉnh sửa thông tin người dùng"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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
                  </SelectContent>
              </Select>
              <span>mỗi trang</span>
          </div>
          <Pagination 
            totalPages={totalPages}
          />
       </div>

      {/* Edit User Dialog */}
      <UserEditDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
      />

    </div>
  );
}
