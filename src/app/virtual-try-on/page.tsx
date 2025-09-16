import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VirtualTryOnForm } from "@/components/virtual-try-on-form";

export default function VirtualTryOnPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                <VirtualTryOnForm />
            </main>
            <Footer />
        </div>
    );
}
