'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Movie } from '@/lib/types'; // Make sure this path is correct
import { ObsidianSearchInput } from './ObsidianSearchInput';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ObsidianHeaderProps {
    allMovies: Movie[];
}

export function ObsidianHeader({ allMovies }: ObsidianHeaderProps) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Detect scroll to add background blur/opacity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter Logic
    const filteredMovies = searchQuery
        ? allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.year.toString().includes(searchQuery)
        ).slice(0, 5) // Limit to 5 results for dropdown
        : [];

    const handleSelectResult = (slug: string) => {
        setSearchQuery('');
        setIsFocused(false);
        router.push(`/movies/${slug}`);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
                scrolled ? "bg-black/60 backdrop-blur-xl border-white/5 py-3" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-[1400px] mx-auto px-6 h-12 flex items-center justify-end relative">
                {/* Logo Area */}
                {/* Logo Area Removed to avoid duplication with Navbar */}
                <div />

                {/* Search Interaction */}
                <div className="w-[160px] sm:w-[300px] md:w-full max-w-md relative" ref={dropdownRef}>
                    <div onFocus={() => setIsFocused(true)}>
                        <ObsidianSearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            className={cn(
                                "transition-all duration-300",
                                scrolled ? "scale-95 origin-right" : ""
                            )}
                        />
                    </div>

                    {/* Live Search Dropdown */}
                    <AnimatePresence>
                        {searchQuery && isFocused && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full right-0 w-[calc(100vw-3rem)] sm:w-full sm:left-0 mt-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-50 p-2"
                            >
                                {filteredMovies.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {filteredMovies.map(movie => (
                                            <button
                                                key={movie.id}
                                                onClick={() => handleSelectResult(movie.slug)}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-colors group text-left w-full"
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                                    <Image
                                                        src={movie.posterUrl}
                                                        alt={movie.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-medium truncate group-hover:text-primary transition-colors">{movie.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                                                        <span>{movie.year}</span>
                                                        <span>•</span>
                                                        <span>{movie.director}</span>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1 text-yellow-500 px-3">
                                                    <span className="font-semibold text-sm">{movie.rating}</span>
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-white/40 text-sm">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
