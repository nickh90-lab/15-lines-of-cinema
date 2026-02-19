'use client';

import Link from 'next/link';
import { Movie } from '@/lib/types';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieCardProps {
    movie: Movie;
    featured?: boolean;
}

export function MovieCard({ movie, featured = false }: MovieCardProps) {
    return (
        <Link href={`/movies/${movie.slug}`} className="group block relative">
            {/* Poster (We apply shadow to a pseudo or separate element to avoid clipping if overflow hidden, but here simple shadow on container works if overflow visible? 
                 Actually overflow-hidden clips shadow. Move shadow to wrapper? 
                 Or simply use the group-hover logic on a parent wrapper if needed.
                 Wait, previous code had overflow-hidden.
                 Let's apply the shadow to the wrapper LINK actually, or use an absolute glow behind.
                 Reverting to simpler logic: The previous code had shadow on the div with overflow-hidden, which actually CLIPS the shadow.
                 I will add a glow element BEHIND it.
                 */}
            <div className="absolute -inset-4 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* Image Container */}
            <div className={cn(
                "relative aspect-[2/3] rounded-3xl overflow-hidden bg-card transition-all duration-500 ease-out border border-white/5 group-hover:scale-[1.02]",
            )}
                style={{

                }}
            >
                {/* Poster */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                />

                {/* Glass Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <Play className="w-5 h-5 fill-current ml-1" />
                        </div>
                        <h3 className="font-heading font-bold text-lg text-foreground leading-tight mb-1">
                            {movie.title}
                        </h3>
                        <p className="text-sm text-accent font-medium">
                            {movie.year} • {movie.rating}/10
                        </p>
                    </div>
                </div>

                {/* Corner Rating (Glass Pill) */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                    ★ {movie.rating}
                </div>
            </div>
        </Link>
    );
}
