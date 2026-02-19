'use client';

import { Movie } from '@/lib/types';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import Image from 'next/image';

interface RankedListClientProps {
    movies: Movie[];
    title: string;
    type: 'top' | 'flop';
}

export function RankedListClient({ movies, title, type }: RankedListClientProps) {
    return (
        <main className="min-h-screen pt-32 pb-20">
            <Container className="min-h-0 border-none">

                {/* Header */}
                <div className="flex flex-col items-start mb-16 border-b border-white/10 pb-8">
                    <span className={`uppercase tracking-[0.2em] text-xs font-bold mb-2 ${type === 'top' ? 'text-accent' : 'text-red-500'}`}>
                        {type === 'top' ? 'The Pinnacle' : 'The Depths'}
                    </span>
                    <h1 className="font-heading font-black text-6xl md:text-8xl text-foreground mb-4">
                        {title.toUpperCase()}
                    </h1>
                </div>

                {/* Editorial List */}
                <div className="grid grid-cols-1 gap-0">
                    {movies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className="group grid grid-cols-12 gap-6 items-center py-6 border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            {/* Rank */}
                            <div className="col-span-2 md:col-span-1 text-4xl md:text-6xl font-heading font-black text-white/10 group-hover:text-foreground transition-colors">
                                #{index + 1}
                            </div>

                            {/* Poster (Hidden on mobile, visible on desktop hover?) or standard small */}
                            <div className="col-span-3 md:col-span-1 relative aspect-[2/3] w-16 md:w-full bg-black/50 border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
                            </div>

                            {/* Title & Meta */}
                            <div className="col-span-5 md:col-span-8 flex flex-col justify-center">
                                <Link href={`/movies/${movie.slug}`} className="block">
                                    <h3 className="font-heading font-bold text-2xl md:text-4xl text-foreground group-hover:text-accent transition-colors">
                                        {movie.title}
                                    </h3>
                                </Link>
                                <span className="text-xs uppercase tracking-widest text-muted mt-1">
                                    {movie.director} • {movie.year}
                                </span>
                            </div>

                            {/* Score */}
                            <div className="col-span-2 md:col-span-2 text-right">
                                <span className={`font-heading font-bold text-3xl md:text-5xl ${type === 'top' ? 'text-accent' : 'text-red-500'}`}>
                                    {movie.rating}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </Container>
        </main>
    );
}
