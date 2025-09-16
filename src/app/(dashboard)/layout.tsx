
'use client';

import { DashboardNav } from "@/components/dashboard-nav";
import { Header } from "@/components/header";
import { AdminRoute } from "@/components/auth/admin-route";
import { BookText, Camera, Palette, Settings, ShoppingBag, Tags, Users, Sparkles } from "lucide-react";

const DASHBOARD_NAV_ITEMS = [
    // {
    //     label: 'Tổng quan',
    //     href: '/dashboard',
    //     icon: <LayoutDashboard />,
    // },
    {
        label: 'Outfits',
        href: '/dashboard/outfits',
        icon: <ShoppingBag />,
    },
     {
        label: 'Bài viết',
        href: '/dashboard/articles',
        icon: <BookText />,
    },
    {
        label: 'Thử outfit',
        href: '/dashboard/virtual-try-on',
        icon: <Camera/>,
    },
    {
        label: 'Gợi ý AI',
        href: '/dashboard/ai-suggestions',
        icon: <Sparkles />,
    },
    {
        label: 'Danh mục',
        href: '/dashboard/categories',
        icon: <Tags />,
    },
    {
        label: 'Màu sắc',
        href: '/dashboard/colors',
        icon: <Palette />,
    },
    {
        label: 'Người dùng',
        href: '/dashboard/users',
        icon: <Users />,
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

  return (
      <div className="flex min-h-screen w-full flex-col">
          <Header />
          <AdminRoute>
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
         </AdminRoute>
      </div>
  );
}
