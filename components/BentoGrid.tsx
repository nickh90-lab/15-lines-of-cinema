'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]",
            className
        )}>
            {children}
        </div>
    );
}

interface BentoItemProps {
    children: ReactNode;
    className?: string;
    span?: '1x1' | '2x1' | '2x2' | '1x2';
}

export function BentoItem({ children, className, span = '1x1' }: BentoItemProps) {
    return (
        <div className={cn(
            "row-span-1 border border-border bg-card overflow-hidden transition-all hover:border-primary/30",
            span === '1x1' && "col-span-1",
            span === '2x1' && "col-span-1 md:col-span-2",
            span === '2x2' && "col-span-1 md:col-span-2 row-span-2",
            span === '1x2' && "col-span-1 row-span-2",
            className
        )}>
            {children}
        </div>
    );
}
