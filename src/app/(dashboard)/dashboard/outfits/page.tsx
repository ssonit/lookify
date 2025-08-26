
'use client';

import Link from "next/link";
import { PlusCircle, Trash2, Edit, Search } from "lucide-react";
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
import { outfits as initialOutfits, type Outfit } from "@/lib/outfits";
import { CATEGORY_MAP, SEASON_MAP } from "@/lib/constants";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";


export default function DashboardOutfitsPage() {
  const [outfits, setOutfits] = React.useState<Outfit[]>(initialOutfits);
  const [outfitToDelete, setOutfitToDelete] = React.useState<Outfit | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('per_page')) || 5;
  const urlSearchTerm = searchParams.get('search') || '';
  const [localSearchTerm, setLocalSearchTerm] = React.useState(urlSearchTerm);


  const filteredOutfits = outfits.filter(outfit => {
    const lowercasedSearchTerm = urlSearchTerm.toLowerCase();
    return (
      outfit.title.toLowerCase().includes(lowercasedSearchTerm) ||
      outfit.description.toLowerCase().includes(lowercasedSearchTerm) ||
      outfit.items.some(item => item.name.toLowerCase().includes(lowercasedSearchTerm))
    );
  });

  const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);
  const paginatedOutfits = filteredOutfits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = () => {
    if (outfitToDelete) {
      const newOutfits = outfits.filter(o => o.id !== outfitToDelete.id);
      setOutfits(newOutfits);
      setOutfitToDelete(null);

      const newTotalPages = Math.ceil(newOutfits.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', (newTotalPages || 1).toString());
        router.push(`${pathname}?${newSearchParams.toString()}`);
      }
    }
  };

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
      <div className="flex gap-2">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Tìm kiếm outfits..."
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
              <TableHead className="w-[64px]">Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead className="w-[15%]">Giới tính</TableHead>
              <TableHead className="w-[15%]">Danh mục</TableHead>
              <TableHead className="w-[15%]">Mùa</TableHead>
              <TableHead className="w-[15%]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOutfits.map((outfit) => (
              <TableRow key={outfit.id}>
                <TableCell className="p-2">
                  <div className="w-16">
                     <AspectRatio ratio={4 / 5}>
                        <Image src={outfit.mainImage} alt={outfit.title} fill className="rounded-md object-cover" />
                    </AspectRatio>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{outfit.title}</TableCell>
                <TableCell>{outfit.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="shrink-0">{CATEGORY_MAP[outfit.category]}</Badge>
                </TableCell>
                <TableCell>{SEASON_MAP[outfit.season]}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/dashboard/outfits/${outfit.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setOutfitToDelete(outfit)}>
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn trang phục
                            <span className="font-bold"> "{outfitToDelete?.title}"</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setOutfitToDelete(null)}>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Tiếp tục</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
