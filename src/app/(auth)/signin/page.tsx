

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Lock, ShieldCheck, LifeBuoy } from "lucide-react";
import { GoogleIcon } from "@/components/icons";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useAuth } from "@/contexts/auth-context";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
    const { currentUser } = useAuth();
    const { signInWithGoogle, isLoading: authActionsLoading } = useAuthActions();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        // Check for auth errors from callback
        const error = searchParams.get('error');
        if (error) {
            let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';
            
            switch (error) {
                case 'auth_callback_error':
                    errorMessage = 'Lỗi xác thực. Vui lòng thử lại.';
                    break;
                case 'no_code':
                    errorMessage = 'Thiếu mã xác thực. Vui lòng thử lại.';
                    break;
                case 'unexpected_error':
                    errorMessage = 'Lỗi không mong muốn. Vui lòng thử lại sau.';
                    break;
            }
            
            toast({
                variant: "destructive",
                title: "Lỗi đăng nhập",
                description: errorMessage,
            });
        }

        // Redirect if already authenticated
        if (currentUser) {
            router.push('/');
        }
    }, [searchParams, currentUser, router, toast]);

    const handleGoogleSignIn = async () => {
        try {
            setIsSigningIn(true);
            await signInWithGoogle();
        } catch (error) {
            console.error('Sign in error:', error);
            toast({
                variant: "destructive",
                title: "Lỗi đăng nhập",
                description: "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
            });
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4 font-body">
            <div className="w-full max-w-md space-y-8">
                <Card className="shadow-lg bg-card border-border/60 relative overflow-hidden h-[400px] flex flex-col justify-center">
                    <BorderBeam size={250} duration={12} delay={9} borderWidth={2.5} />
                    <CardHeader className="flex flex-row items-center gap-4 p-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Image src="/logo.png" alt="Lookify Logo" width={48} height={48} data-ai-hint="logo" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-xl">Đăng nhập</CardTitle>
                            <CardDescription>Tiếp tục với Google để truy cập nhanh.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                        <Button 
                            variant="outline" 
                            className="w-full relative justify-center text-sm py-6 bg-white hover:bg-gray-100 text-foreground group"
                            onClick={handleGoogleSignIn}
                            disabled={authActionsLoading || isSigningIn}
                        >
                            <GoogleIcon />
                            <span>{'Đăng nhập với Google'}</span>
                            <ArrowRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50 border border-border/50">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            <p>Chỉ hỗ trợ Google. Chúng tôi không lưu mật khẩu của bạn.</p>
                        </div>

                         <p className="pt-4 text-center text-xs text-muted-foreground">
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
