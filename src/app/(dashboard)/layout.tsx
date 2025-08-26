
'use client';
import { DashboardNav } from "@/components/dashboard-nav";
import { Header } from "@/components/header";
import { BookText, LayoutDashboard, Settings, ShoppingBag, Users, ShieldAlert } from "lucide-react";
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DASHBOARD_NAV_ITEMS = [
    {
        label: 'Tổng quan',
        href: '/dashboard',
        icon: <LayoutDashboard />,
    },
    {
        label: 'Outfits',
        href: '/dashboard/outfits',
        icon: <ShoppingBag />,
    },
    {
        label: 'Người dùng',
        href: '/dashboard/users',
        icon: <Users />,
    },
     {
        label: 'Bài viết',
        href: '/dashboard/articles',
        icon: <BookText />,
    },
    {
        label: 'Cài đặt',
        href: '/dashboard/settings',
        icon: <Settings />,
    },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsContext = useContext(SettingsContext);
  const currentUser = settingsContext?.currentUser;

  if (currentUser?.role !== 'admin') {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-destructive">
                           <ShieldAlert className="h-8 w-8" /> Truy cập bị từ chối
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
           <div className="mx-auto grid w-full container items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-semibold">Bảng điều khiển</h1>
                <DashboardNav items={DASHBOARD_NAV_ITEMS} />
            </div>
            <div className="grid gap-6">
                {children}
            </div>
           </div>
        </main>
    </div>
  );
}
