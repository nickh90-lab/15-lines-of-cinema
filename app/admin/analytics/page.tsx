'use client';

import React, { useState, useMemo } from 'react';
import { getSimulatedAnalytics } from '@/lib/analytics';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

const TIMEFRAMES = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: 'All Time', days: -1 },
];

export default function AnalyticsPage() {
    const [days, setDays] = useState(30);

    // In a real app, this would be a fetch call triggered by days change
    const data = useMemo(() => getSimulatedAnalytics(days), [days]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black text-white mb-2 tracking-tighter">
                        Cinema Analytics
                    </h1>
                    <p className="text-white/40 flex items-center gap-2 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live insights from your cinematic library.
                    </p>
                </div>

                <div className="flex bg-white/[0.03] backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.label}
                            onClick={() => setDays(tf.days)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${days === tf.days
                                    ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnalyticsDashboard data={data} />
        </div>
    );
}
