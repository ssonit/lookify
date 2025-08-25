

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Lock, ShieldCheck, LifeBuoy } from "lucide-react";
import { GoogleIcon } from "@/components/icons";

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
