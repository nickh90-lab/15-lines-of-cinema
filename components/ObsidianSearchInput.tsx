'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObsidianSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ObsidianSearchInput({ value, onChange, className }: ObsidianSearchInputProps) {
    return (
        <div className={cn("relative group", className)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 text-white placeholder:text-white/30 rounded-full py-2.5 pl-10 pr-10 outline-none backdrop-blur-md transition-all focus:bg-white/10 text-sm font-medium"
            />

            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Glow Effect on Focus */}
            <div className="absolute inset-0 rounded-full ring-1 ring-white/0 group-focus-within:ring-white/20 pointer-events-none transition-all duration-500" />
        </div>
    );
}
