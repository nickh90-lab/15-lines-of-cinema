import { getMovies } from '@/lib/data';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';
import { getRealAnalytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ days?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const days = resolvedParams.days ? parseInt(resolvedParams.days) : 30;

    const movies = await getMovies();
    const analyticsData = await getRealAnalytics(movies, days);

    return <AnalyticsClient movies={movies} initialData={analyticsData} initialDays={days} />;
}
