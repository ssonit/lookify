
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ThemedOutfitSection } from "@/components/themed-outfit-section";
import { HeroSection } from "@/components/hero-section";
import { useOutfitsByCategory, useOutfitsBySeason } from "@/hooks/use-outfits";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { outfits: summerOutfits, isLoading: summerLoading } = useOutfitsBySeason({ season: 'summer' });
  const { outfits: officeOutfits, isLoading: officeLoading } = useOutfitsByCategory({ category: 'work/office' });
  const { outfits: elegantOutfits, isLoading: elegantLoading } = useOutfitsByCategory({ category: 'elegant' });
  const { outfits: streetwearOutfits, isLoading: streetwearLoading } = useOutfitsByCategory({ category: 'streetwear' });
  const { outfits: schoolOutfits, isLoading: schoolLoading } = useOutfitsByCategory({ category: 'casual' });
  const { outfits: dateOutfits, isLoading: dateLoading } = useOutfitsByCategory({ category: 'party/date' });
  const { outfits: beachOutfits, isLoading: beachLoading } = useOutfitsByCategory({ category: 'beach' });
  const { outfits: tetOutfits, isLoading: tetLoading } = useOutfitsByCategory({ category: 'tet' });
  const { outfits: gameAnimeOutfits, isLoading: gameAnimeLoading } = useOutfitsByCategory({ category: 'game/anime' });

  const isLoading = summerLoading || officeLoading || elegantLoading || streetwearLoading || 
                   schoolLoading || dateLoading || beachLoading || tetLoading || gameAnimeLoading;


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background font-body">
        <Header />
        <main className="flex-1 w-full">
          <HeroSection />
          <div className="container mx-auto px-4 py-8 md:py-16 space-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-64 w-full" />
                  ))}
                </div>
                {i < 5 && <Separator />}
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <div className="container mx-auto px-4 py-8 md:py-16 space-y-12">
           {summerOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ mùa hè" outfits={summerOutfits} viewAllLink="/gallery?season=summer" />
            <Separator />
           </>)}
           {schoolOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ đi học" outfits={schoolOutfits} viewAllLink="/gallery?category=casual" />
            <Separator />
           </>)}
           {dateOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ đi hẹn hò" outfits={dateOutfits} viewAllLink="/gallery?category=party/date" />
            <Separator />
           </>)}
           {beachOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ đi biển" outfits={beachOutfits} viewAllLink="/gallery?category=beach" />
            <Separator />
           </>)}
           {tetOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ Tết" outfits={tetOutfits} viewAllLink="/gallery?category=tet" />
            <Separator />
           </>)}
           {gameAnimeOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ Game/Anime" outfits={gameAnimeOutfits} viewAllLink="/gallery?category=game/anime" />
            <Separator />
           </>)}
           {officeOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ công sở" outfits={officeOutfits} viewAllLink="/gallery?category=work/office" />
            <Separator />
           </>)}
           {elegantOutfits.length > 0 && (<>
            <ThemedOutfitSection title="Phối đồ thanh lịch" outfits={elegantOutfits} viewAllLink="/gallery?category=elegant" />
            <Separator />
           </>)}
           {streetwearOutfits.length > 0 && <ThemedOutfitSection title="Phối đồ dạo phố" outfits={streetwearOutfits} viewAllLink="/gallery?category=streetwear" />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

    

    







