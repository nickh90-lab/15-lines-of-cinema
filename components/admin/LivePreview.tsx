'use client';

import { Movie } from '@/lib/types';
import { getScoreColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LivePreviewProps {
    movie: Partial<Movie>;
}

export function LivePreview({ movie }: LivePreviewProps) {
    const prestigeColor = getScoreColor(movie.rating || 0);

    return (
        <div className="sticky top-8 bg-black border border-white/5 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-8rem)]">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Editorial Live Preview</span>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>

            {/* Scrollable Preview Area */}
            <div className="flex-1 overflow-auto bg-black p-8 custom-scrollbar">
                {/* Score Signature (Mini) */}
                <div className="mb-12">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-1 h-8 rounded-full"
                            style={{ backgroundColor: prestigeColor.primary }}
                        />
                        <span
                            className="text-4xl font-black tracking-tighter"
                            style={{ color: prestigeColor.primary }}
                        >
                            {(movie.rating || 0).toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Hybrid Layout Content */}
                <div className="space-y-12">
                    {/* Synopsis (Ghost Card Style) */}
                    <div className="p-5 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-3 font-sans">Synopsis</h4>
                        <p className="text-xs text-white/40 font-sans leading-relaxed">
                            {movie.plot || movie.reviewShort || "Drafting summary..."}
                        </p>
                    </div>

                    {/* The Review (Editorial Serif) */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 font-sans">The Review</h4>
                        <div className="space-y-4">
                            {(movie.review15Lines || []).filter(l => l.trim() !== '').length > 0 ? (
                                (() => {
                                    // Simulated paragraph logic
                                    const lines = movie.review15Lines!.filter(l => l.trim() !== '');
                                    const paragraphs: string[][] = [[]];
                                    lines.forEach((line, index) => {
                                        paragraphs[paragraphs.length - 1].push(line);
                                        if ((index + 1) % 5 === 0 && index !== lines.length - 1) {
                                            paragraphs.push([]);
                                        }
                                    });

                                    return paragraphs.map((p, i) => {
                                        const text = p.join(" ");
                                        if (i === 0) {
                                            const firstChar = text.charAt(0);
                                            const rest = text.slice(1);
                                            return (
                                                <p key={i} className="text-sm text-white/70 font-serif leading-relaxed">
                                                    <span
                                                        className="float-left text-4xl font-bold mr-2 mt-1"
                                                        style={{ color: prestigeColor.primary }}
                                                    >
                                                        {firstChar}
                                                    </span>
                                                    {rest}
                                                </p>
                                            );
                                        }
                                        return (
                                            <p key={i} className="text-sm text-white/70 font-serif leading-relaxed">
                                                {text}
                                            </p>
                                        );
                                    });
                                })()
                            ) : (
                                <p className="text-sm text-white/20 italic font-serif">Write your 15 lines of cinema to see the preview...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
