
'use client';

import type { Outfit } from "@/lib/outfits";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

interface ThemedOutfitSectionProps {
    title: string;
    outfits: Outfit[];
    viewAllLink: string;
}

export function ThemedOutfitSection({ title, outfits, viewAllLink }: ThemedOutfitSectionProps) {
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-headline font-bold">{title}</h2>
                <Button asChild variant="outline">
                    <Link href={viewAllLink}>Xem tất cả</Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                 {outfits.map(outfit => (
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
        </section>
    )
}
