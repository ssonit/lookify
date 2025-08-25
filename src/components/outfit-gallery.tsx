
'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { outfits, type Outfit } from '@/lib/outfits';
import { useSearchParams } from 'next/navigation';
import { Search, X, WandSparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from './page-header';
import { GALLERY_FILTERS } from '@/lib/constants.tsx';


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
    const searchParams = useSearchParams();
    const [gender, setGender] = useState<'male' | 'female'>('female');
    const [activeContext, setActiveContext] = useState<string | null>(searchParams.get('context'));
    const [activeStyle, setActiveStyle] = useState<string | null>(searchParams.get('style'));
    const [season, setSeason] = useState<string | null>(searchParams.get('season'));
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        setActiveContext(searchParams.get('context'));
        setActiveStyle(searchParams.get('style'));
        setSeason(searchParams.get('season'));
    }, [searchParams]);

    const resetFilters = () => {
        setActiveContext(null);
        setActiveStyle(null);
        setSeason(null);
        setSearchTerm('');
    };

    const activeFilterCount = [activeContext, activeStyle, season, searchTerm].filter(Boolean).length;

    const filteredOutfits = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return outfits.filter(o => {
            return (
                (o.gender === gender) &&
                (!activeContext || o.context === activeContext) &&
                (!activeStyle || o.style === activeStyle) &&
                (!season || o.season === season) &&
                (searchTerm === '' ||
                 o.title.toLowerCase().includes(lowercasedSearchTerm) ||
                 o.description.toLowerCase().includes(lowercasedSearchTerm) ||
                 o.items.some(item => item.name.toLowerCase().includes(lowercasedSearchTerm)))
            )
        });
    }, [gender, activeContext, activeStyle, season, searchTerm]);

    const allThemes = [...GALLERY_FILTERS.context, ...GALLERY_FILTERS.style];

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={resetFilters} disabled={activeFilterCount === 0}>
                        <X className="mr-1.5" />
                        Xóa lọc ({activeFilterCount})
                    </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-2">
                   {allThemes.map(item => (
                       <FilterButton 
                        key={item.value + item.label} 
                        onClick={() => {
                            if (GALLERY_FILTERS.context.some(c => c.value === item.value && c.label === item.label)) {
                                setActiveContext(prev => prev === item.value ? null : item.value);
                                setActiveStyle(null);
                            } else {
                                setActiveStyle(prev => prev === item.value ? null : item.value)
                                setActiveContext(null);
                            }
                        }} 
                        isSelected={activeContext === item.value || activeStyle === item.value}>
                         {item.label}
                       </FilterButton>
                   ))}
                   <Separator orientation="vertical" className="h-auto mx-2" />
                   {GALLERY_FILTERS.season.map(item => (
                       <FilterButton key={item.value} onClick={() => setSeason(prev => prev === item.value ? null : item.value)} isSelected={season === item.value}>
                         {item.label}
                       </FilterButton>
                   ))}
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Tabs value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')} className="w-full sm:w-auto">
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
