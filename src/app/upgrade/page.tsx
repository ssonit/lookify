
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, Youtube } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TiktokIcon } from "@/components/icons";

export default function UpgradePage() {
    const articles = [
        {
            title: "Cách chọn trang phục theo dáng người",
            description: "Phân loại cơ bản (V, A, H) và công thức chọn áo/quần tôn dáng.",
            imageUrl: "https://images.unsplash.com/photo-1551028487-5c7a40c6ab63?w=800&q=80",
            tags: ["Video", "12:30"],
            level: "Starter",
            cta: "Xem trên Youtube",
            link: "https://www.youtube.com/"
        },
        {
            title: "Phối màu cơ bản & nâng cao",
            description: "Bánh xe màu, 60-30-10, tương phản/đồng sắc, tông da.",
            imageUrl: "https://images.unsplash.com/photo-1593693397640-03208c02d740?w=800&q=80",
            tags: ["Hướng dẫn video", "Bài viết"],
            level: "~45 phút",
            cta: "Xem trên Youtube",
            link: "https://www.youtube.com/"
        },
        {
            title: "Chăm sóc da & tóc",
            description: "Routine tối giản theo loại da, mẹo chọn sản phẩm giá hợp lý.",
            imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
            tags: ["Bài viết", "Routine 7 bước"],
            level: "Everyday",
            cta: "Xem trên Tiktok",
            link: "https://www.tiktok.com/"
        },
        {
            title: "Kỹ năng giao tiếp & tự tin",
            description: "Ngôn ngữ cơ thể, giọng nói, mô hình trả lời & luyện tập.",
            imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
            tags: ["Hướng dẫn video"],
            level: "Beginner-Intermediate",
            cta: "Xem trên Tiktok",
            link: "https://www.tiktok.com/"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-16">
                <PageHeader 
                    title="Nâng cấp bản thân"
                    description="Khám phá các video và bài viết hướng dẫn để hoàn thiện phong cách và kỹ năng mỗi ngày."
                />
                
                <div className="text-center mb-10">
                    <Button variant="outline" className="mt-4">
                        <PlusCircle className="mr-2" /> Đề xuất chủ đề mới
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.map((article, index) => (
                        <Link key={index} href={article.link} passHref>
                            <Card className="bg-card rounded-2xl overflow-hidden group h-full flex flex-col hover:shadow-lg transition-all duration-300">
                                <div className="relative">
                                    <Image src={article.imageUrl} alt={article.title} width={400} height={250} className="object-cover w-full h-48" data-ai-hint="abstract texture" />
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {article.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs backdrop-blur-sm bg-background/70">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <CardContent className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg font-headline flex-grow">{article.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4 flex-grow">{article.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-2 border-t">
                                        <p className="text-xs text-muted-foreground">{article.level}</p>
                                        <Button variant="secondary" size="sm" className="rounded-lg">
                                            {article.link.includes('youtube') && <Youtube className="mr-1.5" />}
                                            {article.link.includes('tiktok') && <TiktokIcon className="mr-1.5 h-4 w-4" />}
                                            {article.cta}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
