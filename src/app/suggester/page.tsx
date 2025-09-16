
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
// import OutfitSuggester from "@/components/outfit-suggester";

export default function SuggesterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-semibold">Tính năng gợi ý AI tạm ẩn</h1>
                    <p className="text-muted-foreground mt-2">
                        Chúng tôi đang hoàn thiện trải nghiệm. Vui lòng quay lại sau.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
