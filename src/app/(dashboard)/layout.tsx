
import { DashboardNav } from "@/components/dashboard-nav";
import { Header } from "@/components/header";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants.tsx";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
