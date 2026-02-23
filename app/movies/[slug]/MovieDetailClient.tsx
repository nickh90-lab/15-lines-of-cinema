'use client';

import { useState } from 'react';
import { Movie } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, Star, Calendar, Clock, User, Award, Hash, Film, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { TrailerModal } from '@/components/movies/TrailerModal';
import { getScoreColor } from '@/lib/colors';
import { ObsidianCard } from '@/components/ObsidianCard';

// Helper for dynamic score colors

interface MovieDetailClientProps {
    movie: Movie;
    similarMovies?: Movie[];
}

export function MovieDetailClient({ movie, similarMovies = [] }: MovieDetailClientProps) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isReadingMode, setIsReadingMode] = useState(false);
    const prestigeColor = getScoreColor(movie.rating);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Helper for technical scores
    const scores = [
        { label: 'Story', value: movie.technicalScores.story },
        { label: 'Acting', value: movie.technicalScores.acting },
        { label: 'Pace', value: movie.technicalScores.pace },
        { label: 'Ending', value: movie.technicalScores.ending },
        { label: 'Originality', value: movie.technicalScores.originality },
        { label: 'Audiovisual', value: movie.technicalScores.audiovisual },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-white font-body pb-20">
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={movie.trailerUrl || ''}
            />

            {/* --- 1. IDENTITY HEADER --- */}
            <header className="relative w-full min-h-[55vh] md:min-h-[65vh] flex flex-col justify-end overflow-hidden bg-black pb-0">
                {/* Backdrop */}
                {/* Static Backdrop - No motion */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={movie.backdropUrl || movie.posterUrl}
                        alt={movie.title}
                        fill
                        priority
                        className={cn(
                            "object-cover object-center transition-opacity duration-1000",
                            isImageLoaded ? "opacity-100" : "opacity-0"
                        )}
                        sizes="100vw"
                        onLoad={() => setIsImageLoaded(true)}
                    />
                </motion.div>

                {/* Cinematic Vignette & Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_120%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                {/* Back Link */}
                <div className="absolute top-24 left-4 md:top-32 md:left-8 z-50">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                    >
                        <div className="p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md group-hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="font-heading font-medium tracking-widest text-[10px] uppercase hidden md:inline-block opacity-60">Back to Home</span>
                    </Link>
                </div>

                {/* Title & Metadata with Poster */}
                <div className="relative z-10 w-full mt-24 p-6 pt-28 pb-8 md:p-8 md:pt-40 md:pb-12 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
                    <div className="container mx-auto px-4 md:px-12 max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6 md:gap-8 items-end">
                            {/* Left: Metadata */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full"
                            >
                                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white leading-[1.1] mb-3 md:mb-4 break-words">
                                    {movie.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-base font-medium text-white/60 uppercase tracking-widest leading-relaxed">
                                    <span>{movie.year}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/30" />
                                    <span>{movie.director}</span>
                                    {movie.duration && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-white/30" />
                                            <span>{movie.duration}m</span>
                                        </>
                                    )}
                                    {movie.certification && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-white/30" />
                                            <span className="px-1.5 py-0.5 border border-white/20 rounded text-[10px] bg-white/5">{movie.certification}</span>
                                        </>
                                    )}
                                    {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-white/30" />
                                            <span className="opacity-80">{movie.spokenLanguages[0]}</span>
                                        </>
                                    )}
                                    <div className="hidden md:flex items-center gap-2 ml-4">
                                        {movie.genres.map(g => (
                                            <span key={g} className="px-2 py-0.5 rounded border border-white/10 text-[10px] bg-white/5">{g}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Cast List - Minimalist Redesign */}
                                {movie.cast && movie.cast.length > 0 && (
                                    <div className="mt-8 flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-4 group/cast">
                                        {movie.cast.slice(0, 6).map(member => (
                                            <div key={member.name} className="group/member flex items-center gap-2 md:gap-3 cursor-default transition-all duration-300 hover:!opacity-100 group-hover/cast:opacity-30">
                                                {/* Avatar */}
                                                <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10 group-hover/member:ring-white/30 transition-all duration-300">
                                                    {member.imageUrl ? (
                                                        <img
                                                            src={member.imageUrl}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover grayscale group-hover/member:grayscale-0 transition-all duration-500 will-change-filter"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-[10px] md:text-xs font-bold text-white/30 group-hover/member:text-white/60 transition-colors">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Name & Role */}
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-white/50 group-hover/member:text-white transition-colors duration-300 leading-none mb-0.5">
                                                        {member.name}
                                                    </span>
                                                    {/* Optional Role Tooltip/Subtext - Minimalist means maybe hide role or very subtle */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Right: Poster with Trailer Button */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="hidden md:flex md:flex-col md:gap-4"
                            >
                                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl border border-white/20 bg-white/5">
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className={cn(
                                            "w-full h-full object-cover transition-opacity duration-1000",
                                            isImageLoaded ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </div>
                                {movie.trailerUrl && (
                                    <button
                                        onClick={() => setIsTrailerOpen(true)}
                                        className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        <Play className="w-3 h-3 fill-black group-hover:scale-110 transition-transform" />
                                        Watch Trailer
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>


            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* --- 2. THE VERDICT BAND (Sticky) --- */}
            <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl shadow-2xl border-b border-white/5">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl h-auto md:h-24 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">

                    {/* Score (Left) */}
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            {/* Inner Glow/Glow Behind */}
                            <motion.div
                                animate={{
                                    opacity: movie.rating >= 8.5 ? [0.3, 0.6, 0.3] : 0,
                                    scale: movie.rating >= 8.5 ? [1, 1.05, 1] : 1
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: movie.rating >= 8.5 ? Infinity : 0,
                                    ease: "easeInOut"
                                }}
                                className="absolute -inset-2 rounded-xl blur-2xl transition-all duration-500"
                                style={{ backgroundColor: prestigeColor.glow }}
                            />

                            {/* Signature Line Design (Final) */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-1.5 h-12 md:h-16 rounded-full"
                                    style={{ backgroundColor: prestigeColor.primary }}
                                />
                                <span
                                    className="font-black text-6xl md:text-7xl tracking-tighter leading-none transition-colors duration-500"
                                    style={{ color: prestigeColor.primary }}
                                >
                                    {movie.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span
                                className="text-[11px] font-black uppercase tracking-[0.4em] leading-none transition-colors duration-500"
                                style={{ color: getScoreColor(movie.rating).primary }}
                            >
                                The Score
                            </span>
                        </div>
                    </div>

                    {/* Tech Specs (Middle) */}
                    <div className="flex flex-1 w-full md:w-auto items-center justify-start md:justify-center gap-4 md:gap-8 lg:gap-14 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 md:px-0 scrollbar-hide snap-x">
                        {scores.map((score, i) => {
                            const colors = getScoreColor(movie.rating); // Use overall rating colors
                            return (
                                <div key={score.label} className="flex flex-col gap-2.5 min-w-[5rem] md:w-32 snap-center first:pl-2 last:pr-2">
                                    <div className="flex justify-between items-end text-[10px] uppercase font-black tracking-[0.2em]">
                                        <span className="text-white/40">{score.label}</span>
                                        <span
                                            className="text-[13px] leading-none font-black drop-shadow-sm transition-colors duration-500"
                                            style={{ color: colors.primary }}
                                        >
                                            {score.value}
                                        </span>
                                    </div>
                                    <div className="h-[4px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            whileInView={{ width: `${score.value * 10}%`, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: 0.4 + (i * 0.15), ease: [0.22, 1, 0.36, 1] }}
                                            className="h-full relative overflow-visible"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-90`} />
                                            {/* Glow Tip */}
                                            {score.value >= 8.5 && (
                                                <div
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 blur-md rounded-full transition-colors duration-500"
                                                    style={{ backgroundColor: colors.primary }}
                                                />
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- 3. CONTENT BODY (Side-by-Side Layout) --- */}
            <main className="container mx-auto px-6 md:px-12 py-16 md:py-24 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">

                    {/* LEFT: SYNOPSIS SIDEBAR */}
                    <aside>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:sticky lg:top-32"
                        >
                            <div className="p-7 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
                                <h3 className="text-sm font-medium uppercase tracking-[0.3em] text-white/20 mb-6 font-sans">
                                    Synopsis
                                </h3>
                                <p className="text-sm md:text-base text-white/50 font-sans leading-relaxed tracking-wide whitespace-pre-wrap">
                                    {movie.plot || movie.reviewShort || "No plot summary available."}
                                </p>
                            </div>
                        </motion.div>
                    </aside>

                    {/* RIGHT: THE REVIEW */}
                    <motion.div
                        layout
                        className={cn(
                            "space-y-12 transition-all duration-700",
                            isReadingMode ? "lg:col-span-2 lg:max-w-4xl lg:mx-auto w-full" : ""
                        )}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-sm font-medium tracking-[0.3em] uppercase text-white/40 font-sans">
                                The Review
                            </h2>
                            <button
                                onClick={() => setIsReadingMode(!isReadingMode)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-medium tracking-widest uppercase",
                                    isReadingMode
                                        ? "bg-white text-black border-white"
                                        : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                                )}
                            >
                                <span className="font-serif italic text-sm">Aa</span>
                                <span>Reading Mode</span>
                            </button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            layout
                        >
                            <div className="prose prose-invert max-w-none">
                                {movie.review15Lines && movie.review15Lines.length > 0 ? (
                                    <div className="space-y-8">
                                        {(() => {
                                            const paragraphs: string[][] = [[]];
                                            movie.review15Lines!.forEach(line => {
                                                if (line.trim() === "") {
                                                    if (paragraphs[paragraphs.length - 1].length > 0) {
                                                        paragraphs.push([]);
                                                    }
                                                } else {
                                                    paragraphs[paragraphs.length - 1].push(line);
                                                }
                                            });

                                            return paragraphs.map((p, i) => {
                                                const paragraphText = p.join(" ");
                                                if (i === 0 && paragraphText.length > 0) {
                                                    const firstChar = paragraphText.charAt(0);
                                                    const restOfText = paragraphText.slice(1);
                                                    return (
                                                        <motion.p layout key={i} className={cn(
                                                            "text-white/75 font-serif tracking-wide transition-all duration-700",
                                                            isReadingMode ? "text-xl md:text-2xl lg:text-3xl leading-loose" : "text-lg md:text-xl leading-loose"
                                                        )}>
                                                            <span
                                                                className={cn(
                                                                    "float-left font-bold mr-4 mt-2 transition-all duration-700 select-none opacity-80",
                                                                    isReadingMode ? "text-7xl md:text-8xl" : "text-6xl md:text-7xl"
                                                                )}
                                                                style={{ color: prestigeColor.primary, lineHeight: 0.9, fontFamily: 'var(--font-serif)' }}
                                                            >
                                                                {firstChar}
                                                            </span>
                                                            {restOfText}
                                                        </motion.p>
                                                    );
                                                }
                                                return (
                                                    <motion.p layout key={i} className={cn(
                                                        "text-white/60 font-serif tracking-wide transition-all duration-700",
                                                        isReadingMode ? "text-xl md:text-2xl lg:text-3xl leading-loose" : "text-lg md:text-xl leading-loose"
                                                    )}>
                                                        {paragraphText}
                                                    </motion.p>
                                                );
                                            });
                                        })()}
                                    </div>
                                ) : (
                                    <p className="text-xl text-gray-500 italic p-8 border border-white/10 rounded-xl leading-relaxed font-serif whitespace-pre-wrap">
                                        {movie.reviewLong || "No review content available."}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            {/* --- 4. SIMILAR MOVIES --- */}
            {
                similarMovies.length > 0 && (
                    <section className="max-w-5xl mx-auto px-6 py-12 md:py-16 border-t border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/30 font-sans">
                                    Discovery
                                </h2>
                                <h3 className="text-xl md:text-2xl font-black font-heading tracking-tight italic text-white/80">
                                    Similar Movies
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                            {similarMovies.map((m, idx) => (
                                <motion.div
                                    key={m.slug}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                >
                                    <ObsidianCard movie={m} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )
            }
        </div >
    );
}
