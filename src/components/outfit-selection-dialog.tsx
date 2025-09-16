'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, XCircle } from 'lucide-react';
import { useFilteredOutfits } from '@/hooks/use-outfits';
import { useCategories } from '@/hooks/use-categories';
import { useSeasons } from '@/hooks/use-seasons';
import type { Outfit } from '@/types/outfit';

interface OutfitSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (outfit: Outfit) => void;
  selectedOutfitId?: string;
}

export function OutfitSelectionDialog({
  isOpen,
  onClose,
  onSelect,
  selectedOutfitId
}: OutfitSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  
  // Search state for API calls
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data with server-side filtering
  const { outfits: filteredOutfits, totalCount, isLoading: outfitsLoading, error: outfitsError } = useFilteredOutfits({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    season: selectedSeason || undefined,
    gender: selectedGender || undefined,
    limit: 100 // Load more items for selection dialog
  });
  
  const { categories } = useCategories();
  const { seasons } = useSeasons();

  // Load initial data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleOutfitSelect = (outfit: Outfit) => {
    onSelect(outfit);
    onClose();
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSeason(null);
    setSelectedGender(null);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedSeason,
    selectedGender
  ].filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] min-h-[400px] sm:min-h-[600px] overflow-hidden flex flex-col">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold">Chọn một trang phục</DialogTitle>
          <p className="text-muted-foreground">
            Duyệt qua thư viện và nhấp vào một trang phục để chọn nó.
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 sm:space-y-6">
          {/* Search and Filter Card */}
          <Card className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="search"
                    placeholder="Tìm theo tên outfit, phong cách, màu sắc..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                  />
                </div>
                <Button onClick={handleSearchSubmit}>Tìm kiếm</Button>
                <Button variant="outline" onClick={clearFilters} disabled={activeFiltersCount === 0}>
                  <X className="mr-1.5" />
                  Xóa lọc ({activeFiltersCount})
                </Button>
              </div>

              {/* Filter Options */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Category Select */}
                <div className="flex-1 min-w-0 sm:min-w-[200px]">
                  <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Season Select */}
                <div className="flex-1 min-w-0 sm:min-w-[200px]">
                  <Select value={selectedSeason || "all"} onValueChange={(value) => setSelectedSeason(value === "all" ? null : value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn mùa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả mùa</SelectItem>
                      {seasons?.map((season) => (
                        <SelectItem key={season.id} value={season.name}>
                          {season.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Select */}
                <div className="flex-1 min-w-0 sm:min-w-[200px]">
                  <Select value={selectedGender || "all"} onValueChange={(value) => setSelectedGender(value === "all" ? null : value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả giới tính</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="male">Nam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex justify-end">
                <div className="text-sm text-muted-foreground font-medium">
                  {totalCount} kết quả
                </div>
              </div>
            </div>
          </Card>


          {/* Outfit Grid */}
          <div className="h-[378px]">
            <ScrollArea className="h-full overflow-y-auto">
              {outfitsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : outfitsError ? (
                <div className="text-center py-8">
                  <p className="text-destructive">Lỗi tải dữ liệu: {outfitsError.message}</p>
                </div>
              ) : totalCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery || activeFiltersCount > 0 
                      ? 'Không tìm thấy outfit phù hợp' 
                      : 'Chưa có outfit nào'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4">
                  {filteredOutfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className={`cursor-pointer transition-all hover:shadow-lg group relative aspect-square rounded-lg overflow-hidden ${
                        selectedOutfitId === outfit.id
                          ? 'ring-2 ring-primary shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleOutfitSelect(outfit)}
                    >
                      <Image
                        src={outfit.image_url || '/placeholder-outfit.jpg'}
                        alt={outfit.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {selectedOutfitId === outfit.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                            Đã chọn
                          </div>
                        </div>
                      )}
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs">
                          Chọn
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
