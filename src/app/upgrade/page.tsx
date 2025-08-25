
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function UpgradePage() {
    const courses = [
        {
            title: "Cách chọn trang phục theo dáng người",
            description: "Phân loại cơ bản (V, A, H) và công thức chọn áo/quần tôn dáng.",
            imageUrl: "https://images.unsplash.com/photo-1551028487-5c7a40c6ab63?w=800&q=80",
            tags: ["Bài viết", "Video 12:30"],
            level: "Starter",
            cta: "Xem",
            link: "#"
        },
        {
            title: "Phối màu cơ bản & nâng cao",
            description: "Bánh xe màu, 60-30-10, tương phản/đồng sắc, tông da.",
            imageUrl: "https://images.unsplash.com/photo-1593693397640-03208c02d740?w=800&q=80",
            tags: ["Mini-course • 6 bài", "Bài viết"],
            level: "~45 phút",
            cta: "Bắt đầu",
            link: "#"
        },
        {
            title: "Chăm sóc da & tóc",
            description: "Routine tối giản theo loại da, mẹo chọn sản phẩm giá hợp lý.",
            imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
            tags: ["Bài viết", "Routine 7 bước"],
            level: "Everyday",
            cta: "Xem",
            link: "#"
        },
        {
            title: "Phát triển kỹ năng giao tiếp & tự tin",
            description: "Ngôn ngữ cơ thể, giọng nói, mô hình trả lời & luyện tập.",
            imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
            tags: ["Video course • 8 bài"],
            level: "Beginner-Intermediate",
            cta: "Học ngay",
            link: "#"
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-16">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Nâng cấp bản thân</h1>
                        <p className="text-muted-foreground mt-2">Có thể làm dạng blog hoặc video</p>
                    </div>
                    <Button variant="outline" className="bg-foreground/5 hover:bg-foreground/10 border-foreground/20">
                        <PlusCircle className="mr-2" /> Mới
                    </Button>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <Link key={index} href={course.link} passHref>
                            <Card className="bg-card border-border/50 rounded-2xl overflow-hidden group h-full flex flex-col hover:border-foreground/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                                <div className="relative">
                                    <Image src={course.imageUrl} alt={course.title} width={400} height={250} className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300" data-ai-hint="abstract texture" />
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {course.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-black/40 text-white backdrop-blur-sm border-white/20 text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <CardContent className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg font-headline flex-grow">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4 flex-grow">{course.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/20">
                                        <p className="text-xs text-muted-foreground">{course.level}</p>
                                        <Button variant="secondary" size="sm" className="bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg">
                                            {course.cta}
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
