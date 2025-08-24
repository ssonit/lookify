
'use client';
import { useState, useMemo } from 'react';
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
import { outfits, type Outfit } from '@/lib/outfits';

const FilterSelect = ({ value, onValueChange, placeholder, items }: { value: string, onValueChange: (value: string) => void, placeholder: string, items: { value: string, label: string }[] }) => (
    <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
        </SelectContent>
    </Select>
);

export function OutfitGallery() {
    const [gender, setGender] = useState<'male' | 'female'>('female');
    const [context, setContext] = useState('all');
    const [style, setStyle] = useState('all');
    const [season, setSeason] = useState('all');
    const [color, setColor] = useState('all');

    const filteredOutfits = useMemo(() => outfits.filter(o => 
        (o.gender === gender) &&
        (context === 'all' || o.context === context) &&
        (style === 'all' || o.style === style) &&
        (season === 'all' || o.season === season) &&
        (color === 'all' || o.color === color)
    ), [gender, context, style, season, color]);

    return (
        <section id="gallery">
            <h2 className="text-3xl font-headline font-bold text-center">Outfit Library</h2>
            <p className="text-muted-foreground text-center mt-2 mb-8 max-w-2xl mx-auto">Browse our curated collection of styles. Use the filters to find the perfect look for any occasion.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card rounded-lg shadow-sm border items-center">
                <Tabs value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="female">Nữ</TabsTrigger>
                        <TabsTrigger value="male">Nam</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="w-full h-px md:w-px md:h-10 bg-border"></div>
                <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-row gap-4 w-full">
                    <FilterSelect value={context} onValueChange={setContext} placeholder="Context" items={[{ value: 'work/office', label: 'Work' }, { value: 'casual', label: 'Casual' }, { value: 'party/date', label: 'Party' }, { value: 'sport/active', label: 'Sport' }]} />
                    <FilterSelect value={style} onValueChange={setStyle} placeholder="Style" items={[{ value: 'basic', label: 'Basic' }, { value: 'streetwear', label: 'Streetwear' }, { value: 'elegant', label: 'Elegant' }, { value: 'sporty', label: 'Sporty' }]} />
                    <FilterSelect value={season} onValueChange={setSeason} placeholder="Season" items={[{ value: 'spring', label: 'Spring' }, { value: 'summer', label: 'Summer' }, { value: 'autumn', label: 'Autumn' }, { value: 'winter', label: 'Winter' }]} />
                    <FilterSelect value={color} onValueChange={setColor} placeholder="Color" items={[{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }, { value: 'pastel', label: 'Pastel' }, { value: 'earth-tone', label: 'Earth Tone' }, { value: 'vibrant', label: 'Vibrant' }]} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOutfits.map(outfit => (
                    <Link key={outfit.id} href={`/outfit/${outfit.id}`} passHref>
                        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image src={outfit.images[0]} width={400} height={500} alt={outfit.description} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" data-ai-hint={outfit.aiHint} />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
             {filteredOutfits.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-lg font-medium">No outfits match your criteria.</p>
                    <p className="text-muted-foreground">Try adjusting your filters to find more styles.</p>
                </div>
            )}
        </section>
    )
}
