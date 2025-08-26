
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
import { Edit, Trash } from "lucide-react";
import { Pagination } from "@/components/pagination";
import React from "react";

const ITEMS_PER_PAGE = 5;

export default function DashboardUsersPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const users = initialUsers; // In a real app, this would come from state or an API

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý người dùng" />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
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
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
