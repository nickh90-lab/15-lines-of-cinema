import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Movie } from '@/lib/types';
import { getMovies, upsertMovie, deleteMovie } from '@/lib/data';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;
    const movies = await getMovies(true);
    const movie = movies.find(m => m.slug === slug);

    if (!movie) {
        return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
}

export async function PUT(request: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const slug = params.slug;
        const body = await request.json();
        const movies = await getMovies(true);

        const index = movies.findIndex(m => m.slug === slug);
        if (index === -1) {
            return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
        }

        const updatedMovie: Movie = {
            ...movies[index],
            ...body,
            id: movies[index].id,
            createdAt: movies[index].createdAt,
            updatedAt: new Date().toISOString()
        };

        try {
            await upsertMovie(updatedMovie);
        } catch (dbError) {
            console.error('Database Error during PUT:', dbError);
            return NextResponse.json({ error: `Database update fout: ${dbError instanceof Error ? dbError.message : 'Kon de film niet bijwerken.'}` }, { status: 500 });
        }

        try {
            revalidatePath('/');
            revalidatePath('/admin');
        } catch (revalError) {
            console.error('Revalidation Error:', revalError);
        }

        return NextResponse.json(updatedMovie);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: `System error: ${error instanceof Error ? error.message : 'Internal Server Error'}` }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const slug = params.slug;

        try {
            await deleteMovie(slug);
        } catch (dbError) {
            console.error('Database Error during DELETE:', dbError);
            return NextResponse.json({ error: `Database delete fout: ${dbError instanceof Error ? dbError.message : 'Kon de film niet verwijderen.'}` }, { status: 500 });
        }

        try {
            revalidatePath('/');
            revalidatePath('/admin');
        } catch (revalError) {
            console.error('Revalidation Error:', revalError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: `System error: ${error instanceof Error ? error.message : 'Internal Server Error'}` }, { status: 500 });
    }
}
