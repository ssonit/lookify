
'use client';

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
import { User, Settings, LogOut, Heart, Menu, LayoutDashboard, Ruler } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Separator } from './ui/separator';
import { useContext } from 'react';
import { SettingsContext } from '@/contexts/settings-context';

export function Header() {
  const isLoggedIn = true; // Mock login state
  const settingsContext = useContext(SettingsContext);
  const siteName = settingsContext?.settings?.siteName || 'Lookify';
  const logoUrl = settingsContext?.settings?.logoUrl || 'https://placehold.co/32x32.png';
  const currentUser = settingsContext?.currentUser;

  const navLinks = [
    { href: "/suggester", label: "Gợi ý AI" },
    { href: "/featured", label: "Styling theo Mood" },
    { href: "/fit-guide", label: "Fit Guide" },
    { href: "/gallery", label: "Thư viện" },
    { href: "/upgrade", label: "Nâng cấp" },
  ];

  const userActions = (
    <>
      <DropdownMenuItem asChild>
        <Link href="/profile">
          <User className="mr-2 h-4 w-4" />
          <span>Hồ sơ</span>
        </Link>
      </DropdownMenuItem>
       <DropdownMenuItem asChild>
        <Link href="/profile?tab=saved">
          <Heart className="mr-2 h-4 w-4" />
          <span>Đã lưu</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/profile?tab=settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
       {currentUser?.role === 'admin' && (
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Đăng xuất</span>
      </DropdownMenuItem>
    </>
  );

  const mobileUserActions = (
    <>
       <SheetClose asChild>
          <Link href="/profile" className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <User className="mr-2 h-4 w-4" />
            <span>Hồ sơ</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href="/profile?tab=saved" className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Heart className="mr-2 h-4 w-4" />
            <span>Đã lưu</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href="/profile?tab=settings" className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </Link>
        </SheetClose>
        <Separator className="my-1" />
        {currentUser?.role === 'admin' && (
          <SheetClose asChild>
            <Link href="/dashboard" className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </SheetClose>
        )}
        <Separator className="my-1" />
        <SheetClose asChild>
            <button className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
            </button>
        </SheetClose>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logoUrl} alt="Lookify Logo" width={32} height={32} className="h-8 w-8" data-ai-hint="logo" />
           <span className="font-bold font-headline text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">{siteName}</span>
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
          {/* Desktop Avatar */}
          <div className="hidden md:flex">
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
                    {userActions}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                 <Button asChild>
                    <Link href="/signin">Đăng nhập</Link>
                </Button>
              )}
          </div>
          

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
                
                {/* Mobile User Profile Section */}
                {isLoggedIn ? (
                  <div className="mb-4">
                     <Link href="/profile" className="flex items-center gap-3 mb-4">
                       <Avatar>
                          <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                          <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{currentUser?.name}</p>
                        <p className="text-sm text-muted-foreground">Xem hồ sơ</p>
                      </div>
                    </Link>
                     <div className="flex flex-col gap-1">
                      {mobileUserActions}
                    </div>
                  </div>
                ) : (
                   <Button asChild className="w-full mb-4">
                      <Link href="/signin">Đăng nhập</Link>
                  </Button>
                )}

                <Separator className="my-4" />

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4">
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
