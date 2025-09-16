
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { OutfitCard } from "@/components/outfit-card";
import { Outfit } from "@/types/outfit";

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
                    <OutfitCard outfit={outfit} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        </section>
    )
}
