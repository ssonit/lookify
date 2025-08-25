
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ThemedOutfitSection } from "@/components/themed-outfit-section";
import { outfits } from "@/lib/outfits";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  const summerOutfits = outfits.filter(o => o.season === 'summer').slice(0, 4);
  const officeOutfits = outfits.filter(o => o.category === 'work/office').slice(0, 4);
  const elegantOutfits = outfits.filter(o => o.category === 'elegant').slice(0, 4);
  const streetwearOutfits = outfits.filter(o => o.category === 'streetwear').slice(0, 4);
  const schoolOutfits = outfits.filter(o => o.category === 'casual').slice(0,4);
  const dateOutfits = outfits.filter(o => o.category === 'party/date').slice(0,4);
  const beachOutfits = outfits.filter(o => o.season === 'summer' && o.category === 'casual').slice(0,4);
  const gameAnimeOutfits = outfits.filter(o => o.category === 'game-anime').slice(0, 4);


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <div className="container mx-auto px-4 py-8 md:py-16 space-y-12">
           <ThemedOutfitSection title="Phối đồ mùa hè" outfits={summerOutfits} viewAllLink="/gallery?season=summer" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ đi học" outfits={schoolOutfits} viewAllLink="/gallery?category=casual" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ đi hẹn hò" outfits={dateOutfits} viewAllLink="/gallery?category=party/date" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ đi biển" outfits={beachOutfits} viewAllLink="/gallery?season=summer&category=casual" />
           <Separator />
            <ThemedOutfitSection title="Phối đồ Game/Anime" outfits={gameAnimeOutfits} viewAllLink="/gallery?category=game-anime" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ công sở" outfits={officeOutfits} viewAllLink="/gallery?category=work/office" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ thanh lịch" outfits={elegantOutfits} viewAllLink="/gallery?category=elegant" />
           <Separator />
           <ThemedOutfitSection title="Phối đồ dạo phố" outfits={streetwearOutfits} viewAllLink="/gallery?category=streetwear" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

    

    


