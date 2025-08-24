import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { Playfair_Display, PT_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
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
    <html lang="vi" suppressHydrationWarning className={`${playfair.variable} ${ptSans.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
