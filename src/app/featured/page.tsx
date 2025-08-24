
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OutfitGallery } from "@/components/outfit-gallery";

export default function FeaturedPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-16">
                <OutfitGallery />
            </main>
            <Footer />
        </div>
    );
}
