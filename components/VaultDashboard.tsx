'use client';

import { useState } from 'react';
import { Movie } from '@/lib/types';
import { GENRES } from '@/lib/constants';
import { ObsidianHeader } from './ObsidianHeader';
import { ObsidianHero } from './ObsidianHero';
import { VaultGrid } from './VaultGrid';
import { VaultCarousel } from './VaultCarousel';
import { ObsidianListRow } from './ObsidianListRow';
import { ObsidianCard } from './ObsidianCard';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, List as ListIcon, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VaultDashboardProps {
    allMovies: Movie[];
}

export function VaultDashboard({ allMovies }: VaultDashboardProps) {
    const [visibleCount, setVisibleCount] = useState(12);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    // CATEGORIES LOGIC

    // 1. New Arrivals (Date Descending)
    const sortedByDate = [...allMovies].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
    });
    const newArrivals = sortedByDate.slice(0, 20); // Top 20 for carousel

    // 2. Tops (Rating Descending)
    const tops = [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 20); // Top 20

    // 3. Flops (Rating Ascending - lowest first)
    // Filter out 0 ratings if you want to avoid unrated, but let's assume they are rated.
    const flops = [...allMovies].sort((a, b) => a.rating - b.rating).filter(m => m.rating < 6).slice(0, 20);

    // 4. All Movies (Library) - Filtered & Sorted
    // SORTING & FILTERING STATE
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortBy, setSortBy] = useState('date'); // 'date', 'year', 'rating', 'alphabetical'
    const [searchQuery, setSearchQuery] = useState('');

    // Filter
    let processedMovies = [...allMovies];

    // 1. Genre Filter
    if (selectedGenre !== 'All') {
        processedMovies = processedMovies.filter(m => m.genres?.includes(selectedGenre));
    }

    // 2. Search Filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        processedMovies = processedMovies.filter(m =>
            m.title.toLowerCase().includes(query) ||
            m.director.toLowerCase().includes(query)
        );
    }

    // Sort
    processedMovies.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            case 'year':
                return b.year - a.year;
            case 'rating':
                return b.rating - a.rating;
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    const allMoviesList = processedMovies.slice(0, visibleCount);
    const hasMore = visibleCount < processedMovies.length;

    return (
        <div className="min-h-screen pb-20">
            {/* The Glass Header (Now handles search internally) */}
            <ObsidianHeader allMovies={allMovies} />

            {/* HERO Section */}
            {sortedByDate.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                >
                    <ObsidianHero movie={sortedByDate[0]} />
                </motion.div>
            )}

            {/* Content Area */}
            <div className="relative z-10 min-h-[50vh] pt-24 md:pt-12">
                {/* Default Dashboard View */}
                {allMovies.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="-mt-12 relative z-20 space-y-4"
                    >
                        <VaultCarousel title="New Arrivals" movies={newArrivals} />

                        <VaultCarousel title="Top Rated" movies={tops} />

                        {flops.length > 0 && (
                            <VaultCarousel title="Bottom Rated" movies={flops} />
                        )}

                        {/* All Movies Section (Custom Grid for Load More) */}
                        <section className="py-12 px-6 max-w-[1400px] mx-auto border-t border-white/5 mt-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <h2 className="text-xl font-semibold text-white tracking-tight">All Movies</h2>

                                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                    {/* Search Input */}
                                    <div className="relative group w-full sm:w-auto">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-white/40 group-focus-within:text-white transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search movies..."
                                            aria-label="Search movies"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-black/40 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all placeholder:text-white/20"
                                        />
                                    </div>

                                    <div className="flex gap-4 w-full sm:w-auto">
                                        {/* Sort Dropdown */}
                                        <div className="relative w-full sm:w-auto">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                aria-label="Sort movies by"
                                                className="w-full sm:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                                                style={{ backgroundImage: 'none' }}
                                            >
                                                <option value="date">Latest Added</option>
                                                <option value="year">Release Year</option>
                                                <option value="rating">Highest Rated</option>
                                                <option value="alphabetical">A-Z</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                        </div>

                                        {/* View Toggle */}
                                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5 ml-auto sm:ml-0">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={cn(
                                                    "p-2 rounded-md transition-all",
                                                    viewMode === 'grid' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"
                                                )}
                                                title="Grid View"
                                                aria-label="Grid View"
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={cn(
                                                    "p-2 rounded-md transition-all",
                                                    viewMode === 'list' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/60"
                                                )}
                                                title="List View"
                                                aria-label="List View"
                                            >
                                                <ListIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Genre Pills - Horizontal Scroll */}
                            <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedGenre('All')}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                            selectedGenre === 'All'
                                                ? "bg-white text-black"
                                                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        All Genres
                                    </button>
                                    {GENRES.map(genre => (
                                        <button
                                            key={genre}
                                            onClick={() => setSelectedGenre(genre)}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                                selectedGenre === genre
                                                    ? "bg-white text-black"
                                                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                    <AnimatePresence mode='popLayout'>
                                        {allMoviesList.map((movie) => (
                                            <motion.div
                                                key={movie.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ObsidianCard movie={movie} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {/* Optional Header Row for List */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-xs font-medium uppercase tracking-wider text-white/20 pl-[72px]">
                                        <div className="col-span-5">Title</div>
                                        <div className="col-span-1">Year</div>
                                        <div className="col-span-3">Director</div>
                                        <div className="col-span-2">Genre</div>
                                        <div className="col-span-1 text-right">Rating</div>
                                    </div>
                                    <div className="space-y-1">
                                        <AnimatePresence mode='popLayout'>
                                            {allMoviesList.map((movie, index) => (
                                                <motion.div
                                                    key={movie.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ObsidianListRow movie={movie} index={index} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {/* Load More Trigger */}
                            {hasMore && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-colors"
                                    >
                                        Load More Movies
                                    </button>
                                </div>
                            )}

                            {processedMovies.length === 0 && (
                                <div className="py-20 text-center text-white/40">
                                    <p>No movies found matching your filters.</p>
                                </div>
                            )}
                        </section>
                    </motion.div>
                ) : (
                    <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-md"
                        >
                            <h2 className="text-4xl font-heading font-black tracking-tight text-white mb-4">Your Vault is Empty</h2>
                            <p className="text-white/40 text-lg mb-8">Start your cinematic journey by adding your first review.</p>
                            <Link
                                href="/admin/add"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First Movie
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
