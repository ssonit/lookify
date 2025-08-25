
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
    return (
        <section className={cn("text-center", className)}>
            <h1 className="font-headline text-5xl md:text-6xl py-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {title}
            </h1>
            {description && (
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    {description}
                </p>
            )}
        </section>
    );
}
