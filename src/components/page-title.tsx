
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageTitleProps {
    title: string;
    children?: React.ReactNode;
    backHref?: string;
}

export function PageTitle({ title, children, backHref }: PageTitleProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {backHref && (
                    <Button variant="outline" size="icon" asChild>
                        <Link href={backHref}>
                            <ArrowLeft />
                            <span className="sr-only">Quay lại</span>
                        </Link>
                    </Button>
                )}
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
            {children}
        </div>
    )
}
