import { getMovieBySlug, getMovies } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MovieDetailClient } from './MovieDetailClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const movies = await getMovies();
    return movies.map((movie) => ({
        slug: movie.slug,
    }));
}



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const movie = await getMovieBySlug(slug);

    if (!movie) {
        return {
            title: 'Movie Not Found',
        };
    }

    return {
        title: `${movie.title} (${movie.year}) Review`,
        description: movie.reviewShort || `Read our review of ${movie.title}, directed by ${movie.director}.`,
        openGraph: {
            title: `${movie.title} Review - 15 Lines of Cinema`,
            description: movie.reviewShort || `Read our review of ${movie.title}, directed by ${movie.director}.`,
            images: [
                {
                    url: movie.backdropUrl || movie.posterUrl,
                    width: 1200,
                    height: 630,
                    alt: `${movie.title} Movie Poster`,
                },
            ],
        },
    };
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const movie = await getMovieBySlug(slug);

    if (!movie) {
        notFound();
    }

    // --- Similarity Algorithm ---
    const allMovies = await getMovies();
    const similarMovies = allMovies
        .filter(m => m.slug !== movie.slug) // Exclude current
        .map(m => {
            let score = 0;

            // 1. Genre Overlap (+5 per match)
            const sharedGenres = m.genres.filter(g => movie.genres.includes(g));
            score += sharedGenres.length * 5;

            // 2. Director Match (+12)
            if (m.director === movie.director) {
                score += 12;
            }

            // 3. Quality Bonus (+rating)
            score += m.rating;

            return { movie: m, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(item => item.movie);

    // JSON-LD for Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
            '@type': 'Movie',
            name: movie.title,
            image: movie.posterUrl,
            dateCreated: movie.year.toString(),
            director: {
                '@type': 'Person',
                name: movie.director,
            },
        },
        reviewRating: {
            '@type': 'Rating',
            ratingValue: movie.rating,
            bestRating: '10',
            worstRating: '1',
        },
        author: {
            '@type': 'Person',
            name: 'Nick Hospers', // Or "15 Lines of Cinema Team"
        },
        publisher: {
            '@type': 'Organization',
            name: '15 Lines of Cinema',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MovieDetailClient movie={movie} similarMovies={similarMovies} />
        </>
    );
}
