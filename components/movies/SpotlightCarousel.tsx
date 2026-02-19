'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Movie } from '@/lib/types';
import { Rating } from '@/components/ui/Rating';

interface SpotlightCarouselProps {
    movies: Movie[];
    onSlideChange?: (movie: Movie) => void;
}

export function SpotlightCarousel({ movies, onSlideChange }: SpotlightCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (movies.length > 0 && onSlideChange) {
            onSlideChange(movies[currentIndex]);
        }
    }, [currentIndex, movies, onSlideChange]);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 8000); // 8 seconds per slide

        return () => clearInterval(timer);
    }, [movies.length]);

    if (!movies.length) {
        return (
            <div className="w-full h-[85vh] flex items-center justify-center text-white">
                <p>No featured movies found.</p>
            </div>
        );
    }

    const currentMovie = movies[currentIndex] || movies[0]; // Fallback

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="relative w-full h-[85vh] overflow-hidden bg-gray-900">
            {/* Background Backdrop Transition */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentMovie.backdropUrl || currentMovie.posterUrl})` }}
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center px-4 md:px-12 z-10">
                <div className="max-w-4xl w-full pt-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMovie.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-accent/90 text-black text-xs font-bold uppercase tracking-widest rounded-sm backdrop-blur-md">
                                    Editor's Pick
                                </span>
                                <Rating value={currentMovie.rating} size="sm" />
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-8xl font-heading font-bold text-white leading-none tracking-tighter text-shadow-lg">
                                {currentMovie.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-white/80 font-light text-lg">
                                <span>{currentMovie.year}</span>
                                <span className="w-1 h-1 bg-accent rounded-full" />
                                <span>{currentMovie.director}</span>
                                <span className="w-1 h-1 bg-accent rounded-full" />
                                <span className="italic">{currentMovie.genres[0]}</span>
                            </div>

                            {/* Extract */}
                            <p className="max-w-xl text-lg md:text-xl text-gray-200 line-clamp-3 font-light leading-relaxed drop-shadow-md">
                                {currentMovie.reviewShort}
                            </p>

                            {/* Action */}
                            <div className="pt-4">
                                <Link
                                    href={`/movies/${currentMovie.slug}`}
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 rounded-full backdrop-blur-sm transition-all duration-300 font-medium tracking-wide"
                                >
                                    Read Review
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {movies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
