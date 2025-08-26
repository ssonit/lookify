
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PageTitle } from "@/components/page-title";
import { users } from "@/lib/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export default function DashboardUsersPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý người dùng" />
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
          {users.map((user) => (
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
  );
}
