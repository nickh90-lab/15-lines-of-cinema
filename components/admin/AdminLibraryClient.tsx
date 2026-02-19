'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Eye, Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { DeleteButton } from './DeleteButton';
import { Movie } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLibraryClientProps {
    initialMovies: Movie[];
}

export function AdminLibraryClient({ initialMovies }: AdminLibraryClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredMovies = useMemo(() => {
        return initialMovies.filter(movie => {
            const searchLower = searchQuery.toLowerCase();
            return (
                movie.title.toLowerCase().includes(searchLower) ||
                movie.director.toLowerCase().includes(searchLower) ||
                movie.genres.some(g => g.toLowerCase().includes(searchLower))
            );
        });
    }, [initialMovies, searchQuery]);

    return (
        <div className="space-y-8">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.03] backdrop-blur-md p-4 rounded-[32px] border border-white/5">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search by title, director, or genre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid'
                                ? 'bg-accent text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                : 'text-white/40 hover:text-white'
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list'
                                ? 'bg-accent text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                : 'text-white/40 hover:text-white'
                                }`}
                            title="List View"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center px-4">
                <p className="text-sm text-white/40">
                    Showing <span className="text-white font-bold">{filteredMovies.length}</span> of {initialMovies.length} movies
                </p>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-accent hover:underline uppercase tracking-widest font-bold"
                    >
                        Clear Search
                    </button>
                )}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="popLayout">
                {viewMode === 'grid' ? (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredMovies.map((movie) => (
                            <motion.div
                                layout
                                key={movie.id}
                                className="group relative bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500"
                            >
                                {/* Poster Area (Same as existing) */}
                                <div className="relative aspect-[2/3] w-full overflow-hidden">
                                    <Image
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                        <Link href={`/movies/${movie.slug}`} target="_blank" className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="View">
                                            <Eye className="w-6 h-6" />
                                        </Link>
                                        <Link href={`/admin/edit/${movie.slug}`} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="Edit">
                                            <Edit className="w-6 h-6" />
                                        </Link>
                                        <div className="p-1">
                                            <DeleteButton slug={movie.slug} />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                            <span className="font-black text-sm text-accent">{movie.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-heading font-black text-xl tracking-tight truncate flex-1">{movie.title}</h3>
                                        <span className="text-xs text-white/40 ml-2 mt-1">{movie.year}</span>
                                    </div>
                                    <p className="text-sm text-white/50 truncate mb-4">{movie.director}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-green-500/80 px-2 py-0.5 rounded border border-green-500/20 bg-green-500/5">Published</span>
                                        <div className="flex gap-1.5">
                                            {movie.genres.slice(0, 2).map((genre, i) => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden"
                    >
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Movie</th>
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-white/20 font-bold text-center">Year</th>
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-white/20 font-bold text-center">Rating</th>
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMovies.map((movie) => (
                                    <tr key={movie.id} className="group hover:bg-white/[0.02] transition-all">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 group-hover:border-accent/40 transition-colors">
                                                    <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" unoptimized />
                                                </div>
                                                <div>
                                                    <h4 className="font-heading font-black text-lg group-hover:text-accent transition-colors">{movie.title}</h4>
                                                    <p className="text-xs text-white/40">{movie.director}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center text-white/60 font-medium">{movie.year}</td>
                                        <td className="p-6 text-center">
                                            <span className="text-accent font-black">{movie.rating.toFixed(1)}</span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/movies/${movie.slug}`} target="_blank" className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <Link href={`/admin/edit/${movie.slug}`} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <DeleteButton slug={movie.slug} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredMovies.length === 0 && (
                <div className="text-center py-20 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
                    <div className="text-white/20 mb-4">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-heading font-black text-white/40">No movies found</h3>
                        <p className="text-sm">Try adjusting your search query</p>
                    </div>
                </div>
            )}
        </div>
    );
}
