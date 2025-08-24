import { Shirt } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shirt className="h-8 w-8 text-primary" />
          <span className="font-bold font-headline text-2xl">Style Ascent</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-lg">
           <Button variant="ghost" asChild>
                <Link href="/suggester">Gợi ý AI</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/featured">Nổi bật</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/gallery">Thư viện</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/upgrade">Nâng cấp</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
