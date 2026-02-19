'use client';

import { Movie } from '@/lib/types';
import { MovieCard } from '@/components/movies/MovieCard';
import { motion } from 'framer-motion';

interface MoviePodiumProps {
    movies: Movie[];
    title: string;
    type: 'top' | 'flop';
}

export function MoviePodium({ movies, title, type }: MoviePodiumProps) {
    if (movies.length < 3) return null;

    // Standard order 1, 2, 3 for editorial (not podium)
    const top3 = movies.slice(0, 3);

    return (
        <div className="w-full mb-20 border-b border-white/10 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {top3.map((movie, index) => {
                    const rank = index + 1;
                    return (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="flex items-baseline justify-between mb-4 border-b border-white/10 pb-2">
                                <span className={`font-heading font-black text-6xl ${type === 'top' ? 'text-accent' : 'text-red-500'}`}>
                                    #{rank}
                                </span>
                                <span className="font-heading font-bold text-2xl text-foreground">
                                    {movie.rating}/10
                                </span>
                            </div>

                            <MovieCard movie={movie} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
