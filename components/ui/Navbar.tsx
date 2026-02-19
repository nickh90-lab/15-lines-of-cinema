'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Navbar() {
    return (
        <nav className="fixed top-6 left-6 z-50 mix-blend-difference">
            <Link href="/" className="group flex items-center gap-2" aria-label="Home">
                <div className="flex flex-col leading-none">
                    <span className="font-heading font-black text-xl tracking-tighter text-white/90 group-hover:text-accent transition-colors">
                        15 LINES
                    </span>
                    <span className="font-heading font-bold text-[10px] tracking-[0.2em] text-white/60 group-hover:text-accent transition-colors -mt-1 ml-[1px]">
                        OF CINEMA
                    </span>
                </div>
            </Link>
        </nav>
    );
}
