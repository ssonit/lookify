
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Heart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { outfits } from "@/lib/outfits";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const UserProfile = {
    name: 'An Trần',
    email: 'an.tran@example.com',
    avatar: 'https://placehold.co/128x128.png',
    joinDate: '2023-10-26',
};

const savedOutfits = outfits.slice(0, 4);

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = searchParams.get('tab') || 'saved';

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };


    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                <section className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8 mb-10">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20">
                            <AvatarImage src={UserProfile.avatar} alt={UserProfile.name} />
                            <AvatarFallback>{UserProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold font-headline">{UserProfile.name}</h1>
                            <p className="text-muted-foreground mt-1">{UserProfile.email}</p>
                            <p className="text-sm text-muted-foreground mt-2">Tham gia từ {new Date(UserProfile.joinDate).toLocaleDateString('vi-VN')}</p>
                            <div className="mt-4 flex justify-center md:justify-start gap-2">
                                <Button variant="outline"><User className="mr-2" />Chỉnh sửa hồ sơ</Button>
                                <Button variant="ghost" size="icon"><LogOut /></Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-full">
                            <TabsTrigger value="saved"><Heart className="mr-2"/>Outfit đã lưu</TabsTrigger>
                            <TabsTrigger value="settings"><Settings className="mr-2"/>Cài đặt</TabsTrigger>
                        </TabsList>
                        <TabsContent value="saved" className="mt-6">
                             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {savedOutfits.map(outfit => (
                                    <Link key={outfit.id} href={`/outfit/${outfit.id}`} passHref>
                                        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full rounded-2xl">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-[4/5] overflow-hidden">
                                                    <Image src={outfit.mainImage} width={400} height={500} alt={outfit.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" data-ai-hint={outfit.aiHint} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                            {savedOutfits.length === 0 && (
                                <div className="text-center col-span-full py-16 border-2 border-dashed rounded-2xl">
                                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">Chưa có outfit nào được lưu</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      Hãy bắt đầu khám phá và lưu lại những phong cách bạn yêu thích!
                                    </p>
                                    <Button asChild className="mt-4">
                                      <Link href="/gallery">Khám phá ngay</Link>
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="settings" className="mt-6">
                          <ProfileSettingsForm />
                        </TabsContent>
                    </Tabs>
                </section>
            </main>
            <Footer />
        </div>
    );
}
