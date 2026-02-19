'use client';

import { Movie } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';

interface EditorialHeroProps {
    movie: Movie;
}

export function EditorialHero({ movie }: EditorialHeroProps) {
    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center py-20 px-6">
            <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                {/* Visual Side (Poster) - spans 5 cols */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="hidden lg:block lg:col-span-5 relative"
                >
                    <div className="relative aspect-[2/3] w-full max-w-[500px] mx-auto overflow-hidden shadow-2xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${movie.posterUrl})` }}
                        />
                        {/* Paper Texture Overlay (optional subtle grain) */}
                        <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
                    </div>

                    {/* Caption / Credit */}
                    <div className="text-right mt-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Featured Review • {new Date().getFullYear()}
                    </div>
                </motion.div>

                {/* Editorial Side (Text) - spans 7 cols */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
                >
                    {/* Eyebrow */}
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                        <span className="w-12 h-[1px] bg-primary/50" />
                        <span className="text-primary font-mono text-sm tracking-[0.2em] uppercase">The Cover Story</span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-heading font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-foreground mb-8 tracking-tighter">
                        {movie.title}
                    </h1>

                    {/* Meta Data Grid */}
                    <div className="grid grid-cols-3 gap-6 border-t border-b border-white/10 py-6 mb-10 font-mono text-sm max-w-2xl mx-auto lg:mx-0">
                        <div>
                            <span className="block text-muted-foreground mb-1">Director</span>
                            <span className="text-foreground">{movie.director || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="block text-muted-foreground mb-1">Year</span>
                            <span className="text-foreground">{movie.year}</span>
                        </div>
                        <div>
                            <span className="block text-muted-foreground mb-1">Our Rating</span>
                            <span className="text-primary text-xl font-bold">{movie.rating}</span>
                        </div>
                    </div>

                    {/* The "Teaser" (Lead Paragraph) */}
                    <p className="text-xl md:text-2xl text-foreground/90 font-serif leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                        {movie.review15Lines?.[0] || movie.reviewShort || "A masterpiece that redefines the genre. Compelling, visually stunning, and an absolute must-watch."}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                        <Link
                            href={`/movies/${movie.slug}`}
                            className="group flex items-center gap-3 text-foreground hover:text-primary transition-colors text-lg font-bold border-b border-transparent hover:border-primary pb-1"
                        >
                            Read Full Review <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </Link>

                        <Link
                            href={`/movies/${movie.slug}`}
                            className="bg-primary text-primary-foreground px-8 py-4 font-mono uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
                        >
                            Watch Trailer
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Background Texture (Subtle) */}
            <div className="absolute inset-0 -z-10 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
        </section>
    );
}
