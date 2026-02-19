'use client';

import { useState, useMemo } from 'react';
import { Movie } from '@/lib/types';
import { Container } from '@/components/ui/Container';
import { MovieCard } from '@/components/movies/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';

interface FilmsGridClientProps {
    initialMovies: Movie[];
}

export function FilmsGridClient({ initialMovies }: FilmsGridClientProps) {

    // Sort Alphabetically by default for the Index
    const sortedMovies = useMemo(() => {
        return [...initialMovies].sort((a, b) => a.title.localeCompare(b.title));
    }, [initialMovies]);

    return (
        <main className="min-h-screen pt-32 pb-20">
            <Container className="min-h-0 border-none">

                {/* Header */}
                <div className="flex flex-col items-start mb-16 border-b border-white/10 pb-8">
                    <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold mb-2">
                        The Archive
                    </span>
                    <h1 className="font-heading font-black text-6xl md:text-8xl text-foreground mb-4">
                        INDEX
                    </h1>
                    <p className="text-muted text-lg font-light max-w-xl leading-relaxed">
                        The complete collection of films, sorted alphabetically.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {sortedMovies.map((movie, i) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <MovieCard movie={movie} />
                        </motion.div>
                    ))}
                </div>

            </Container>
        </main>
    );
}
