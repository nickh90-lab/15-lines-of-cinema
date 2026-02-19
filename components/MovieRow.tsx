'use client';

import { useRef, useState } from 'react';
import { Movie } from '@/lib/types';
import { MovieCard } from '@/components/movies/MovieCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MovieRowProps {
    title: string;
    movies: Movie[];
    href?: string;
}

export function MovieRow({ title, movies, href }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction: 'left' | 'right') => {
        setIsMoved(true);
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-4 px-4 md:px-12 my-12 group/row">
            {/* Header */}
            <div className="flex items-center gap-2">
                {href ? (
                    <Link href={href} className="group/title flex items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground transition-colors group-hover/title:text-accent duration-300">
                            {title}
                        </h2>
                        <span className="text-xs uppercase tracking-widest text-muted opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                ) : (
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                        {title}
                    </h2>
                )}
            </div>

            {/* Carousel Container */}
            <div className="relative group">
                {/* Left Arrow */}
                <button
                    onClick={() => handleClick('left')}
                    className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-full w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center transition opacity-0 group-hover:opacity-100 ${!isMoved && 'hidden'}`}
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>

                <div
                    ref={rowRef}
                    className="flex items-start gap-4 overflow-x-scroll scrollbar-hide snap-x snap-mandatory pt-4 pb-8"
                >
                    {movies.map((movie) => (
                        // Using a fixed width to ensure row consistency
                        <div key={movie.id} className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px] snap-start relative">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => handleClick('right')}
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-full w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            </div>
        </div>
    );
}
