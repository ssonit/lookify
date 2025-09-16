
'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from './page-header';
import { useFilteredOutfits } from '@/hooks/use-outfits';
import { OutfitCard } from '@/components/outfit-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/pagination';
import { useCategories } from '@/hooks/use-categories';
import { useSeasons } from '@/hooks/use-seasons';
import { cn } from '@/lib/utils';


const FilterButton = ({
  onClick,
  isSelected,
  children,
}: {
  onClick: () => void;
  isSelected: boolean;
  children: React.ReactNode;
}) => (
  <Button
    variant={"outline"}
    size="sm"
    onClick={onClick}
    className={cn("transition-all duration-200", isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground")}
  >
    {children}
  </Button>
);

export function OutfitGallery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // States are now derived from URL search params
    const activeGender = (searchParams.get('gender') as 'all' | 'male' | 'female') || 'all';
    const activeCategory = searchParams.get('category');
    const activeSeason = searchParams.get('season');
    const urlSearchTerm = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');
    
    const [localSearchTerm, setLocalSearchTerm] = useState(urlSearchTerm);

    const itemsPerPage = 24;
    const offset = (currentPage - 1) * itemsPerPage;

    // Use API hook with filters
    const { outfits: filteredOutfits, isLoading, error, totalCount } = useFilteredOutfits({
        gender:  activeGender === 'all' ? undefined : activeGender,
        category: activeCategory || undefined,
        season: activeSeason || undefined,
        search: urlSearchTerm || undefined,
        limit: itemsPerPage,
        offset: offset
    });

    console.log(filteredOutfits);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Get categories and seasons from database
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { seasons, isLoading: seasonsLoading } = useSeasons();
    
    // Sync local search input with URL search term
    useEffect(() => {
        setLocalSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);
    
    const updateSearchParams = (key: string, value: string | null) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key);
        }
        // Reset to page 1 when filters change
        if (key !== 'page') {
            newSearchParams.delete('page');
        }
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    const handlePageChange = (page: number) => {
        updateSearchParams('page', page.toString());
    };

    const handleSearch = () => {
        updateSearchParams('search', localSearchTerm || null);
    };
    
    const handleToggleCategory = (category: string) => {
        const newCategory = activeCategory === category ? null : category;
        updateSearchParams('category', newCategory);
    };

    const handleToggleSeason = (season: string) => {
        const newSeason = activeSeason === season ? null : season;
        updateSearchParams('season', newSeason);
    };

    const handleGenderChange = (gender: 'all' | 'male' | 'female') => {
        updateSearchParams('gender', gender);
    };

    const resetFilters = () => {
        router.push(pathname);
    };

    // const activeFilterCount = [activeCategory, activeSeason, urlSearchTerm, searchParams.get('gender') ? 1 : 0].filter(Boolean).length;
    // Adjust filter count logic to not count default gender
    const displayFilterCount = [activeCategory, activeSeason, urlSearchTerm, searchParams.get('gender') && searchParams.get('gender') !== 'female' ? 1: 0].filter(Boolean).length;

    return (
        <section id="gallery">
            <PageHeader
                title="Thư viện trang phục"
                description="Duyệt qua bộ sưu tập các phong cách được tuyển chọn của chúng tôi. Sử dụng các bộ lọc để tìm ra vẻ ngoài hoàn hảo cho bất kỳ dịp nào."
                className="mb-8"
            />
            
         <div>
         <div className="flex flex-col gap-4 mb-8 p-4 bg-card rounded-2xl shadow-sm border">
                 <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="search"
                            placeholder="Tìm theo tên outfit, phong cách, màu sắc..."
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
                    <Button variant="outline" onClick={resetFilters} disabled={displayFilterCount === 0}>
                        <X className="mr-1.5" />
                        Xóa lọc ({displayFilterCount})
                    </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-2">
                    {categoriesLoading ? (
                     <div className="flex gap-2">
                       {Array.from({ length: 4 }).map((_, i) => (
                         <Skeleton key={i} className="h-8 w-20" />
                       ))}
                     </div>
                   ) : (
                     categories.map(category => (
                       <FilterButton 
                         key={category.id} 
                         onClick={() => handleToggleCategory(category.name)}
                         isSelected={activeCategory === category.name}>
                         {category.label}
                       </FilterButton>
                     ))
                   )}
                  <Separator orientation="vertical" className="h-auto mx-2" />
                    {seasonsLoading ? (
                     <div className="flex gap-2">
                       {Array.from({ length: 4 }).map((_, i) => (
                         <Skeleton key={i} className="h-8 w-16" />
                       ))}
                     </div>
                   ) : (
                     seasons.map(season => (
                       <FilterButton 
                         key={season.id} 
                         onClick={() => handleToggleSeason(season.name)} 
                         isSelected={activeSeason === season.name}>
                         {season.label}
                       </FilterButton>
                     ))
                   )}
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Tabs value={activeGender} onValueChange={(value) => handleGenderChange(value as 'all' | 'male' | 'female')} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">Tất cả</TabsTrigger>
                            <TabsTrigger value="female">Nữ</TabsTrigger>
                            <TabsTrigger value="male">Nam</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="text-sm text-muted-foreground font-medium">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang tải...
                            </div>
                        ) : (
                            `${totalCount} kết quả`
                        )}
                    </div>
                </div>

            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center col-span-full py-16">
                    <p className="text-lg font-medium text-red-500">Lỗi tải dữ liệu</p>
                    <p className="text-muted-foreground">Không thể tải danh sách outfit. Vui lòng thử lại sau.</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Thử lại
                    </Button>
                </div>
            ) : filteredOutfits.length === 0 ? (
                <div className="text-center col-span-full py-16">
                    <p className="text-lg font-medium">Không có trang phục nào phù hợp với tiêu chí của bạn.</p>
                    <p className="text-muted-foreground">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để tìm thêm phong cách.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredOutfits.map(outfit => (
                        <OutfitCard key={outfit.id} outfit={outfit} />
                    ))}
                </div>
            )}
         </div>

            {/* Pagination */}
            {!isLoading && !error && filteredOutfits.length > 0 && totalPages > 1 && (
                <div className="mt-12">
                    <Pagination
                        totalPages={totalPages}
                    />
                </div>
            )}
        </section>
    )
}
