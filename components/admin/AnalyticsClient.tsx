'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { Movie } from '@/lib/types';
import { AnalyticsData } from '@/lib/analytics';

interface AnalyticsClientProps {
    movies: Movie[];
    initialData: AnalyticsData;
    initialDays: number;
}

const TIMEFRAMES = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: 'All Time', days: -1 },
];

export function AnalyticsClient({ initialData, initialDays }: AnalyticsClientProps) {
    const router = useRouter();

    const handleTimeframeChange = (days: number) => {
        router.push(`/admin/analytics?days=${days}`);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black text-white mb-2 tracking-tighter">
                        Cinema Analytics
                    </h1>
                    <p className="text-white/40 flex items-center gap-2 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Live insights from your cinematic library.
                    </p>
                </div>

                <div className="flex bg-white/[0.03] backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.label}
                            onClick={() => handleTimeframeChange(tf.days)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${initialDays === tf.days
                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnalyticsDashboard data={initialData} />
        </div>
    );
}
