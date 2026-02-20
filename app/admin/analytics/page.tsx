import { getMovies } from '@/lib/data';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const movies = await getMovies();

    return <AnalyticsClient movies={movies} />;
}
