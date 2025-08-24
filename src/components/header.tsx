import { Shirt } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <a href="/" className="flex items-center space-x-2">
          <Shirt className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">Style Ascent</span>
        </a>
      </div>
    </header>
  );
}
