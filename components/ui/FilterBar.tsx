'use client';

import { motion } from 'framer-motion';

interface FilterBarProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
    const filters = [
        { id: 'all', label: 'All Movies' },
        { id: 'new', label: 'New Arrivals' },
        { id: 'top-50', label: 'Top 50' },
        { id: 'flop-50', label: 'Flop 50' },
    ];

    return (
        <div className="flex flex-wrap items-center gap-8 mb-12 border-b border-white/10 pb-4">
            <span className="text-xs uppercase tracking-widest text-muted font-bold mr-4">Filter By:</span>
            {filters.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`
                            relative text-sm font-medium tracking-widest uppercase transition-colors duration-300
                            ${isActive ? 'text-accent' : 'text-muted hover:text-foreground'}
                        `}
                    >
                        {filter.label}
                        {isActive && (
                            <motion.div
                                layoutId="activeFilterUnderline"
                                className="absolute -bottom-[17px] left-0 right-0 h-[1px] bg-accent"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
