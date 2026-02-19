'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Navbar() {
    return (
        <nav className="fixed top-6 left-6 z-50 mix-blend-difference">
            <Link href="/" className="group flex items-center gap-2" aria-label="Home">
                <div className="flex flex-col leading-none">
                    <span className="font-heading font-black text-2xl tracking-tighter text-white/90 group-hover:text-accent transition-colors">
                        15
                    </span>
                    <span className="font-heading font-black text-2xl tracking-tighter text-white/90 group-hover:text-accent transition-colors -mt-1">
                        LINES
                    </span>
                </div>
            </Link>
        </nav>
    );
}
