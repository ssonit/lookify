
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
import { users as initialUsers, type User } from "@/lib/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Shield, Trash } from "lucide-react";
import { Pagination } from "@/components/pagination";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export default function DashboardUsersPage() {
  const users = initialUsers; // In a real app, this would come from state or an API
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 5;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('per_page', value);
    newSearchParams.set('page', '1'); // Reset to first page
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý người dùng" />
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
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' && <Shield className="mr-1 h-3 w-3" />}
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'destructive'}
                    className={user.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                      </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  );
}
