import { getMovies } from '@/lib/data';
import { FilmsGridClient } from '@/components/FilmsGridClient';

export default async function MoviesPage() {
    const movies = await getMovies();
    return <FilmsGridClient initialMovies={movies} />;
}
