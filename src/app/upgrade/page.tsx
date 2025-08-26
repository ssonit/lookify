

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
import { articles } from "@/lib/articles";

export default function UpgradePage() {

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
