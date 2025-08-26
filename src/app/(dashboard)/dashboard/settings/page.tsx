
'use client';

import { PageTitle } from "@/components/page-title";
import { SettingsForm } from "@/components/settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import type { SettingsFormValues } from "@/components/settings-form";
import { SettingsContext } from "@/contexts/settings-context";


export default function SettingsPage() {
  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) {
    // This can happen if the context is not yet available.
    // You might want to show a loader or return null.
    return null; 
  }

  const { settings, setSettings } = settingsContext;

  const handleSave = (data: Partial<SettingsFormValues>) => {
    setSettings(prevSettings => ({...prevSettings, ...data}));
    console.log("Settings saved:", data);
    // In a real app, you would call an API to save these settings.
  };

  const initialData = {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logoUrl: settings.logoUrl,
    bannerUrl: settings.bannerUrl,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
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
