
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Lock, ShieldCheck, LifeBuoy } from "lucide-react";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.84-4.26 1.84-5.22 0-9.4-4.18-9.4-9.4s4.18-9.4 9.4-9.4c2.6 0 4.52.99 6.04 2.44l2.7-2.7C19.04 1.36 16.14 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.94 0 12.02-4.82 12.02-12.02 0-.8-.08-1.57-.2-2.32H12.48z" fill="#4285F4" />
    </svg>
);

export default function SignInPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4 font-body">
            <div className="w-full max-w-md space-y-8">
                <Card className="shadow-lg bg-card border-border/60">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Image src="https://lh3.googleusercontent.com/gg-dl/AJfQ9KRNnfPzFPUeVi07oH9EUrHHvUBq40oMELqTFcGzJ3ZZKY5J4NUPFlIm_iM_xzgHWLGC0fA3Qz9QIYiCTdTHEim7B64HsROKPi8v0JzgjBn0zhM-bmdGN8iTvRAuZuJ47fnZbDICxCj-_RSRNldw3EaGdQLwIEmq53Aa9ZqaFgEDLOdxGg" alt="Lookify Logo" width={32} height={32} />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">Đăng nhập</CardTitle>
                            <CardDescription>Tiếp tục với Google để truy cập nhanh.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button variant="outline" className="w-full justify-between text-base py-6 bg-white hover:bg-gray-100 text-foreground">
                            <div className="flex items-center">
                                <GoogleIcon />
                                <span>Đăng nhập với Google</span>
                            </div>
                            <ArrowRight />
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
