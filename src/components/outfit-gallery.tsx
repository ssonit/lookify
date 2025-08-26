
'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { outfits, type Outfit } from '@/lib/outfits';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from './page-header';
import { GALLERY_FILTERS } from '@/lib/constants';


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
    variant={isSelected ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    className={`transition-all duration-200 ${isSelected ? 'shadow-md' : 'shadow-sm'}`}
  >
    {children}
  </Button>
);

export function OutfitGallery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // States are now derived from URL search params
    const activeGender = (searchParams.get('gender') as 'male' | 'female') || 'female';
    const activeCategory = searchParams.get('category');
    const activeSeason = searchParams.get('season');
    const urlSearchTerm = searchParams.get('search') || '';
    
    const [localSearchTerm, setLocalSearchTerm] = useState(urlSearchTerm);
    
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
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

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

    const handleGenderChange = (gender: 'male' | 'female') => {
        updateSearchParams('gender', gender);
    };

    const resetFilters = () => {
        router.push(pathname);
    };

    const activeFilterCount = [activeCategory, activeSeason, urlSearchTerm, searchParams.get('gender') ? 1 : 0].filter(Boolean).length;
    // Adjust filter count logic to not count default gender
    const displayFilterCount = [activeCategory, activeSeason, urlSearchTerm, searchParams.get('gender') && searchParams.get('gender') !== 'female' ? 1: 0].filter(Boolean).length;


    const filteredOutfits = useMemo(() => {
        const lowercasedSearchTerm = urlSearchTerm.toLowerCase();
        return outfits.filter(o => {
            return (
                (o.gender === activeGender) &&
                (!activeCategory || o.categories.includes(activeCategory as any)) &&
                (!activeSeason || o.season === activeSeason) &&
                (urlSearchTerm === '' ||
                 o.title.toLowerCase().includes(lowercasedSearchTerm) ||
                 o.description.toLowerCase().includes(lowercasedSearchTerm) ||
                 o.items.some(item => item.name.toLowerCase().includes(lowercasedSearchTerm)))
            )
        });
    }, [activeGender, activeCategory, activeSeason, urlSearchTerm]);

    const allCategories = [...GALLERY_FILTERS.category];

    return (
        <section id="gallery">
            <PageHeader
                title="Thư viện trang phục"
                description="Duyệt qua bộ sưu tập các phong cách được tuyển chọn của chúng tôi. Sử dụng các bộ lọc để tìm ra vẻ ngoài hoàn hảo cho bất kỳ dịp nào."
                className="mb-8"
            />
            
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
                   {allCategories.map(item => (
                       <FilterButton 
                        key={item.value + item.label} 
                        onClick={() => handleToggleCategory(item.value)}
                        isSelected={activeCategory === item.value}>
                         {item.label}
                       </FilterButton>
                   ))}
                   <Separator orientation="vertical" className="h-auto mx-2" />
                   {GALLERY_FILTERS.season.map(item => (
                       <FilterButton key={item.value} onClick={() => handleToggleSeason(item.value)} isSelected={activeSeason === item.value}>
                         {item.label}
                       </FilterButton>
                   ))}
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Tabs value={activeGender} onValueChange={(value) => handleGenderChange(value as 'male' | 'female')} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="female">Nữ</TabsTrigger>
                            <TabsTrigger value="male">Nam</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="text-sm text-muted-foreground font-medium">{filteredOutfits.length} kết quả</div>
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOutfits.map(outfit => (
                    <Link key={outfit.id} href={`/outfit/${outfit.id}`} passHref>
                        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full rounded-2xl">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image src={outfit.mainImage} width={400} height={500} alt={outfit.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" data-ai-hint={outfit.aiHint} />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
             {filteredOutfits.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-lg font-medium">Không có trang phục nào phù hợp với tiêu chí của bạn.</p>
                    <p className="text-muted-foreground">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để tìm thêm phong cách.</p>
                </div>
            )}
        </section>
    )
}
