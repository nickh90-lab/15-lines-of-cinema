'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/lib/types';
import { ObsidianCard } from './ObsidianCard';

interface VaultCarouselProps {
    title: string;
    movies: Movie[];
    className?: string;
}

export function VaultCarousel({ title, movies, className }: VaultCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll 80% of width
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className={cn("py-8 relative group", className)}>
            <div className="px-6 max-w-[1400px] mx-auto mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
            </div>

            <div className="relative group/carousel max-w-[1400px] mx-auto px-6">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 top-0 bottom-0 z-20 w-16 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
                    >
                        <div className="p-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors shadow-2xl">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </div>
                    </button>
                )}

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 pt-2 snap-x snap-mandatory -mx-2 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="min-w-[160px] md:min-w-[200px] lg:min-w-[220px] snap-start">
                            <ObsidianCard movie={movie} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 top-0 bottom-0 z-20 w-16 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
                    >
                        <div className="p-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors shadow-2xl">
                            <ChevronRight className="w-6 h-6 text-white" />
                        </div>
                    </button>
                )}
            </div>
        </section>
    );
}
