
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { outfits } from '@/lib/outfits';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ShoppingCart, Tag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from 'next/link';

export default function OutfitDetailPage() {
  const params = useParams();
  const outfitId = params.id;
  const outfit = outfits.find((o) => o.id === Number(outfitId));

  if (!outfit) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Không tìm thấy trang phục</h1>
            <p className="text-muted-foreground mt-2">
              Rất tiếc, chúng tôi không thể tìm thấy trang phục bạn đang tìm kiếm.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const contextMap = {
    'work/office': 'Công sở',
    'casual': 'Thường ngày',
    'party/date': 'Tiệc tùng',
    'sport/active': 'Thể thao',
  }

  const styleMap = {
    'basic': 'Cơ bản',
    'streetwear': 'Dạo phố',
    'elegant': 'Thanh lịch',
    'sporty': 'Năng động',
  }

  const seasonMap = {
    'spring': 'Xuân',
    'summer': 'Hè',
    'autumn': 'Thu',
    'winter': 'Đông',
  }

  const colorMap = {
    'black': 'Đen',
    'white': 'Trắng',
    'pastel': 'Pastel',
    'earth-tone': 'Tone đất',
    'vibrant': 'Rực rỡ',
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          <div className="md:col-span-3">
             <Carousel className="w-full">
              <CarouselContent>
                {outfit.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative w-full overflow-hidden rounded-lg">
                      <Image
                        src={src}
                        alt={`${outfit.description} - view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {outfit.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          </div>
          <div className="md:col-span-2">
            <h1 className="font-headline text-3xl md:text-4xl font-bold">{outfit.description}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="capitalize">{outfit.gender === 'female' ? 'Nữ' : 'Nam'}</Badge>
              <Badge variant="secondary" className="capitalize">{contextMap[outfit.context]}</Badge>
              <Badge variant="secondary" className="capitalize">{styleMap[outfit.style]}</Badge>
              <Badge variant="secondary" className="capitalize">{seasonMap[outfit.season]}</Badge>
              <Badge variant="secondary" className="capitalize">{colorMap[outfit.color]}</Badge>
            </div>
            <Separator className="my-6" />
            <p className="text-muted-foreground">{outfit.longDescription}</p>
            
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <Tag />
                    Các món trong trang phục
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    {outfit.items.map((item) => (
                      <li key={item.name} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-xs text-foreground/50">{item.type}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <ShoppingCart />
                    Mua sắm
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {outfit.shoppingLinks.map((link) => (
                    <Button key={link.store} variant="outline" asChild className="justify-between">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.store}
                        <ExternalLink />
                      </a>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
