
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Heart, User, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SettingsNotificationForm } from "@/components/settings-notification-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserSavedOutfits } from "@/hooks/use-user-saved-outfits";
import { useVirtualTryOns } from "@/hooks/use-virtual-try-on";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { profile, isLoading, error, currentUser } = useUserProfile();
    const activeTab = searchParams.get('tab') || 'saved';
    
    const { savedOutfits, isLoading: savedOutfitsLoading, error: savedOutfitsError } = useUserSavedOutfits({
        enabled: activeTab === 'saved'
    });
    const { virtualTryOns, isLoading: virtualTryOnsLoading, error: virtualTryOnsError } = useVirtualTryOns({
        user_id: currentUser?.id,
        limit: 20,
        enabled: activeTab === 'virtual-try-on'
    });

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };


    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background font-body">
                <Header />
                <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Đang tải thông tin hồ sơ...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-background font-body">
                <Header />
                <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
                            <p className="text-muted-foreground mb-4">Không thể tải thông tin hồ sơ</p>
                            <Button onClick={() => window.location.reload()}>
                                Thử lại
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // No profile data
    if (!profile) {
        return (
            <div className="flex flex-col min-h-screen bg-background font-body">
                <Header />
                <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Không tìm thấy hồ sơ</h2>
                            <p className="text-muted-foreground mb-4">Hồ sơ của bạn chưa được tạo</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }


    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-1 w-full container mx-auto px-4 py-8 md:py-12">
                <section className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8 mb-10">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20">
                            <AvatarImage 
                                src={profile.avatar_url || 'https://placehold.co/128x128.png'} 
                                alt={profile.full_name || currentUser?.email || 'User'} 
                                data-ai-hint="user avatar"
                            />
                            <AvatarFallback>
                                {(profile.full_name || currentUser?.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold font-headline">
                                {profile.full_name || currentUser?.email || 'Người dùng'}
                            </h1>
                            <p className="text-muted-foreground mt-1">{profile.email || currentUser?.email}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Tham gia từ {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                            </p>
                            {profile.bio && (
                                <p className="text-sm text-muted-foreground mt-3 italic">{profile.bio}</p>
                            )}
                            <div className="mt-4 flex justify-center md:justify-start gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <User className="mr-2" />Cập nhật thông tin
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] p-0">
                                        <DialogHeader className="p-6 pb-0">
                                            <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                                            <DialogDescription>
                                            Thực hiện các thay đổi cho hồ sơ của bạn ở đây. Nhấp vào lưu khi bạn hoàn tất.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-[70vh] w-full">
                                            <div className="p-6">
                                                <ProfileSettingsForm />
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="icon"><LogOut /></Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-full">
                            <TabsTrigger value="saved"><Heart className="mr-2"/>Outfit đã lưu</TabsTrigger>
                            <TabsTrigger value="virtual-try-on"><Camera className="mr-2"/>Thử đồ ảo</TabsTrigger>
                            <TabsTrigger value="settings"><Settings className="mr-2"/>Cài đặt</TabsTrigger>
                        </TabsList>
                        <TabsContent value="saved" className="mt-6">
                            {savedOutfitsLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                                        </div>
                                    ))}
                                </div>
                            ) : savedOutfitsError ? (
                                <div className="text-center col-span-full py-16 border-2 border-dashed rounded-2xl">
                                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">Lỗi tải dữ liệu</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Không thể tải danh sách outfit đã lưu
                                    </p>
                                    <Button asChild className="mt-4">
                                        <Link href="/gallery">Khám phá ngay</Link>
                                    </Button>
                                </div>
                            ) : savedOutfits.length === 0 ? (
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
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {savedOutfits.map(outfit => (
                                        <Link key={outfit.id} href={`/outfit/${outfit.id}`} passHref>
                                            <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full rounded-2xl">
                                                <CardContent className="p-0">
                                                    <div className="relative aspect-[4/5] overflow-hidden">
                                                        <Image 
                                                            src={outfit.image_url || '/placeholder-outfit.jpg'} 
                                                            width={400} 
                                                            height={500} 
                                                            alt={outfit.title} 
                                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                                                            data-ai-hint={outfit.ai_hint} 
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="virtual-try-on" className="mt-6">
                            {virtualTryOnsLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Card key={i} className="overflow-hidden">
                                            <CardContent className="p-0">
                                                <Skeleton className="aspect-[3/4] w-full" />
                                                <div className="p-4 space-y-2">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                    <Skeleton className="h-6 w-20" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : virtualTryOnsError ? (
                                <div className="text-center col-span-full py-16 border-2 border-dashed rounded-2xl">
                                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">Lỗi tải dữ liệu</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Không thể tải lịch sử thử đồ ảo
                                    </p>
                                    <Button asChild className="mt-4">
                                        <Link href="/virtual-try-on">Thử ngay</Link>
                                    </Button>
                                </div>
                            ) : virtualTryOns?.length === 0 ? (
                                <div className="text-center col-span-full py-16 border-2 border-dashed rounded-2xl">
                                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">Chưa có lịch sử thử đồ ảo</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Hãy bắt đầu thử đồ ảo với AI để xem kết quả ở đây!
                                    </p>
                                    <Button asChild className="mt-4">
                                        <Link href="/virtual-try-on">Thử ngay</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {virtualTryOns?.map((vto) => (
                                        <div key={vto.id} className="group relative">
                                            {vto.result_image_url ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className="w-full aspect-[3/4] overflow-hidden rounded-lg border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                                                            <Image 
                                                                src={vto.result_image_url} 
                                                                alt={`Virtual try-on ${vto.id}`} 
                                                                width={300} 
                                                                height={400} 
                                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                                                            />
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Kết quả thử đồ ảo</DialogTitle>
                                                        </DialogHeader>
                                                        <AspectRatio ratio={3/4}>
                                                            <Image 
                                                                src={vto.result_image_url} 
                                                                alt={`Virtual try-on ${vto.id}`} 
                                                                fill 
                                                                className="object-contain rounded-md" 
                                                            />
                                                        </AspectRatio>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <div className="w-full aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                                                    <div className="text-center">
                                                        <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                                                        <p className="text-xs text-muted-foreground">Đang xử lý...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="settings" className="mt-6">
                          <SettingsNotificationForm />
                        </TabsContent>
                    </Tabs>
                </section>
            </main>
            <Footer />
        </div>
    );
}
