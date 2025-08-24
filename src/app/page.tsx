
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemedOutfitSection } from "@/components/themed-outfit-section";
import { outfits } from "@/lib/outfits";

const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-card border-b">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Style Ascent
        </h1>
        <p className="mt-4 font-headline text-2xl md:text-4xl font-medium text-foreground">
          Nâng cấp phong cách – Nâng cấp chính mình
        </p>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-body text-muted-foreground">
          Khám phá các gợi ý trang phục được cá nhân hóa và khám phá các phong cách tuyển chọn để nâng tầm tủ quần áo và sự tự tin của bạn.
        </p>
        <Button size="lg" className="mt-8 text-body" asChild>
          <Link href="/suggester">Khám phá ngay</Link>
        </Button>
      </div>
    </section>
  );
};

export default function Home() {
  const summerOutfits = outfits.filter(o => o.season === 'summer').slice(0, 4);
  const officeOutfits = outfits.filter(o => o.context === 'work/office').slice(0, 4);
  const elegantOutfits = outfits.filter(o => o.style === 'elegant').slice(0, 4);
  const streetwearOutfits = outfits.filter(o => o.style === 'streetwear').slice(0, 4);
  const schoolOutfits = outfits.filter(o => o.context === 'casual' && (o.style === 'basic' || o.style === 'streetwear')).slice(0,4);
  const dateOutfits = outfits.filter(o => o.context === 'party/date').slice(0,4);
  const beachOutfits = outfits.filter(o => o.season === 'summer' && o.context === 'casual').slice(0,4);


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <div className="container mx-auto px-4 py-8 md:py-16 space-y-12">
           <Separator />
           <ThemedOutfitSection title="Phối đồ mùa hè" outfits={summerOutfits} viewAllLink="/gallery?season=summer" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ đi học" outfits={schoolOutfits} viewAllLink="/gallery?context=casual" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ đi hẹn hò" outfits={dateOutfits} viewAllLink="/gallery?context=party/date" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ đi biển" outfits={beachOutfits} viewAllLink="/gallery?season=summer&context=casual" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ công sở" outfits={officeOutfits} viewAllLink="/gallery?context=work/office" />
           <Separator />
           <ThemedOutfitSection title="Phong cách thanh lịch" outfits={elegantOutfits} viewAllLink="/gallery?style=elegant" />
           <Separator />
           <ThemedOutfitSection title="Phong cách dạo phố" outfits={streetwearOutfits} viewAllLink="/gallery?style=streetwear" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
