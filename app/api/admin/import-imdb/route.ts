import { NextResponse } from 'next/server';
import { Movie } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/original';

import { put } from '@vercel/blob';

async function downloadImage(url: string, filename: string): Promise<string | null> {
    if (!url) return null;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);

        // 1. Try Vercel Blob (Preferred for Production/Persistent staging)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(`movies/${filename}`, res.body as ReadableStream, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });
            return blob.url;
        }

        // 2. Reliable Fallback: Use TMDB directly
        // This ensures posters work even if Blob storage isn't configured yet
        return url;
    } catch (error) {
        console.error('Error downloading image:', error);
        // Final fallback: try returning the source URL anyway
        return url;
    }
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url || !url.includes('imdb.com/title/')) {
            return NextResponse.json({ error: 'Invalid IMDb URL' }, { status: 400 });
        }

        const imdbIdMatch = url.match(/tt\d+/);
        if (!imdbIdMatch) {
            return NextResponse.json({ error: 'Could not extract IMDb ID' }, { status: 400 });
        }
        const imdbId = imdbIdMatch[0];

        // 1. Find Movie ID by IMDb ID
        const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
        const findRes = await fetch(findUrl);
        const findData = await findRes.json();

        if (!findData.movie_results || findData.movie_results.length === 0) {
            return NextResponse.json({ error: 'Movie not found on TMDB' }, { status: 404 });
        }

        const movieTmp = findData.movie_results[0];
        const tmdbId = movieTmp.id;

        // 2. Get Full Details (Credits, Release Dates)
        const detailsUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,release_dates`;
        const detailsRes = await fetch(detailsUrl);
        const movieData = await detailsRes.json();

        // 3. Process Data
        const slug = movieData.original_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const director = movieData.credits.crew.find((p: any) => p.job === 'Director')?.name || 'Unknown';

        // Images
        const posterFilename = `${slug}-poster.jpg`;
        const backdropFilename = `${slug}-backdrop.jpg`;

        const [posterLocalPath, backdropLocalPath] = await Promise.all([
            downloadImage(movieData.poster_path ? `${IMG_BASE_URL}${movieData.poster_path}` : '', posterFilename),
            downloadImage(movieData.backdrop_path ? `${IMG_BASE_URL}${movieData.backdrop_path}` : '', backdropFilename)
        ]);

        // Cast (Top 5)
        const cast = movieData.credits.cast.slice(0, 5).map((actor: any) => ({
            name: actor.name,
            role: actor.character,
            imageUrl: actor.profile_path ? `${IMG_BASE_URL}${actor.profile_path}` : null // We could download these too, but let's stick to linking for now to save space/time
        }));

        const mappedMovie: Partial<Movie> = {
            title: movieData.original_title, // Or movieData.title for localized
            slug: slug,
            year: new Date(movieData.release_date).getFullYear(),
            duration: movieData.runtime,
            certification: movieData.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US')?.release_dates[0]?.certification || '',
            spokenLanguages: movieData.spoken_languages?.map((l: any) => l.english_name) || [],
            director: director,
            posterUrl: posterLocalPath || '',
            backdropUrl: backdropLocalPath || '',
            plot: movieData.overview, // Plot synopsis for the synopsis sidebar
            reviewShort: movieData.overview, // Use overview as a starting point
            reviewLong: '', // User to fill
            genres: movieData.genres.map((g: any) => g.name),
            cast: cast,
            // Defaults/Empty
            rating: 8.0,


            technicalScores: { story: 8, acting: 8, pace: 8, ending: 8, originality: 8, audiovisual: 8 }
        };

        return NextResponse.json(mappedMovie);

    } catch (error) {
        console.error('TMDB Import Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
