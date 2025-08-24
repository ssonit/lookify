import { Shirt } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shirt className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">Style Ascent</span>
        </Link>
        <nav className="flex items-center gap-4">
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
                <Link href="/upgrade">Nâng cấp bản thân</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
