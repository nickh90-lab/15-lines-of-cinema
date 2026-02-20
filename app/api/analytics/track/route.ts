import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { path } = await req.json();
        if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 });

        // Skip tracking for admin and api routes to avoid polluting data
        if (path.startsWith('/admin') || path.startsWith('/api')) {
            return NextResponse.json({ success: true, skipped: true });
        }

        const headersList = await headers();
        const country = headersList.get('x-vercel-ip-country') || 'Unknown';
        const today = new Date().toISOString().split('T')[0];

        // Perform updates in a transaction for atomicity (though not strictly required for stats)
        await Promise.all([
            // Path stats
            prisma.analytics.upsert({
                where: { path },
                update: { views: { increment: 1 } },
                create: { path, views: 1 },
            }),
            // Daily stats
            prisma.dailyStats.upsert({
                where: { date: today },
                update: { views: { increment: 1 }, sessions: { increment: 1 } }, // Simplified: 1 view = 1 session for now
                create: { date: today, views: 1, sessions: 1 },
            }),
            // Country stats
            prisma.countryStats.upsert({
                where: { country },
                update: { views: { increment: 1 } },
                create: { country, views: 1 },
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
