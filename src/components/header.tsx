
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Heart, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

export function Header() {
  const isLoggedIn = true; // Mock login state

  const navLinks = [
    { href: "/suggester", label: "Gợi ý AI" },
    { href: "/featured", label: "Nổi bật" },
    { href: "/gallery", label: "Thư viện" },
    { href: "/upgrade", label: "Nâng cấp" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://lh3.googleusercontent.com/gg-dl/AJfQ9KRNnfPzFPUeVi07oH9EUrHHvUBq40oMELqTFcGzJ3ZZKY5J4NUPFlIm_iM_xzgHWLGC0fA3Qz9QIYiCTdTHEim7B64HsROKPi8v0JzgjBn0zhM-bmdGN8iTvRAuZuJ47fnZbDICxCj-_RSRNldw3EaGdQLwIEmq53Aa9ZqaFgEDLOdxGg" alt="Lookify Logo" width={32} height={32} className="h-8 w-8" />
           <span className="font-bold font-headline text-2xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">Lookify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Button key={link.href} variant="ghost" asChild>
                  <Link href={link.href} className="font-medium text-base">{link.label}</Link>
              </Button>
            ))}
        </nav>
        
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/profile#saved">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Đã lưu</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile#settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild>
                <Link href="/signin">Đăng nhập</Link>
            </Button>
          )}

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="sr-only">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                        Điều hướng chính của trang web. Chọn một liên kết để di chuyển đến trang khác.
                    </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map(link => (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href} className="text-lg font-medium hover:text-primary transition-colors">{link.label}</Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
