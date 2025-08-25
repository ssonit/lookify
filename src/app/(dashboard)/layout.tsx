
import { DashboardNav } from "@/components/dashboard-nav";
import { Header } from "@/components/header";
import { LayoutDashboard, ShoppingBag, Settings } from "lucide-react";

const navItems = [
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
        <main className="flex-1 bg-muted/40">
           <div className="container mx-auto py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold">Bảng điều khiển</h1>
                </div>
                <div className="grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <DashboardNav items={navItems} />
                    <div className="grid gap-6">
                        {children}
                    </div>
                </div>
           </div>
        </main>
    </div>
  );
}
