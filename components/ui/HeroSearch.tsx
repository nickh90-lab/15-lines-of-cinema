'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '@/lib/types';
import Link from 'next/link';

interface HeroSearchProps {
    onSearch?: (query: string) => void;
    movies?: Movie[];
}

export function HeroSearch({ onSearch, movies = [] }: HeroSearchProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Minimal Suggestions Logic
    const suggestions = query.length > 0 ? movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.director.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) : [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (onSearch) onSearch(val);
    }

    return (
        <div className="w-full relative z-20">
            <form onSubmit={(e) => e.preventDefault()} className="relative group">
                {/* Minimal Underlined Input */}
                <div className={`
                    relative flex items-center border-b border-muted py-4 transition-colors duration-300
                    ${isFocused ? 'border-foreground' : 'hover:border-white/40'}
                `}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        className="w-full bg-transparent border-none p-0 text-xl font-heading font-bold text-foreground placeholder-muted focus:ring-0 focus:outline-none"
                        placeholder="SEARCH THE ARCHIVE..."
                    />
                    <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-accent' : 'text-muted'}`} />
                </div>

                {/* Editorial Suggestions List */}
                <AnimatePresence>
                    {isFocused && query.length > 0 && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 bg-background border border-white/10 mt-2 shadow-2xl z-50"
                        >
                            <div className="py-0">
                                {suggestions.map(movie => (
                                    <Link key={movie.id} href={`/movies/${movie.slug}`} className="block border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <div className="flex justify-between items-center px-6 py-4 group">
                                            <div>
                                                <h4 className="text-foreground font-heading font-bold text-lg group-hover:text-accent transition-colors">
                                                    {movie.title}
                                                </h4>
                                                <span className="text-xs uppercase tracking-widest text-muted">
                                                    {movie.director} • {movie.year}
                                                </span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
