'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ObsidianCardProps {
    movie: Movie;
    className?: string;
}

export function ObsidianCard({ movie, className }: ObsidianCardProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const isPrestige = movie.rating >= 8.5;

    return (
        <Link href={`/movies/${movie.slug}`} className={cn("group block relative", className)}>
            <motion.div
                whileHover={{
                    scale: 1.02,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }}
                className={cn(
                    "relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border",
                    isPrestige
                        ? "border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] group-hover:border-[#D4AF37]"
                        : "border-white/5 group-hover:border-white/20 shadow-2xl"
                )}
            >
                {/* Poster Image */}
                <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className={cn(
                        "object-cover transition-all duration-300 group-hover:brightness-110",
                        isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                    )}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    onLoad={() => setIsLoaded(true)}
                />

                {/* Prestige Overlay (Subtle Gold Gradient for 8.5+) */}
                {isPrestige && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                {/* Internal Glow (Top highlight) - Removed for cleaner look */}

                {/* Metadata Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300">
                    <h3 className="text-white font-bold font-heading text-sm leading-tight mb-1 drop-shadow-md">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/60 font-medium">
                        <span>{movie.year}</span>
                        <span className={cn(
                            "font-bold",
                            isPrestige ? "text-[#D4AF37]" : "text-yellow-500"
                        )}>{movie.rating} ★</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
