'use client';
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { Inter } from 'next/font/google';
import React, { useState, createContext } from 'react';
import type { SettingsFormValues } from '@/components/settings-form';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// export const metadata: Metadata = {
//   title: 'Lookify',
//   description: 'Nâng cấp phong cách – Nâng cấp chính mình',
// };

export const SettingsContext = createContext<{
  settings: Partial<SettingsFormValues>;
  setSettings: React.Dispatch<React.SetStateAction<Partial<SettingsFormValues>>>;
} | null>(null);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, setSettings] = useState<Partial<SettingsFormValues>>({
    siteName: 'Lookify',
    siteDescription: 'Nâng cấp phong cách – Nâng cấp chính mình',
    logoUrl: 'https://placehold.co/32x32.png',
    bannerUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    seoTitle: 'Lookify | Nâng cấp phong cách – Nâng cấp chính mình',
    seoDescription: 'Khám phá các gợi ý trang phục được cá nhân hóa và khám phá các phong cách tuyển chọn để nâng tầm tủ quần áo và sự tự tin của bạn.',
  });

  return (
    <html lang="vi" suppressHydrationWarning={true}>
       <head>
        <title>{settings.seoTitle}</title>
        <meta name="description" content={settings.seoDescription} />
      </head>
      <body className={`${inter.variable} font-body bg-background text-foreground`}>
        <SettingsContext.Provider value={{ settings, setSettings }}>
          {children}
        </SettingsContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
