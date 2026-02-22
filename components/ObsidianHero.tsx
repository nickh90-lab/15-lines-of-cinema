'use client';

import { Movie } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TrailerModal } from '@/components/movies/TrailerModal';
import { cn } from '@/lib/utils';

interface ObsidianHeroProps {
    movies: Movie[];
}

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export function ObsidianHero({ movies }: ObsidianHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Guard clause if no movies provided
    if (!movies || movies.length === 0) return null;

    const currentMovie = movies[currentIndex];

    // Auto-play logic
    useEffect(() => {
        const startInterval = () => {
            progressIntervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % movies.length);
            }, AUTOPLAY_INTERVAL);
        };

        startInterval();

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [movies.length, currentIndex]); // Reset interval when currentIndex changes manually

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="relative w-full h-[85vh] overflow-hidden bg-black">
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={currentMovie?.trailerUrl || ''}
            />

            {/* AnimatePresence for Crossfading Backgrounds & Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`hero-bg-${currentMovie.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentMovie.backdropUrl || currentMovie.posterUrl}
                        alt={currentMovie.title}
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                    {/* The "Void" Gradient - Fades image into pure black at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-24 md:pb-32 pt-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`hero-content-${currentMovie.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Apple-style easing
                        className="max-w-3xl"
                    >
                        {/* Title */}
                        <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-2xl break-words">
                            {currentMovie.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-white/60 text-lg mb-8 font-medium">
                            <span className="text-white font-semibold">{currentMovie.year}</span>
                            <span>•</span>
                            <span>{currentMovie.genres?.[0]}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-white">{currentMovie.rating}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xl text-white/70 line-clamp-3 mb-10 max-w-2xl leading-relaxed font-light">
                            {currentMovie.reviewShort || currentMovie.review15Lines?.[0]}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {currentMovie.trailerUrl ? (
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
                                    href={`/movies/${currentMovie.slug}`}
                                    className="group relative px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] rounded-full transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                                >
                                    <span className="flex items-center gap-3 text-black font-bold tracking-wide">
                                        <Play className="w-5 h-5 fill-black" />
                                        Watch Trailer
                                    </span>
                                </Link>
                            )}

                            <Link
                                href={`/movies/${currentMovie.slug}`}
                                className="group flex items-center gap-3 px-6 py-4 rounded-full hover:bg-white/5 transition-all duration-300 text-white/50 hover:text-white"
                            >
                                <span className="font-medium tracking-wide">Read Review</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators - Subtle Version */}
                <div className="absolute bottom-12 left-6 right-6 max-w-[1400px] mx-auto xl:w-full xl:left-0 flex gap-2">
                    {movies.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            onClick={() => handleDotClick(index)}
                            className="relative w-8 sm:w-12 h-1 rounded-full overflow-hidden bg-white/20 hover:bg-white/40 transition-colors group cursor-pointer"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            {/* Animated Progress Fill */}
                            {currentIndex === index && (
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: AUTOPLAY_INTERVAL / 1000,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 bg-white/80"
                                />
                            )}
                            {/* Retain full width if it's already passed */}
                            {index < currentIndex && (
                                <div className="absolute inset-0 bg-white/40" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
