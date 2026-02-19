'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/types';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ObsidianListRowProps {
    movie: Movie;
    index: number;
}

export function ObsidianListRow({ movie, index }: ObsidianListRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
        >
            <Link
                href={`/movies/${movie.slug}`}
                className="group flex items-center gap-6 p-4 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/5 transition-all duration-200"
            >
                {/* 1. Tiny Poster */}
                <div className="relative w-10 h-14 rounded overflow-hidden shadow-sm shrink-0">
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* 2. Title & Year (Primary) */}
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5">
                        <h3 className="font-medium text-white group-hover:text-primary transition-colors truncate">
                            {movie.title}
                        </h3>
                    </div>

                    <div className="md:col-span-1 hidden md:block">
                        <span className="text-sm text-white/40 font-mono">{movie.year}</span>
                    </div>

                    <div className="md:col-span-3 hidden md:block">
                        <span className="text-sm text-white/40 truncate block">{movie.director}</span>
                    </div>

                    <div className="md:col-span-2 hidden md:block">
                        <div className="flex flex-wrap gap-1">
                            {movie.genres?.slice(0, 2).map(genre => (
                                <span key={genre} className="text-[10px] uppercase tracking-wider text-white/30 px-1.5 py-0.5 rounded border border-white/5 bg-white/5">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                            <span className="font-bold text-sm">{movie.rating}</span>
                            <Star className="w-3 h-3 fill-yellow-500" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
