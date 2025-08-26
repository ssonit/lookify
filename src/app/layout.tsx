
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { Inter } from 'next/font/google';
import { SettingsProvider } from '@/contexts/settings-context';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Lookify',
  description: 'Nâng cấp phong cách – Nâng cấp chính mình',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <body className={`${inter.variable} font-body bg-background text-foreground`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
