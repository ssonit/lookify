
'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { outfits, type Outfit } from '@/lib/outfits';
import { useSearchParams } from 'next/navigation';
import { Search, X, Palette, WandSparkles, Calendar, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const FILTERS = {
    context: [
        { value: 'work/office', label: 'Công sở' },
        { value: 'casual', label: 'Thường ngày' },
        { value: 'party/date', label: 'Tiệc tùng' },
        { value: 'sport/active', label: 'Thể thao' },
    ],
    style: [
        { value: 'basic', label: 'Cơ bản' },
        { value: 'streetwear', label: 'Dạo phố' },
        { value: 'elegant', label: 'Thanh lịch' },
        { value: 'sporty', label: 'Năng động' },
    ],
    season: [
        { value: 'spring', label: 'Xuân' },
        { value: 'summer', label: 'Hè' },
        { value: 'autumn', label: 'Thu' },
        { value: 'winter', label: 'Đông' },
    ],
    color: [
        { value: 'black', label: 'Đen' },
        { value: 'white', label: 'Trắng' },
        { value: 'pastel', label: 'Pastel' },
        { value: 'earth-tone', label: 'Tone đất' },
        { value: 'vibrant', label: 'Rực rỡ' },
    ]
};

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
    const [context, setContext] = useState<string | null>(searchParams.get('context'));
    const [style, setStyle] = useState<string | null>(searchParams.get('style'));
    const [season, setSeason] = useState<string | null>(searchParams.get('season'));
    const [color, setColor] = useState<string | null>(searchParams.get('color'));
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        setContext(searchParams.get('context'));
        setStyle(searchParams.get('style'));
        setSeason(searchParams.get('season'));
        setColor(searchParams.get('color'));
    }, [searchParams]);

    const resetFilters = () => {
        setContext(null);
        setStyle(null);
        setSeason(null);
        setColor(null);
        setSearchTerm('');
    };

    const activeFilterCount = [context, style, season, color, searchTerm].filter(Boolean).length;

    const filteredOutfits = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return outfits.filter(o => 
            (o.gender === gender) &&
            (!context || o.context === context) &&
            (!style || o.style === style) &&
            (!season || o.season === season) &&
            (!color || o.color === color) &&
            (searchTerm === '' ||
             o.description.toLowerCase().includes(lowercasedSearchTerm) ||
             o.longDescription.toLowerCase().includes(lowercasedSearchTerm) ||
             o.items.some(item => item.name.toLowerCase().includes(lowercasedSearchTerm)))
    )}, [gender, context, style, season, color, searchTerm]);

    return (
        <section id="gallery">
            <h2 className="text-3xl font-headline font-bold text-center">Thư viện Trang phục</h2>
            <p className="text-muted-foreground text-center mt-2 mb-8 max-w-2xl mx-auto">Duyệt qua bộ sưu tập các phong cách được tuyển chọn của chúng tôi. Sử dụng các bộ lọc để tìm ra vẻ ngoài hoàn hảo cho bất kỳ dịp nào.</p>
            
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Palette />Màu sắc</h3>
                        <div className="flex flex-wrap gap-2">
                           {FILTERS.color.map(item => (
                               <FilterButton key={item.value} onClick={() => setColor(prev => prev === item.value ? null : item.value)} isSelected={color === item.value}>
                                 {item.label}
                               </FilterButton>
                           ))}
                        </div>
                    </div>
                    <div>
                         <h3 className="font-semibold mb-3 flex items-center gap-2"><WandSparkles />Phong cách</h3>
                        <div className="flex flex-wrap gap-2">
                           {FILTERS.style.map(item => (
                               <FilterButton key={item.value} onClick={() => setStyle(prev => prev === item.value ? null : item.value)} isSelected={style === item.value}>
                                 {item.label}
                               </FilterButton>
                           ))}
                        </div>
                    </div>
                     <div>
                         <h3 className="font-semibold mb-3 flex items-center gap-2"><Calendar />Mùa</h3>
                        <div className="flex flex-wrap gap-2">
                           {FILTERS.season.map(item => (
                               <FilterButton key={item.value} onClick={() => setSeason(prev => prev === item.value ? null : item.value)} isSelected={season === item.value}>
                                 {item.label}
                               </FilterButton>
                           ))}
                        </div>
                    </div>
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
                                    <Image src={outfit.mainImage} width={400} height={500} alt={outfit.description} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" data-ai-hint={outfit.aiHint} />
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
