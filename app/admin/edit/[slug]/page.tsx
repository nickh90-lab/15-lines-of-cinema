'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Movie, TechnicalScores } from '@/lib/types';
import { GENRES } from '@/lib/constants';
import { getYouTubeEmbedUrl } from '@/lib/utils';
import Link from 'next/link';
import { LivePreview } from '@/components/admin/LivePreview';

export default function EditMoviePage() {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Movie>>({});
    const [reviewText, setReviewText] = useState('');

    const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setReviewText(text);

        // Split into paragraphs first (by double newlines)
        const paragraphs = text.split(/\n\s*\n/);
        const allLines: string[] = [];

        paragraphs.forEach((p, i) => {
            // Split paragraph into sentences
            const sentences = p.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [];
            allLines.push(...sentences);
            // Add divider (empty string) between paragraphs, but not after the last one
            if (i < paragraphs.length - 1) {
                allLines.push("");
            }
        });

        setFormData(prev => ({
            ...prev,
            review15Lines: allLines
        }));
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`/api/movies/${slug}`);
                if (!res.ok) throw new Error('Failed to fetch movie');
                const data = await res.json();
                // Ensure new fields exist for legacy data
                const defaults = { story: 0, acting: 0, pace: 0, ending: 0, originality: 0, audiovisual: 0 };
                const mergedScores = { ...defaults, ...data.technicalScores };

                const cleanScores = {
                    story: mergedScores.story,
                    acting: mergedScores.acting,
                    pace: mergedScores.pace || 5,
                    ending: mergedScores.ending || 5,
                    originality: mergedScores.originality || 5,
                    audiovisual: mergedScores.audiovisual || 0
                };

                setFormData({ ...data, technicalScores: cleanScores });

                // Initialize review text from 15 lines array
                if (data.review15Lines && Array.isArray(data.review15Lines)) {
                    setReviewText(data.review15Lines.join(' '));
                }
            } catch (error) {
                console.error(error);
                alert('Error loading movie data');
                router.push('/admin');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchMovie();
    }, [slug, router]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name.startsWith('tech_')) {
            const key = name.replace('tech_', '') as keyof TechnicalScores;
            const newValue = Number(value);

            setFormData(prev => {
                const newTechScores = {
                    ...prev.technicalScores!,
                    [key]: newValue
                };

                // Calculate average
                const scores = Object.values(newTechScores);
                const sum = scores.reduce((a, b) => a + b, 0);
                const avg = sum / scores.length; // Use length in case we add more scores later
                const roundedAvg = Math.round(avg * 10) / 10;

                return {
                    ...prev,
                    technicalScores: newTechScores,
                    rating: roundedAvg
                };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
        }
    };

    const handleRemoveCast = (index: number) => {
        setFormData(prev => ({
            ...prev,
            cast: prev.cast?.filter((_, i) => i !== index)
        }));
    };

    const handleGenreToggle = (value: string) => {
        setFormData(prev => {
            const current = prev.genres || [];
            return {
                ...prev,
                genres: current.includes(value)
                    ? current.filter(item => item !== value)
                    : [...current, value]
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Re-generate slug if title changed
            const newSlug = formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || slug;

            // Ensure rating is exactly the average of technical scores
            let finalRating = formData.rating;
            if (formData.technicalScores) {
                const scores = formData.technicalScores;
                // Check if all required scores exist before calculating
                if (scores.story !== undefined && scores.acting !== undefined && scores.pace !== undefined &&
                    scores.ending !== undefined && scores.originality !== undefined && scores.audiovisual !== undefined) {
                    const rating = (scores.story + scores.acting + scores.pace + scores.ending + scores.originality + scores.audiovisual) / 6;
                    finalRating = Math.round(rating * 10) / 10;
                } else {
                    console.warn("Missing technical scores for rating calculation. Using existing rating.");
                }
            }

            const payload = {
                ...formData,
                trailerUrl: getYouTubeEmbedUrl(formData.trailerUrl || ''),
                rating: finalRating,
                slug: newSlug
            };

            const res = await fetch(`/api/movies/${slug}`, { // PUT to original slug
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                const errorData = await res.json();
                alert(`Error updating movie: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Network error updating movie: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white/[0.05] border border-white/5 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-accent/50 outline-none focus:ring-4 focus:ring-accent/5 transition-all duration-300";
    const labelClass = "block text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 ml-1";

    if (initialLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-heading">Edit Movie: {formData.title}</h1>
                <Link href="/admin" className="text-gray-400 hover:text-white">Cancel</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white/[0.03] p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-heading font-black mb-8 text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Basic Info
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Director</label>
                                <input name="director" value={formData.director} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Year</label>
                                <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Rating (Auto-calculated)</label>
                                <input type="number" step="0.1" name="rating" value={formData.rating} readOnly disabled className={`${inputClass} opacity-50 cursor-not-allowed border-dashed`} />
                            </div>
                        </div>
                    </section>

                    {/* Media */}
                    <section className="bg-white/[0.03] p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-heading font-black mb-8 text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Media Assets
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className={labelClass}>Poster URL</label>
                                <input name="posterUrl" value={formData.posterUrl} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Backdrop URL (Optional)</label>
                                <input name="backdropUrl" value={formData.backdropUrl} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Trailer URL (YouTube Link)</label>
                                <input name="trailerUrl" value={formData.trailerUrl || ''} onChange={handleChange} className={inputClass} placeholder="e.g. https://www.youtube.com/watch?v=..." />
                            </div>
                        </div>
                    </section>

                    {/* Cast */}
                    <section className="bg-white/[0.03] p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-heading font-black mb-8 text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Ensemble Cast
                        </h2>
                        <div className="space-y-4">
                            {formData.cast?.map((member, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        {member.imageUrl && (
                                            <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover grayscale brightness-75 transition-all hover:grayscale-0" />
                                        )}
                                        <div>
                                            <div className="text-white font-bold">{member.name}</div>
                                            <div className="text-xs text-white/40 uppercase tracking-widest">{member.role}</div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveCast(index)} className="p-2 text-white/20 hover:text-red-400 transition-colors">
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {(!formData.cast || formData.cast.length === 0) && (
                                <div className="text-white/20 italic text-sm p-4 border border-dashed border-white/10 rounded-2xl text-center">
                                    No cast members added yet. Fetch from IMDb to populate.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Story & Review */}
                    <section className="bg-white/[0.03] p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-heading font-black mb-8 text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Editorial Content
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>Plot Summary (For Sidebar)</label>
                                <textarea name="plot" value={formData.plot || ''} onChange={handleChange} className={`${inputClass} font-sans text-sm`} rows={4} placeholder="Brief plot synopsis..." />
                            </div>
                            <div>
                                <label className={labelClass}>Short Review (Punchline)</label>
                                <textarea name="reviewShort" value={formData.reviewShort} onChange={handleChange} className={inputClass} rows={2} required />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>The 15 Lines (Main Review)</label>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const sentenceCount = (formData.review15Lines?.filter(line => line.trim() !== '') || []).length;
                                            return (
                                                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-black/40 border ${sentenceCount === 15 ? 'text-green-500 border-green-500/20' : 'text-red-500 border-red-500/20'}`}>
                                                    {sentenceCount}/15 SENTENCES
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <textarea
                                    name="review15Lines"
                                    value={reviewText}
                                    onChange={handleReviewTextChange}
                                    className={`${inputClass} font-serif text-lg leading-relaxed ${(formData.review15Lines?.length || 0) === 15 ? 'border-green-500/40' : 'border-red-900/40'}`}
                                    rows={18}
                                    placeholder="Write exactly 15 sentences. The system will count sentences ending in . ! or ?"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Categorization */}
                    <section className="bg-white/[0.03] p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-heading font-black mb-8 text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Curated Genres
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => handleGenreToggle(g)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${formData.genres?.includes(g) ? 'bg-white text-black border-white shadow-lg' : 'bg-transparent text-white/30 border-white/10 hover:border-white/30'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Technical Scores */}
                    <section className="bg-white/[0.03] p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                        <h2 className="text-xl font-heading font-black mb-8 text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Technical Breakdown
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Story', key: 'story' },
                                { label: 'Acting', key: 'acting' },
                                { label: 'Pace', key: 'pace' },
                                { label: 'Ending', key: 'ending' },
                                { label: 'Originality', key: 'originality' },
                                { label: 'Audiovisual', key: 'audiovisual' },
                            ].map((score) => (
                                <div key={score.key}>
                                    <div className="flex justify-between mb-3">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">{score.label}</label>
                                        <span className="font-black text-accent">{formData.technicalScores![score.key as keyof TechnicalScores]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        name={`tech_${score.key}`}
                                        value={formData.technicalScores![score.key as keyof TechnicalScores]}
                                        onChange={handleChange}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-end gap-6 pt-8">
                        <Link href="/admin" className="px-8 py-4 rounded-2xl text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
                            Discard Changes
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || (formData.review15Lines?.filter(line => line.trim() !== '') || []).length !== 15}
                            className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/80 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                        >
                            {loading ? 'Saving...' : 'Save & Publish'}
                        </button>
                    </div>
                </form>

                {/* Right Sidebar: Live Preview */}
                <div className="hidden lg:block">
                    <LivePreview movie={formData} />
                </div>
            </div>
        </div>
    );
}
