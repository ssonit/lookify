
'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { outfits, type Outfit } from '@/lib/outfits';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

const FilterSelect = ({ value, onValueChange, placeholder, items }: { value: string, onValueChange: (value: string) => void, placeholder: string, items: { value: string, label: string }[] }) => (
    <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
        </SelectContent>
    </Select>
);

export function OutfitGallery() {
    const searchParams = useSearchParams();
    const [gender, setGender] = useState<'male' | 'female'>('female');
    const [context, setContext] = useState(searchParams.get('context') || 'all');
    const [style, setStyle] = useState(searchParams.get('style') || 'all');
    const [season, setSeason] = useState(searchParams.get('season') || 'all');
    const [color, setColor] = useState(searchParams.get('color') || 'all');
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        setContext(searchParams.get('context') || 'all');
        setStyle(searchParams.get('style') || 'all');
        setSeason(searchParams.get('season') || 'all');
        setColor(searchParams.get('color') || 'all');
    }, [searchParams]);


    const filteredOutfits = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return outfits.filter(o => 
            (o.gender === gender) &&
            (context === 'all' || o.context === context) &&
            (style === 'all' || o.style === style) &&
            (season === 'all' || o.season === season) &&
            (color === 'all' || o.color === color) &&
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
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Tabs value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')} className="w-full md:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="female">Nữ</TabsTrigger>
                            <TabsTrigger value="male">Nam</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="w-full h-px md:w-px md:h-10 bg-border"></div>
                    <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-row gap-4 w-full">
                        <FilterSelect value={context} onValueChange={setContext} placeholder="Bối cảnh" items={[{ value: 'work/office', label: 'Công sở' }, { value: 'casual', label: 'Thường ngày' }, { value: 'party/date', label: 'Tiệc tùng' }, { value: 'sport/active', label: 'Thể thao' }]} />
                        <FilterSelect value={style} onValueChange={setStyle} placeholder="Phong cách" items={[{ value: 'basic', label: 'Cơ bản' }, { value: 'streetwear', label: 'Dạo phố' }, { value: 'elegant', label: 'Thanh lịch' }, { value: 'sporty', label: 'Năng động' }]} />
                        <FilterSelect value={season} onValueChange={setSeason} placeholder="Mùa" items={[{ value: 'spring', label: 'Xuân' }, { value: 'summer', label: 'Hè' }, { value: 'autumn', label: 'Thu' }, { value: 'winter', label: 'Đông' }]} />
                        <FilterSelect value={color} onValueChange={setColor} placeholder="Màu sắc" items={[{ value: 'black', label: 'Đen' }, { value: 'white', label: 'Trắng' }, { value: 'pastel', label: 'Pastel' }, { value: 'earth-tone', label: 'Tone đất' }, { value: 'vibrant', label: 'Rực rỡ' }]} />
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search"
                        placeholder="Tìm kiếm theo từ khóa (ví dụ: 'váy', 'công sở', 'mùa hè')..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
