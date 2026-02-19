import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType
}

export function Container({
    className,
    as: Component = "div",
    children,
    ...props
}: ContainerProps) {
    return (
        <Component
            className={cn(
                "w-full max-w-[1400px] mx-auto px-6 md:px-12",
                "border-l border-r border-border min-h-screen bg-background",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
}
