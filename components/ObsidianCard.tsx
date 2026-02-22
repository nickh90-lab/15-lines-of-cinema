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

    return (
        <Link href={`/movies/${movie.slug}`} className={cn("group block relative", className)}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors"
            >
                {/* Poster Image */}
                <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className={cn(
                        "object-cover transition-all duration-700 group-hover:brightness-110",
                        isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                    )}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    onLoad={() => setIsLoaded(true)}
                />

                {/* Internal Glow (Top highlight) */}
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* External Glow (Behind - simulated via inset shadow or extra div if needed, but let's stick to clean internal/border effects for now to avoid mess) */}

                {/* Metadata Overlay (Slide up on hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-medium text-sm leading-tight mb-1 drop-shadow-md">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/60 font-medium">
                        <span>{movie.year}</span>
                        <span className="text-yellow-500">{movie.rating} ★</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
