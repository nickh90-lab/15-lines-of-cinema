import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

        // Use static getMovies to avoid dynamic issues if possible, 
        // but here we just need slug check.
        const movies = await getMovies();

        const newMovie: Movie = {
            ...body,
            id: body.id || uuidv4(),
            createdAt: new Date().toISOString(),
            releaseDate: body.releaseDate || new Date().toISOString()
        };

        if (movies.some(m => m.slug === newMovie.slug)) {
            return NextResponse.json({ error: `Conflicterende link: De film '${newMovie.title}' bestaat al.` }, { status: 400 });
        }

        try {
            await upsertMovie(newMovie);
        } catch (dbError) {
            console.error('Database Error during upsert:', dbError);
            return NextResponse.json({
                error: `Database fout: ${dbError instanceof Error ? dbError.message : 'Kon de film niet opslaan in de database.'}`
            }, { status: 500 });
        }

        try {
            revalidatePath('/');
            revalidatePath('/admin');
        } catch (revalError) {
            console.error('Revalidation Error:', revalError);
            // Don't fail the whole request if only revalidation fails, 
            // but log it. Next.js usually handles this background.
        }

        return NextResponse.json(newMovie);
    } catch (error) {
        console.error('Main API Error:', error);
        return NextResponse.json({
            error: `Systeemfout: ${error instanceof Error ? error.message : 'Er ging iets fout bij het verwerken van de aanvraag.'}`
        }, { status: 500 });
    }
}
