
interface PageTitleProps {
    title: string;
    children?: React.ReactNode;
}

export function PageTitle({ title, children }: PageTitleProps) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {children}
        </div>
    )
}
