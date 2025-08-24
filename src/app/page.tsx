"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OutfitGallery } from "@/components/outfit-gallery";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 bg-card border-b">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Style Ascent
        </h1>
        <p className="mt-4 font-headline text-2xl md:text-4xl font-medium text-foreground">
          Nâng cấp phong cách – Nâng cấp chính mình
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Khám phá các gợi ý trang phục được cá nhân hóa và khám phá các phong cách tuyển chọn để nâng tầm tủ quần áo và sự tự tin của bạn.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/suggester">Khám phá ngay</Link>
        </Button>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Separator className="my-8 md:my-12" />
          <OutfitGallery />
        </div>
      </main>
      <Footer />
    </div>
  );
}
