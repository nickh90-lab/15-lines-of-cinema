import { MetadataRoute } from 'next';
import { getMovies } from '@/lib/data';
import { BASE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const movies = await getMovies();

    const movieEntries: MetadataRoute.Sitemap = movies.map((movie) => ({
        url: `${BASE_URL}/movies/${movie.slug}`,
        lastModified: new Date(movie.createdAt || new Date()), // Fallback to current date if createdAt is missing
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...movieEntries,
    ];
}
