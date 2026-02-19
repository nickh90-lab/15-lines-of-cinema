import { getMovies } from '@/lib/data';
import { RankedListClient } from '@/components/RankedListClient';

export default async function Top50Page() {
    const movies = await getMovies();
    // Sort by rating desc, then title asc. Take top 50.
    const top50 = movies
        .sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title))
        .slice(0, 50);

    return <RankedListClient movies={top50} title="The Masterpieces" type="top" />;
}
