import fs from 'fs/promises';
import path from 'path';
import { Movie } from './types';
import { PrismaClient } from '@prisma/client';

// Global Prisma instance to prevent multiple connections in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
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
    // Note: This function signature is a bit weird for DB actions (usually we save one movie).
    // But for now, we only use this in limited places (re-writing the whole JSON).
    // In DB land, we should probably have `createMovie` or `updateMovie`.
    // For this refactor, let's keep it simple: WE DO NOT IMPLEMENT BULK SAVE TO DB HERE.
    // The API routes should call create/update directly.

    // We ONLY write to FS here for backup/local dev.
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
            title: movie.title,
            year: movie.year,
            director: movie.director,
            posterUrl: movie.posterUrl,
            backdropUrl: movie.backdropUrl,
            rating: movie.rating,
            reviewShort: movie.reviewShort,
            reviewLong: movie.reviewLong,
            plot: movie.plot,
            review15Lines: movie.review15Lines,
            genres: movie.genres,
            duration: movie.duration,
            certification: movie.certification,
            spokenLanguages: movie.spokenLanguages,
            trailerUrl: movie.trailerUrl,
            streaming: movie.streaming,

            // Flatten scores
            storyScore: movie.technicalScores.story,
            actingScore: movie.technicalScores.acting,
            paceScore: movie.technicalScores.pace,
            endingScore: movie.technicalScores.ending,
            originalityScore: movie.technicalScores.originality,

            cast: JSON.parse(JSON.stringify(movie.cast || []))
        };

        await prisma.movie.upsert({
            where: { slug: movie.slug },
            update: payload,
            create: payload
        });
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
