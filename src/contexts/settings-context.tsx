
'use client';
import React, { useState, createContext, useEffect } from 'react';
import type { SettingsFormValues } from '@/components/settings-form';

interface SettingsContextType {
  settings: Partial<SettingsFormValues>;
  setSettings: React.Dispatch<React.SetStateAction<Partial<SettingsFormValues>>>;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Partial<SettingsFormValues>>({
    siteName: 'Lookify',
    siteDescription: 'Nâng cấp phong cách – Nâng cấp chính mình',
    logoUrl: 'https://placehold.co/32x32.png',
    bannerUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    seoTitle: 'Lookify | Nâng cấp phong cách – Nâng cấp chính mình',
    seoDescription: 'Khám phá các gợi ý trang phục được cá nhân hóa và khám phá các phong cách tuyển chọn để nâng tầm tủ quần áo và sự tự tin của bạn.',
  });

  useEffect(() => {
    if (document) {
      document.title = settings.seoTitle || 'Lookify';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
          metaDescription.setAttribute('content', settings.seoDescription || '');
      }
    }
  }, [settings.seoTitle, settings.seoDescription]);


  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
