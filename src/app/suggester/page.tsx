
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import OutfitSuggester from "@/components/outfit-suggester";

export default function SuggesterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-16">
                <OutfitSuggester />
            </main>
            <Footer />
        </div>
    );
}
