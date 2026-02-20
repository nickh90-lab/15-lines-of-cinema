import { NextResponse } from 'next/server';
import { getMovies, saveMovies, upsertMovie } from '@/lib/data';
import { Movie } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid or just use random string

export async function GET() {
    const movies = await getMovies();
    return NextResponse.json(movies);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const movies = await getMovies();

        // Basic validation could go here

        const newMovie: Movie = {
            ...body,
            id: body.id || crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        // Check for slug collision (FS check is enough for now as data.ts handles DB check implicitly via unique constraint, 
        // but explicit check is better UI. `getMovies` fetches from DB transparency)
        if (movies.some(m => m.slug === newMovie.slug)) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        await upsertMovie(newMovie);
        return NextResponse.json(newMovie);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
