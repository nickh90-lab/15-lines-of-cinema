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

export function getSimulatedAnalytics(days: number = 30): AnalyticsData {
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

    // Dynamic Top Genre and Engagement for variety
    const genres = ["Sci-Fi", "Noir", "Drama", "Action", "Documentary"];
    const topGenre = genres[Math.floor(Math.random() * (days === -1 ? 2 : genres.length))];

    return {
        kpis: {
            totalViews: traffic.reduce((acc, curr) => acc + curr.views, 0),
            avgSession: days === 7 ? "3m 45s" : "4m 32s",
            engagementRate: days === 7 ? "62.1%" : "68.4%",
            topGenre
        },
        traffic,
        geo: [
            { country: "United States", views: 12450, percentage: 42 },
            { country: "Netherlands", views: 4820, percentage: 16 },
            { country: "United Kingdom", views: 3540, percentage: 12 },
            { country: "Germany", views: 2360, percentage: 8 },
            { country: "France", views: 1770, percentage: 6 },
            { country: "Others", views: 4720, percentage: 16 }
        ],
        content: [
            { title: "Dune: Part Two", slug: "dune-part-two", views: Math.floor(8420 * (actualDays / 30)), avgTime: "5m 12s" },
            { title: "Oppenheimer", slug: "oppenheimer", views: Math.floor(6150 * (actualDays / 30)), avgTime: "4m 45s" },
            { title: "Blade Runner 2049", slug: "blade-runner-2049", views: Math.floor(4230 * (actualDays / 30)), avgTime: "6m 20s" },
            { title: "La La Land", slug: "la-la-land", views: Math.floor(3890 * (actualDays / 30)), avgTime: "3m 55s" },
            { title: "The Dark Knight", slug: "the-dark-knight", views: Math.floor(3120 * (actualDays / 30)), avgTime: "4m 10s" }
        ]
    };
}
