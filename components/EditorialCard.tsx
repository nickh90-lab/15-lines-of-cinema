'use client';

import Link from 'next/link';
import { Movie } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EditorialCardProps {
    movie: Movie;
    variant?: 'standard' | 'feature' | 'compact';
    className?: string;
}

export function EditorialCard({ movie, variant = 'standard', className }: EditorialCardProps) {
    // Variants determine size and layout
    const isFeature = variant === 'feature';

    return (
        <Link href={`/movies/${movie.slug}`} className={cn("group block h-full", className)}>
            <motion.div
                whileHover={{ y: -5 }}
                className={cn(
                    "relative h-full bg-card border border-border overflow-hidden transition-colors hover:border-primary/50 flex flex-col",
                    isFeature ? "md:flex-row" : "flex-col"
                )}
            >
                {/* Image Section */}
                <div className={cn(
                    "relative overflow-hidden bg-muted",
                    isFeature ? "w-full md:w-1/2 aspect-video md:aspect-auto" : "w-full aspect-[3/2]"
                )}>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
                    />
                    {/* Dark Overlay for text contrast if needed, or paper texture */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                    {/* Rating Badge (Absolute) */}
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-mono font-bold text-lg px-3 py-1 shadow-lg">
                        {movie.rating}
                    </div>
                </div>

                {/* Content Section */}
                <div className={cn(
                    "p-6 flex flex-col justify-between flex-grow",
                    isFeature ? "w-full md:w-1/2 p-8 lg:p-12" : ""
                )}>
                    <div>
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                            <span>{movie.year}</span>
                            <span className="w-1 h-1 bg-border rounded-full" />
                            <span>{movie.genres?.[0] || 'Film'}</span>
                        </div>

                        {/* Title */}
                        <h3 className={cn(
                            "font-heading font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors",
                            isFeature ? "text-4xl lg:text-5xl" : "text-2xl"
                        )}>
                            {movie.title}
                        </h3>

                        {/* Excerpt */}
                        <p className={cn(
                            "font-serif text-muted-foreground leading-relaxed line-clamp-3",
                            isFeature ? "text-lg line-clamp-4" : "text-sm"
                        )}>
                            {movie.reviewShort || movie.review15Lines?.[0] || "Read the full review..."}
                        </p>
                    </div>

                    {/* Footer / Read More */}
                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                        <span>Read Review</span>
                        <span>&rarr;</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
