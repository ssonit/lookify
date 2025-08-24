
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SewingPinIcon } from "lucide-react";

export default function UpgradePage() {
    const articles = [
        {
            title: "Cách chọn trang phục theo dáng người",
            description: "Hiểu dáng người của bạn và học cách chọn những món đồ tôn lên vóc dáng của bạn.",
            link: "#"
        },
        {
            title: "Phối màu: Hướng dẫn cơ bản",
            description: "Từ lý thuyết màu sắc cơ bản đến các bảng màu nâng cao, hãy nắm vững nghệ thuật kết hợp màu sắc trong trang phục của bạn.",
            link: "#"
        },
        {
            title: "Chăm sóc da & tóc cần thiết cho vẻ ngoài chỉn chu",
            description: "Chăm sóc tốt là nền tảng của phong cách tuyệt vời. Tìm hiểu những điều cơ bản của một thói quen vững chắc.",
            link: "#"
        },
        {
            title: "Tăng cường sự tự tin thông qua giao tiếp",
            description: "Học các kỹ năng chính để giúp bạn thể hiện bản thân một cách rõ ràng và tự tin trong mọi tình huống.",
            link: "#"
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-16">
                <section className="text-center">
                    <h1 className="font-headline text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Nâng cấp bản thân
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Phong cách không chỉ là quần áo. Đó là về việc xây dựng sự tự tin từ trong ra ngoài. Khám phá các hướng dẫn của chúng tôi để nâng cao phong cách và sự hiện diện cá nhân của bạn.
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
                                    Đọc thêm...
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
