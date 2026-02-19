'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VaultGridProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function VaultGrid({ title, children, className }: VaultGridProps) {
    return (
        <section className={cn("py-12 px-6 max-w-[1400px] mx-auto", className)}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
                {/* Optional 'View All' link could go here */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {children}
            </div>
        </section>
    );
}
