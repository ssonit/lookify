
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SewingPinIcon } from "lucide-react";

export default function UpgradePage() {
    const articles = [
        {
            title: "How to Choose Clothes for Your Body Type",
            description: "Understand your body shape and learn how to pick pieces that flatter your figure.",
            link: "#"
        },
        {
            title: "Color Coordination: The Ultimate Guide",
            description: "From basic color theory to advanced palettes, master the art of combining colors in your outfits.",
            link: "#"
        },
        {
            title: "Essential Skincare & Haircare for a Polished Look",
            description: "Good grooming is the foundation of great style. Learn the basics of a solid routine.",
            link: "#"
        },
        {
            title: "Boost Your Confidence Through Communication",
            description: "Learn key skills to help you express yourself clearly and confidently in any situation.",
            link: "#"
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-16">
                <section className="text-center">
                    <h1 className="font-headline text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Upgrade Yourself
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Style is more than just clothes. It's about building confidence from the inside out. Explore our guides to level up your personal style and presence.
                    </p>
                </section>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                    {articles.map(article => (
                        <Card key={article.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{article.title}</CardTitle>
                                <CardDescription>{article.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <a href={article.link} className="text-sm font-semibold text-primary hover:underline">
                                    Read more...
                                </a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
