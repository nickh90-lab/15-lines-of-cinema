import fs from 'fs/promises';
import path from 'path';
import { Movie } from './types';
import { PrismaClient } from '@prisma/client';

// Global Prisma instance to prevent multiple connections in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const dataPath = path.join(process.cwd(), 'data/movies.json');

export async function getMovies(): Promise<Movie[]> {
    // 1. Try Database (if configured)
    if (process.env.POSTGRES_PRISMA_URL) {
        try {
            const movies = await prisma.movie.findMany({
                orderBy: { createdAt: 'desc' }
            });
            // Map Prisma model back to our Type (handle JSON fields if any)
            return movies.map(m => ({
                ...m,
                duration: m.duration ?? undefined,
                certification: m.certification ?? undefined,
                backdropUrl: m.backdropUrl ?? undefined,
                reviewLong: m.reviewLong ?? '', // Required string in types.ts
                plot: m.plot ?? undefined,
                trailerUrl: m.trailerUrl ?? undefined,
                cast: m.cast ? JSON.parse(JSON.stringify(m.cast)) : [],
                technicalScores: {
                    story: m.storyScore,
                    acting: m.actingScore,
                    pace: m.paceScore,
                    ending: m.endingScore,
                    originality: m.originalityScore
                },
                releaseDate: m.createdAt.toISOString(), // Or separate field if we added it, but type requires it
                createdAt: m.createdAt.toISOString()
            }));
        } catch (e) {
            console.error("DB Error, falling back to FS", e);
        }
    }

    // 2. Fallback to Filesystem
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading movies:', error);
        return [];
    }
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
    // 1. Try Database
    if (process.env.POSTGRES_PRISMA_URL) {
        try {
            const movie = await prisma.movie.findUnique({ where: { slug } });
            if (movie) {
                return {
                    ...movie,
                    duration: movie.duration ?? undefined,
                    certification: movie.certification ?? undefined,
                    backdropUrl: movie.backdropUrl ?? undefined,
                    reviewLong: movie.reviewLong ?? '', // Required string
                    plot: movie.plot ?? undefined,
                    trailerUrl: movie.trailerUrl ?? undefined,
                    cast: movie.cast ? JSON.parse(JSON.stringify(movie.cast)) : [],
                    technicalScores: {
                        story: movie.storyScore,
                        acting: movie.actingScore,
                        pace: movie.paceScore,
                        ending: movie.endingScore,
                        originality: movie.originalityScore
                    },
                    releaseDate: movie.createdAt.toISOString(),
                    createdAt: movie.createdAt.toISOString()
                };
            }
        } catch (e) {
            console.error("DB Error, falling back to FS", e);
        }
    }

    // 2. Fallback to Filesystem
    const movies = await getMovies(); // This will eventually fallback to FS if DB fails above
    return movies.find((movie) => movie.slug === slug);
}


export async function saveMovies(movies: Movie[]): Promise<void> {
    // Skip local backup in production to avoid read-only FS errors
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    try {
        await fs.writeFile(dataPath, JSON.stringify(movies, null, 2));
    } catch (error) {
        console.error('Error saving movies:', error);
        throw error;
    }
}

// New helper for single movie create/update
export async function upsertMovie(movie: Movie): Promise<void> {
    if (process.env.POSTGRES_PRISMA_URL) {
        const payload = {
            slug: movie.slug,
            title: movie.title || 'Untitled',
            year: Math.floor(Number(movie.year || new Date().getFullYear())),
            director: movie.director || 'Unknown',
            posterUrl: movie.posterUrl || '',
            backdropUrl: movie.backdropUrl || null,
            rating: Number(movie.rating || 0),
            reviewShort: movie.reviewShort || '',
            reviewLong: movie.reviewLong || '',
            plot: movie.plot || null,
            review15Lines: movie.review15Lines || [],
            genres: movie.genres || [],
            duration: movie.duration ? Math.floor(Number(movie.duration)) : null,
            certification: movie.certification || null,
            spokenLanguages: movie.spokenLanguages || [],
            trailerUrl: movie.trailerUrl || null,
            streaming: movie.streaming || [],

            storyScore: Number(movie.technicalScores?.story ?? 0),
            actingScore: Number(movie.technicalScores?.acting ?? 0),
            paceScore: Number(movie.technicalScores?.pace ?? 0),
            endingScore: Number(movie.technicalScores?.ending ?? 0),
            originalityScore: Number(movie.technicalScores?.originality ?? 0),

            cast: movie.cast ? JSON.parse(JSON.stringify(movie.cast)) : []
        };

        try {
            await prisma.movie.upsert({
                where: { slug: movie.slug },
                update: payload,
                create: {
                    ...payload,
                    id: movie.id // Ensure we use the ID from the frontend if possible
                }
            });
        } catch (e) {
            console.error("Prisma Upsert Error Details:", e);
            throw e; // Rethrow to be caught by API route
        }

        if (process.env.NODE_ENV === 'production') return;
    }

    // Also update local JSON for backup
    const currentMovies = await getMovies();
    const index = currentMovies.findIndex(m => m.slug === movie.slug);
    if (index >= 0) {
        currentMovies[index] = movie;
    } else {
        currentMovies.push(movie);
    }
    await saveMovies(currentMovies);
}

export async function deleteMovie(slug: string): Promise<void> {
    if (process.env.POSTGRES_PRISMA_URL) {
        try {
            await prisma.movie.delete({ where: { slug } });
        } catch (e) {
            console.error("Prisma Delete Error", e);
            // If it doesn't exist in DB, maybe it only exists in FS? Continue to FS if not production
        }
        if (process.env.NODE_ENV === 'production') return;
    }

    const movies = await getMovies();
    const filtered = movies.filter(m => m.slug !== slug);
    await saveMovies(filtered);
}
