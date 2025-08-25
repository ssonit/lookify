
'use client';

import type { Outfit } from "@/lib/outfits";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

interface ThemedOutfitSectionProps {
    title: string;
    outfits: Outfit[];
    viewAllLink: string;
}

export function ThemedOutfitSection({ title, outfits, viewAllLink }: ThemedOutfitSectionProps) {
    if (!outfits || outfits.length === 0) {
        return null;
    }
    
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-headline font-bold">{title}</h2>
                <Button asChild variant="outline">
                    <Link href={viewAllLink}>Xem tất cả</Link>
                </Button>
            </div>
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {outfits.map(outfit => (
                  <CarouselItem key={outfit.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                    <Link href={`/outfit/${outfit.id}`} passHref>
                        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full rounded-2xl">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image src={outfit.mainImage} width={400} height={500} alt={outfit.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" data-ai-hint={outfit.aiHint} />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        </section>
    )
}

    