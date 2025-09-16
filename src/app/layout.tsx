
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { Inter } from 'next/font/google';
import { SettingsProvider } from '@/contexts/settings-context';
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { AuthProvider } from '@/contexts/auth-context';
import SWRProvider from '@/providers/swr-provider';


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
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-body bg-background text-foreground`} suppressHydrationWarning>
        <SWRProvider>
          <AuthProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </AuthProvider>
        </SWRProvider>
        <Toaster />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
