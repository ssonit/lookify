
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Lock, ShieldCheck, LifeBuoy } from "lucide-react";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2">
        <title>Google</title>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.97 2.53-2.05 3.32v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.08z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

export default function SignInPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4 font-body">
            <div className="w-full max-w-md space-y-8">
                <Card className="shadow-lg bg-card border-border/60">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Image src="https://placehold.co/32x32.png" alt="Lookify Logo" width={32} height={32} data-ai-hint="logo" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">Đăng nhập</CardTitle>
                            <CardDescription>Tiếp tục với Google để truy cập nhanh.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button variant="outline" className="w-full relative justify-center text-base py-6 bg-white hover:bg-gray-100 text-foreground group">
                            <GoogleIcon />
                            <span>Đăng nhập với Google</span>
                            <ArrowRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50 border border-border/50">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            <p>Chỉ hỗ trợ Google. Chúng tôi không lưu mật khẩu của bạn.</p>
                        </div>

                         <p className="text-center text-xs text-muted-foreground">
                            Bằng việc tiếp tục, bạn đồng ý với {' '}
                            <Link
                                href="/terms"
                                className="underline hover:text-primary"
                            >
                                Điều khoản
                            </Link>{' '}
                            và{' '}
                            <Link
                                href="/privacy"
                                className="underline hover:text-primary"
                            >
                                Chính sách quyền riêng tư
                            </Link>
                            .
                        </p>

                    </CardContent>
                </Card>

                <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
                    <Link href="#" className="flex items-center gap-1.5 hover:text-primary"><FileText className="h-4 w-4"/>Điều khoản</Link>
                    <Link href="#" className="flex items-center gap-1.5 hover:text-primary"><Lock className="h-4 w-4"/>Quyền riêng tư</Link>
                    <Link href="#" className="flex items-center gap-1.5 hover:text-primary"><LifeBuoy className="h-4 w-4"/>Hỗ trợ</Link>
                </div>
            </div>
        </main>
    )
}
