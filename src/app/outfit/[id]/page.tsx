
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
import { ExternalLink, ShoppingCart, Star, Tag, Camera } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const StarRating = ({ totalStars = 5 }) => {
    const [rating, setRating] = React.useState(0);
    const [hover, setHover] = React.useState(0);
    return (
        <div className="flex items-center gap-1">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                        className="focus:outline-none"
                    >
                        <Star
                            className={`h-6 w-6 transition-colors ${
                                starValue <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};


export default function OutfitDetailPage() {
  const params = useParams();
  const outfitId = params.id;
  const outfit = outfits.find((o) => o.id === Number(outfitId));

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
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          <div className="md:col-span-3">
             <Carousel className="w-full">
              <CarouselContent>
                {outfit.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative w-full overflow-hidden rounded-lg group">
                      <Image
                        src={src}
                        alt={`${outfit.description} - view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                       {outfit.imageSourceUrl && (
                        <a href={outfit.imageSourceUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Camera size={12}/>
                          <span>{outfit.imageSourceText}</span>
                          <ExternalLink size={12}/>
                        </a>
                      )}
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
            
            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <Tag />
                    Các món trong trang phục
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {outfit.items.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={item.name}>
                        <AccordionTrigger>
                          <div className="flex justify-between items-center w-full">
                            <span>{item.name}</span>
                            <span className="text-xs text-foreground/50 mr-4">{item.type}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {item.shoppingLinks.length > 0 ? (
                            <div className="flex flex-col gap-2 pl-4">
                              <p className="text-sm font-semibold mb-1">Gợi ý mua sắm:</p>
                              {item.shoppingLinks.map(link => (
                                <Button key={link.store} variant="outline" size="sm" asChild className="justify-between group">
                                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <span className="font-semibold">{link.store}</span>
                                    <ExternalLink className="group-hover:translate-x-1 transition-transform" />
                                  </a>
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <p className="pl-4 text-sm text-muted-foreground">Không có gợi ý mua sắm cho món đồ này.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-headline font-bold mb-4">Đánh giá & Nhận xét</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Viết đánh giá của bạn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium mb-2">Đánh giá của bạn</p>
                            <StarRating />
                        </div>
                         <div>
                            <p className="font-medium mb-2">Nhận xét của bạn</p>
                            <Textarea placeholder="Trang phục này có tuyệt vời không? Nó có phù hợp với bạn không?" />
                        </div>
                        <Button className="w-full">Gửi đánh giá</Button>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <h3 className="font-semibold">Đánh giá gần đây</h3>
                     <Card>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            </div>
                            <p className="text-sm text-muted-foreground">"Trang phục này thực sự tuyệt vời! Rất thanh lịch và phù hợp cho văn phòng. Tôi đã nhận được rất nhiều lời khen."</p>
                            <p className="text-xs text-right text-muted-foreground">- Jane Doe</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <Star className="h-5 w-5 text-gray-300" />
                            </div>
                            <p className="text-sm text-muted-foreground">"Một bộ trang phục đẹp. Vải thoải mái và vừa vặn. Tuy nhiên, màu sắc hơi khác so với trong ảnh."</p>
                            <p className="text-xs text-right text-muted-foreground">- John Smith</p>
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

    