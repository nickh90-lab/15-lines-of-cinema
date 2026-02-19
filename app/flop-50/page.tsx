import { getMovies } from '@/lib/data';
import { RankedListClient } from '@/components/RankedListClient';

export default async function Flop50Page() {
    const movies = await getMovies();
    // Sort by rating asc, then title asc. Take top 50.
    const flop50 = movies
        .sort((a, b) => a.rating - b.rating || a.title.localeCompare(b.title))
        .slice(0, 50);

    return <RankedListClient movies={flop50} title="The Disasters" type="flop" />;
}
