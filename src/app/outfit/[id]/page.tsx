

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
import { ExternalLink, ShoppingCart, Star, Tag, Camera, Share2, ShoppingBag, Palette, CalendarRange, Sun, Wand2, Info, ListChecks, Link as LinkIcon, Ruler, X, Heart } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { OutfitReview } from '@/components/outfit-review';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';


export default function OutfitDetailPage() {
  const params = useParams();
  const outfitId = params.id;
  const outfit = outfits.find((o) => o.id === Number(outfitId));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLightboxImageLoading, setIsLightboxImageLoading] = useState(false);

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsLightboxImageLoading(true);
  };

  if (!outfit) {
    return (
      <div className="flex flex-col min-h-screen font-body">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-headline font-bold">Không tìm thấy trang phục</h1>
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

  const galleryImages = outfit.items.map(item => item.imageUrl);

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
    'black': { name: 'Đen', hex: '#0f1117' },
    'white': { name: 'Trắng', hex: '#e5e7eb' },
    'pastel': { name: 'Pastel', hex: '#f3d6e4' },
    'earth-tone': { name: 'Tone đất', hex: '#b9a18e' },
    'vibrant': { name: 'Rực rỡ', hex: '#ff4d4d' },
  };

  const imageLabels = ['Layer', 'Fabric', 'Fit', 'Footwear', 'Accessory', 'Bag'];


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
       <main className="w-full container mx-auto px-4 py-8">
         {/* Title & Meta */}
        <section className="mb-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="text-3xl md:text-4xl leading-tight tracking-tight font-bold text-foreground">{outfit.description}</h1>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="icon" onClick={() => setIsFavorited(!isFavorited)}>
                        <Heart className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                        <span className="sr-only">Lưu outfit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="shrink-0"><Share2 className="mr-1.5" /> Chia sẻ</Button>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className='shrink-0'><Palette className="mr-1.5" />{styleMap[outfit.style]}</Badge>
                    <Badge variant="outline" className='shrink-0'><CalendarRange className="mr-1.5" />{contextMap[outfit.context]}</Badge>
                    <Badge variant="outline" className='shrink-0'><Sun className="mr-1.5" />{seasonMap[outfit.season]}</Badge>
                </div>
            </div>
        </section>

         {/* Grid: Gallery + Details */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <Dialog>
                <Card className="overflow-hidden rounded-2xl">
                    <CardContent className="p-0">
                        <DialogTrigger asChild>
                          <button className="relative aspect-[4/3] sm:aspect-[16/10] w-full" onClick={() => openLightbox(outfit.mainImage)}>
                              <Image src={outfit.mainImage} alt={`Outfit chính - ${outfit.description}`} fill className="object-cover"/>
                              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border bg-background/40 backdrop-blur px-2.5 py-1 text-xs text-foreground font-medium">
                                  <Camera /> Góc chính
                              </div>
                          </button>
                        </DialogTrigger>
                        {galleryImages.length > 0 && (
                            <Carousel opts={{ align: "start", loop: true }} className="w-full p-1.5">
                                <CarouselContent className="-ml-1.5">
                                    {galleryImages.map((image, index) => (
                                        <CarouselItem key={index} className="basis-1/3 sm:basis-1/6 pl-1.5">
                                            <DialogTrigger asChild>
                                              <button className="relative w-full" onClick={() => openLightbox(image)}>
                                                  <Image src={image} alt={`Xem chi tiết ${index + 1}`} width={200} height={200} className="h-28 w-full object-cover rounded-xl border" />
                                                  {imageLabels[index] && (
                                                      <div className="absolute bottom-2 left-2 rounded-md bg-black/50 backdrop-blur px-1.5 py-0.5 text-[10px] text-white/80">
                                                          {imageLabels[index]}
                                                      </div>
                                                  )}
                                              </button>
                                            </DialogTrigger>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className='hidden sm:flex' />
                                <CarouselNext className='hidden sm:flex'/>
                            </Carousel>
                        )}
                    </CardContent>
                </Card>
                
                <DialogContent className="max-w-3xl p-0 border-0 bg-transparent">
                    <DialogTitle className="sr-only">Xem ảnh lớn</DialogTitle>
                    <DialogDescription className="sr-only">Ảnh lớn của trang phục</DialogDescription>
                    
                    {isLightboxImageLoading && <Skeleton className="w-[1200px] h-[900px] max-w-full aspect-[4/3] rounded-2xl" />}
                    
                    {selectedImage && (
                        <Image 
                            src={selectedImage} 
                            alt="Xem ảnh lớn" 
                            width={1200} 
                            height={900} 
                            className={`w-full h-auto object-contain rounded-2xl transition-opacity duration-300 ${isLightboxImageLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoadingComplete={() => setIsLightboxImageLoading(false)}
                        />
                    )}
                  <DialogClose />
                </DialogContent>
                

                 {/* Styling notes */}
                <Card className="mt-6 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-headline"><Wand2 />Gợi ý phối & fit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/40"></span>
                                <span>Chọn áo thun oversize (1 size) và overshirt true-to-size để tạo layer gọn.</span>
                            </li>
                             <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/40"></span>
                                <span>Quần cargo ống suông hoặc straight giúp cân đối phần trên rộng.</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
              </Dialog>
            </div>

            {/* Details */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-headline"><Info />Mô tả</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{outfit.longDescription}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border bg-card p-3">
                                <div className="text-xs text-muted-foreground">Phong cách</div>
                                <div className="mt-1 text-sm font-medium">{styleMap[outfit.style]}, {outfit.gender === 'female' ? 'Nữ' : 'Nam'}</div>
                            </div>
                            <div className="rounded-xl border bg-card p-3">
                                <div className="text-xs text-muted-foreground">Màu chủ đạo</div>
                                <div className="mt-1 flex items-center gap-2">
                                     <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: colorMap[outfit.color].hex }}></span>
                                     <span>{colorMap[outfit.color].name}</span>
                                </div>
                            </div>
                             <div className="rounded-xl border bg-card p-3">
                                <div className="text-xs text-muted-foreground">Mùa</div>
                                <div className="mt-1 text-sm font-medium">{seasonMap[outfit.season]}</div>
                            </div>
                            <div className="rounded-xl border bg-card p-3">
                                <div className="text-xs text-muted-foreground">Dịp phù hợp</div>
                                <div className="mt-1 text-sm font-medium">{contextMap[outfit.context]}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 {/* Items list */}
                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                        <CardTitle className="flex items-center gap-2 text-xl font-headline"><ListChecks />Các item trong outfit</CardTitle>
                        <span className="text-xs text-muted-foreground">{outfit.items.length} món</span>
                    </CardHeader>
                    <CardContent className="p-0">
                         <ul className="divide-y">
                            {outfit.items.map((item, index) => (
                                <li key={index} className="p-4">
                                    <div className="flex items-start gap-4">
                                        <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover border" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{item.name}</div>
                                                <span className="text-xs text-muted-foreground">{item.type}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">Mô tả ngắn cho sản phẩm này.</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {item.shoppingLinks.map(link => (
                                                    <Button key={link.store} size="sm" variant="outline" asChild>
                                                        <a href={link.url} target="_blank" rel="noopener">
                                                            <LinkIcon className="mr-1.5" /> {link.store}
                                                        </a>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-headline"><Ruler />Gợi ý size & chăm sóc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                             <div className="rounded-xl border bg-card p-3">
                                <div className="text-xs text-muted-foreground">Chiều cao 1m68–1m75</div>
                                <div className="mt-1 font-medium">Áo thun L · Overshirt M/L · Quần 30–32</div>
                            </div>
                            <div className="rounded-xl border bg-card p-3">
                                <div className="text-xs text-muted-foreground">Chăm sóc</div>
                                <div className="mt-1 font-medium">Giặt nhẹ (30°C), lộn trái, tránh sấy nhiệt cao.</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="flex-1 py-3">
                        <ShoppingBag className="mr-2" /> Mua nhanh trên Shopee
                    </Button>
                    <Button size="lg" variant="secondary" className="flex-1 py-3">
                        <ShoppingBag className="mr-2" /> Mua nhanh trên Lazada
                    </Button>
                </div>
            </div>
        </section>
        
        {/* Reviews Section - moved for mobile layout */}
        <section className="mt-6 lg:mt-8">
            <OutfitReview />
        </section>
      </main>
      <Footer />
    </div>
  );
}
