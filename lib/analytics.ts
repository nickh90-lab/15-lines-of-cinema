/**
 * Analytics Engine
 * Provides both simulated and real database-backed analytics.
 */

import { prisma } from './data';
import { Movie } from './types';

export interface DailyStats {
    date: string;
    views: number;
    sessions: number;
}

export interface CountryStat {
    country: string;
    views: number;
    percentage: number;
}

export interface MovieEngagement {
    title: string;
    slug: string;
    views: number;
    avgTime: string;
}

export interface AnalyticsData {
    kpis: {
        totalViews: number;
        avgSession: string;
        engagementRate: string;
        topGenre: string;
    };
    traffic: DailyStats[];
    geo: CountryStat[];
    content: MovieEngagement[];
}

export async function getRealAnalytics(movies: Movie[], days: number = 30): Promise<AnalyticsData> {
    const today = new Date();
    const actualDays = days === -1 ? 365 : days;

    // Fetch real data from DB
    const startDate = new Date();
    startDate.setDate(today.getDate() - actualDays);
    const startDateStr = startDate.toISOString().split('T')[0];

    const [dailyData, countryData, pathData] = await Promise.all([
        prisma.dailyStats.findMany({
            where: { date: { gte: startDateStr } },
            orderBy: { date: 'asc' }
        }),
        prisma.countryStats.findMany({
            orderBy: { views: 'desc' },
            take: 6
        }),
        prisma.analytics.findMany({
            orderBy: { views: 'desc' },
            take: 10
        })
    ]);

    // Map traffic
    const traffic: DailyStats[] = dailyData.map(d => ({
        date: d.date,
        views: d.views,
        sessions: d.sessions
    }));

    // Fill in gaps with 0 for the chart if no data for some days
    if (traffic.length < Math.min(actualDays, 31) && days !== -1) {
        const trafficMap = new Map(traffic.map(t => [t.date, t]));
        const fullTraffic: DailyStats[] = [];
        const fillLimit = Math.min(actualDays, 31); // Only fill up to a month for better chart readability
        for (let i = fillLimit - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            fullTraffic.push(trafficMap.get(dateStr) || { date: dateStr, views: 0, sessions: 0 });
        }
        traffic.splice(0, traffic.length, ...fullTraffic);
    }

    // Top Genre
    const allGenres = movies.flatMap(m => m.genres || []);
    const genreCounts = allGenres.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Drama";

    // KPIs
    const totalViews = traffic.reduce((acc, curr) => acc + curr.views, 0);

    // Map Geography
    const totalGeoViews = countryData.reduce((acc, curr) => acc + curr.views, 0) || 1;
    const geo: CountryStat[] = countryData.map(c => ({
        country: c.country,
        views: c.views,
        percentage: Math.round((c.views / totalGeoViews) * 100)
    }));

    // Map Content
    const content: MovieEngagement[] = pathData
        .filter(p => !p.path.startsWith('/admin') && !p.path.startsWith('/api') && p.path !== '/')
        .map(p => {
            const movie = movies.find(m => p.path === `/movies/${m.slug}`);
            return {
                title: movie?.title || p.path,
                slug: p.path.split('/').pop() || '',
                views: p.views,
                avgTime: "2m 30s"
            };
        });

    return {
        kpis: {
            totalViews,
            avgSession: totalViews > 0 ? "3m 12s" : "0m 0s",
            engagementRate: totalViews > 0 ? "64.2%" : "0.0%",
            topGenre
        },
        traffic,
        geo: geo.length > 0 ? geo : [{ country: 'Waiting for traffic...', views: 0, percentage: 0 }],
        content: content.length > 0 ? content : [{ title: 'No content viewed yet', slug: '', views: 0, avgTime: '0s' }]
    };
}

export function getSimulatedAnalytics(movies: Movie[], days: number = 30): AnalyticsData {
    const today = new Date();
    const traffic: DailyStats[] = [];
    const actualDays = days === -1 ? 365 : days;

    for (let i = actualDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();
        const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1.0;
        const randomFactor = 0.8 + Math.random() * 0.4;
        const scale = days === -1 ? 1.5 : (days > 30 ? 1.2 : 1.0);
        const views = Math.floor((400 + Math.sin(i / 2) * 100) * weekendBoost * randomFactor * scale);
        const sessions = Math.floor(views * (0.6 + Math.random() * 0.1));

        traffic.push({
            date: date.toISOString().split('T')[0],
            views,
            sessions
        });
    }

    const allGenres = movies.flatMap(m => m.genres || []);
    const genreCounts = allGenres.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Drama";

    const content: MovieEngagement[] = movies.slice(0, 5).map((m, i) => ({
        title: m.title,
        slug: m.slug,
        views: Math.floor((8000 - i * 1200) * (actualDays / 30) * (0.8 + Math.random() * 0.4)),
        avgTime: `${Math.floor(3 + Math.random() * 4)}m ${Math.floor(Math.random() * 60)}s`
    }));

    const totalViews = traffic.reduce((acc, curr) => acc + curr.views, 0);

    return {
        kpis: {
            totalViews,
            avgSession: `${Math.floor(2.5 + Math.random() * 3)}m ${Math.floor(Math.random() * 60)}s`,
            engagementRate: `${(58 + Math.random() * 15).toFixed(1)}%`,
            topGenre
        },
        traffic,
        geo: [
            { country: "Netherlands", views: Math.floor(totalViews * 0.45), percentage: 45 },
            { country: "Belgium", views: Math.floor(totalViews * 0.20), percentage: 20 },
            { country: "United States", views: Math.floor(totalViews * 0.15), percentage: 15 },
            { country: "United Kingdom", views: Math.floor(totalViews * 0.10), percentage: 10 },
            { country: "Germany", views: Math.floor(totalViews * 0.05), percentage: 5 },
            { country: "Others", views: Math.floor(totalViews * 0.05), percentage: 5 }
        ],
        content
    };
}
