
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/page-title";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { outfits } from "@/lib/outfits";
import { CATEGORY_MAP, SEASON_MAP } from "@/lib/constants.tsx";


export default function DashboardOutfitsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Quản lý Outfits">
        <Button asChild>
          <Link href="/dashboard/outfits/new">
            <PlusCircle className="mr-2" />
            Thêm Outfit
          </Link>
        </Button>
      </PageTitle>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Mùa</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outfits.map((outfit) => (
            <TableRow key={outfit.id}>
              <TableCell className="font-medium">{outfit.title}</TableCell>
              <TableCell>{outfit.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
              <TableCell>
                <Badge variant="outline">{CATEGORY_MAP[outfit.category]}</Badge>
              </TableCell>
              <TableCell>{SEASON_MAP[outfit.season]}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/outfits/${outfit.id}/edit`}>
                    Chỉnh sửa
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

