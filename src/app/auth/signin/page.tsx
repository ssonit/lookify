
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.84-4.26 1.84-5.22 0-9.4-4.18-9.4-9.4s4.18-9.4 9.4-9.4c2.6 0 4.52.99 6.04 2.44l2.7-2.7C19.04 1.36 16.14 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.94 0 12.02-4.82 12.02-12.02 0-.8-.08-1.57-.2-2.32H12.48z" fill="#4285F4" />
    </svg>
);


export default function SignInPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-card p-4 font-body">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Image src="https://lh3.googleusercontent.com/gg-dl/AJfQ9KRNnfPzFPUeVi07oH9EUrHHvUBq40oMELqTFcGzJ3ZZKY5J4NUPFlIm_iM_xzgHWLGC0fA3Qz9QIYiCTdTHEim7B64HsROKPi8v0JzgjBn0zhM-bmdGN8iTvRAuZuJ47fnZbDICxCj-_RSRNldw3EaGdQLwIEmq53Aa9ZqaFgEDLOdxGg" alt="Lookify Logo" width={40} height={40} />
                        <span className="font-headline text-3xl font-bold">Lookify</span>
                    </Link>
                </div>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-2xl">Đăng nhập</CardTitle>
                        <CardDescription className="text-center">Sử dụng tài khoản Google của bạn để tiếp tục.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full text-base py-6">
                            <GoogleIcon />
                            <span>Đăng nhập với Google</span>
                        </Button>

                         <p className="px-8 text-center text-sm text-muted-foreground">
                            Bằng việc tiếp tục, bạn đồng ý với{' '}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Điều khoản dịch vụ
                            </Link>{' '}
                            và{' '}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Chính sách quyền riêng tư
                            </Link>
                            .
                        </p>

                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
