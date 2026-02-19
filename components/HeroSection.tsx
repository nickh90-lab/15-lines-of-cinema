'use client';

import { Movie } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

interface HeroSectionProps {
    movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
    return (
        <div className="relative h-[90vh] w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
                }}
            >
                {/* Classic Cinematic Gradients (No mask, just clean fades for text readability) */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    {/* Badge */}
                    <span className="inline-block px-4 py-2 mb-6 text-xs font-bold tracking-widest text-[#0F172A] bg-primary uppercase rounded-sm shadow-lg">
                        New Release
                    </span>

                    {/* Title */}
                    <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-none text-foreground mb-6 drop-shadow-2xl">
                        {movie.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-lg text-foreground/80 mb-8 font-medium">
                        <span className="text-secondary font-bold drop-shadow-md">{movie.rating}/10</span>
                        <span>•</span>
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : movie.genres?.[0]}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xl text-foreground/70 line-clamp-3 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-md">
                        {movie.reviewShort || movie.review15Lines?.[0] || 'No review available.'}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/movies/${movie.slug}`}
                            className="flex items-center gap-3 px-8 py-4 bg-primary text-[#0F172A] font-bold rounded-sm hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Watch Trailer
                        </Link>
                        <Link
                            href={`/movies/${movie.slug}`}
                            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 text-foreground font-bold rounded-sm hover:bg-white/20 transition-all"
                        >
                            <Info className="w-5 h-5" />
                            More Info
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
