'use client';

import { useMemo } from 'react';
import { Movie } from '@/lib/types';
import { HeroSection } from '@/components/HeroSection';
import { MovieRow } from '@/components/MovieRow';

interface HomeClientProps {
    initialMovies: Movie[];
}

export function HomeClient({ initialMovies }: HomeClientProps) {
    // 1. Featured Movie (Latest by date)
    const featuredMovie = useMemo(() => {
        return [...initialMovies].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0] || initialMovies[0];
    }, [initialMovies]);

    // 2. Categories
    const newArrivals = useMemo(() => {
        return [...initialMovies]
            .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
            .slice(0, 10);
    }, [initialMovies]);

    // Top Rated (Rating > 7)
    const topRated = useMemo(() => {
        return [...initialMovies]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
    }, [initialMovies]);

    // The Archive (Alphabetical)
    const archive = useMemo(() => {
        return [...initialMovies].sort((a, b) => a.title.localeCompare(b.title));
    }, [initialMovies]);

    return (
        <main className="min-h-screen pb-20 bg-[#0B0C10]">
            {/* Hero Section */}
            {featuredMovie && <HeroSection movie={featuredMovie} />}

            {/* Content Rows */}
            <div className="relative z-10 -mt-20 space-y-8">
                <MovieRow title="New Arrivals" movies={newArrivals} href="/movies" />
                <MovieRow title="Top Rated" movies={topRated} href="/top-50" />
                <MovieRow title="The Archive" movies={archive} href="/movies" />
            </div>

            {/* Footer / End Seal */}
            <div className="text-center py-24 text-[#0B0C10] opacity-50 font-heading text-4xl font-black uppercase tracking-widest select-none">
                15 Lines of Cinema
            </div>
        </main>
    );
}
