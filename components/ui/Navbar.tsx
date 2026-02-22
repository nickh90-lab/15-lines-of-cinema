'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 left-0 z-[100] pointer-events-none">
            <Link href="/" className="pointer-events-auto inline-block group px-8" aria-label="Home">
                <motion.div
                    animate={{
                        paddingTop: scrolled ? "20px" : "24px",
                        x: scrolled ? 16 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                        "flex flex-col leading-none transition-colors duration-500",
                        scrolled ? "mix-blend-normal" : "mix-blend-difference"
                    )}
                >
                    <motion.span
                        animate={{
                            fontSize: scrolled ? "1.25rem" : "2.75rem",
                            letterSpacing: scrolled ? "-0.02em" : "-0.05em"
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="font-heading font-black text-white/90 group-hover:text-accent transition-colors"
                    >
                        15 LINES
                    </motion.span>
                    <motion.span
                        animate={{
                            fontSize: scrolled ? "8px" : "12px",
                            marginTop: scrolled ? "0px" : "-4px",
                            opacity: scrolled ? 0.6 : 0.8
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="font-heading font-bold tracking-[0.2em] text-white/60 group-hover:text-accent transition-colors ml-[1px]"
                    >
                        OF CINEMA
                    </motion.span>
                </motion.div>
            </Link>
        </nav>
    );
}
