
'use client';

import { PageTitle } from "@/components/page-title";
import { SettingsForm } from "@/components/settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {

  const handleSave = (data: any) => {
    console.log("Settings saved:", data);
    // In a real app, you would call an API to save these settings.
  };

  const initialData = {
    siteName: 'Lookify',
    siteDescription: 'Nâng cấp phong cách – Nâng cấp chính mình',
    logoUrl: 'https://placehold.co/32x32.png',
    bannerUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    seoTitle: 'Lookify | Nâng cấp phong cách – Nâng cấp chính mình',
    seoDescription: 'Khám phá các gợi ý trang phục được cá nhân hóa và khám phá các phong cách tuyển chọn để nâng tầm tủ quần áo và sự tự tin của bạn.',
    theme: {
        background: '0 0% 100%',
        foreground: '222.2 84% 4.9%',
        primary: '222.2 47.4% 11.2%',
        accent: '210 40% 96.1%',
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Cài đặt hệ thống" />
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="seo">SEO & Giao diện</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <SettingsForm initialData={initialData} onSave={handleSave} section="general" />
        </TabsContent>
        <TabsContent value="seo">
          <SettingsForm initialData={initialData} onSave={handleSave} section="seo" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
