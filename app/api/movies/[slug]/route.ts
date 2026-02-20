import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getMovies, saveMovies } from '@/lib/data';
import { Movie } from '@/lib/types';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;
    const movies = await getMovies();
    const movie = movies.find(m => m.slug === slug);

    if (!movie) {
        return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
}

export async function PUT(request: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const slug = params.slug; // This is the OLD slug
        const body = await request.json();
        const movies = await getMovies();

        const index = movies.findIndex(m => m.slug === slug);
        if (index === -1) {
            return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
        }

        // Check if new slug conflicts with another movie (excluding itself)
        // If the title changed, the slug might change in the body. 
        // We should generally respect the ID over the slug for identity, but the URL uses slug.
        // Let's assume the ID is consistent.

        const updatedMovie: Movie = {
            ...movies[index],
            ...body,
            id: movies[index].id,
            createdAt: movies[index].createdAt,
            updatedAt: new Date().toISOString()
        };

        const { upsertMovie } = await import('@/lib/data');
        await upsertMovie(updatedMovie);
        revalidatePath('/');
        revalidatePath('/admin');

        return NextResponse.json(updatedMovie);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const slug = params.slug;

        const { deleteMovie } = await import('@/lib/data');
        await deleteMovie(slug);
        revalidatePath('/');
        revalidatePath('/admin');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
