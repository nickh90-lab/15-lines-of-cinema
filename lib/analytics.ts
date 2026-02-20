/**
 * Simulated Analytics Engine
 * Provides realistic demo data for the Admin Analytics Dashboard.
 */

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

import { Movie } from './types';

export function getSimulatedAnalytics(movies: Movie[], days: number = 30): AnalyticsData {
    const today = new Date();
    const traffic: DailyStats[] = [];

    // All Time defaults to 365 days for simulation
    const actualDays = days === -1 ? 365 : days;

    // Generate traffic
    for (let i = actualDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Base traffic with some randomness and a weekly cycle
        const dayOfWeek = date.getDay();
        const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1.0;
        const randomFactor = 0.8 + Math.random() * 0.4;

        // Scale traffic slightly for longer durations to feel "larger"
        const scale = days === -1 ? 1.5 : (days > 30 ? 1.2 : 1.0);
        const views = Math.floor((400 + Math.sin(i / 2) * 100) * weekendBoost * randomFactor * scale);
        const sessions = Math.floor(views * (0.6 + Math.random() * 0.1));

        traffic.push({
            date: date.toISOString().split('T')[0],
            views,
            sessions
        });
    }

    // Dynamic Top Genre from real data
    const allGenres = movies.flatMap(m => m.genres || []);
    const genreCounts = allGenres.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topGenre = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "Drama";

    // Use actual movies for content engagement
    const content: MovieEngagement[] = movies
        .slice(0, 5) // Just take top 5 for the demo
        .map((m, i) => {
            const baseViews = 8000 - (i * 1200);
            return {
                title: m.title,
                slug: m.slug,
                views: Math.floor(baseViews * (actualDays / 30) * (0.8 + Math.random() * 0.4)),
                avgTime: `${Math.floor(3 + Math.random() * 4)}m ${Math.floor(Math.random() * 60)}s`
            };
        });

    // Fallback if no movies
    if (content.length === 0) {
        content.push({ title: "Welcome to 15 Lines", slug: "no-movies", views: 0, avgTime: "0m 0s" });
    }

    const movieCount = movies.length;
    const viewMultiplier = Math.max(1, movieCount * 0.5); // More movies = more potential traffic in the simulation

    // KPI logic
    const totalViews = traffic.reduce((acc, curr) => acc + curr.views, 0) * viewMultiplier;
    const avgSessionBase = 2.5 + Math.random() * 3;
    const engagementBase = 58 + Math.random() * 15;

    return {
        kpis: {
            totalViews: Math.floor(totalViews),
            avgSession: `${Math.floor(avgSessionBase)}m ${Math.floor(Math.random() * 60)}s`,
            engagementRate: `${engagementBase.toFixed(1)}%`,
            topGenre
        },
        traffic: traffic.map(t => ({
            ...t,
            views: Math.floor(t.views * viewMultiplier),
            sessions: Math.floor(t.sessions * viewMultiplier)
        })),
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
