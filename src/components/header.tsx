
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className="h-8 w-8 text-primary"
  >
    <path
      fill="currentColor"
      d="M144,32H112a8,8,0,0,0-8,8V216a8,8,0,0,0,16,0V168h88a8,8,0,0,0,8-8V40a8,8,0,0,0-8-8H144Zm48,112H120V48h72Z"
    />
  </svg>
);


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="font-bold font-headline text-2xl mb-2">Lookify</span>
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
