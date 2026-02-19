'use client';

import { Movie } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Plus, ArrowRight } from 'lucide-react';

import { useState } from 'react';
import { TrailerModal } from '@/components/movies/TrailerModal';

interface ObsidianHeroProps {
    movie: Movie;
}

export function ObsidianHero({ movie }: ObsidianHeroProps) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    return (
        <section className="relative w-full h-[85vh] overflow-hidden bg-black">
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={movie.trailerUrl || ''}
            />

            {/* Background Image with Gradient Fade */}
            <div className="absolute inset-0">
                <Image
                    src={movie.backdropUrl || movie.posterUrl}
                    alt={movie.title}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                {/* The "Void" Gradient - Fades image into pure black at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-transparent to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-style easing
                    className="max-w-3xl"
                >
                    {/* Badge */}


                    {/* Title */}
                    <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 drop-shadow-2xl">
                        {movie.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-white/60 text-lg mb-8 font-medium">
                        <span className="text-white font-semibold">{movie.year}</span>
                        <span>•</span>
                        <span>{movie.genres?.[0]}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-white">{movie.rating}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xl text-white/70 line-clamp-3 mb-10 max-w-2xl leading-relaxed font-light">
                        {movie.reviewShort || movie.review15Lines?.[0]}
                    </p>

                    {/* Actions - Glossy Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        {/* 1. Watch Trailer - Solid Gold (User Request) */}
                        {movie.trailerUrl ? (
                            <button
                                onClick={() => setIsTrailerOpen(true)}
                                className="group relative px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] rounded-full transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                            >
                                <span className="flex items-center gap-3 text-black font-bold tracking-wide">
                                    <Play className="w-5 h-5 fill-black" />
                                    Watch Trailer
                                </span>
                            </button>
                        ) : (
                            <Link
                                href={`/movies/${movie.slug}`}
                                className="group relative px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] rounded-full transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                            >
                                <span className="flex items-center gap-3 text-black font-bold tracking-wide">
                                    <Play className="w-5 h-5 fill-black" />
                                    Watch Trailer
                                </span>
                            </Link>
                        )}

                        {/* 2. Read Review - Blend In / Minimalist */}
                        <Link
                            href={`/movies/${movie.slug}`}
                            className="group flex items-center gap-3 px-6 py-4 rounded-full hover:bg-white/5 transition-all duration-300 text-white/50 hover:text-white"
                        >
                            <span className="font-medium tracking-wide">Read Review</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
