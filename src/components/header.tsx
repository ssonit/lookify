
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://lh3.googleusercontent.com/gg-dl/AJfQ9KRNnfPzFPUeVi07oH9EUrHHvUBq40oMELqTFcGzJ3ZZKY5J4NUPFlIm_iM_xzgHWLGC0fA3Qz9QIYiCTdTHEim7B64HsROKPi8v0JzgjBn0zhM-bmdGN8iTvRAuZuJ47fnZbDICxCj-_RSRNldw3EaGdQLwIEmq53Aa9ZqaFgEDLOdxGg" alt="Lookify Logo" width={32} height={32} className="h-8 w-8" />
          <span className="font-bold font-headline text-2xl mb-2">Lookify</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-lg">
           <Button variant="ghost" asChild>
                <Link href="/suggester" className="font-medium">Gợi ý AI</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/featured" className="font-medium">Nổi bật</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/gallery" className="font-medium">Thư viện</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/upgrade" className="font-medium">Nâng cấp</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
