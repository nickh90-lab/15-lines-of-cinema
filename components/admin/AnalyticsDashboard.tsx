'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock, Globe, Filter } from 'lucide-react';
import { AnalyticsData, DailyStats } from '@/lib/analytics';

interface AnalyticsDashboardProps {
    data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const maxViews = Math.max(...data.traffic.map(d => d.views));

    if (!isMounted) return <div className="min-h-[600px]" />;

    return (
        <div className="space-y-8 pb-12">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Views', value: data.kpis.totalViews.toLocaleString(), icon: Users, trend: '+12.4%' },
                    { label: 'Avg. Session', value: data.kpis.avgSession, icon: Clock, trend: '+2.1%' },
                    { label: 'Engagement', value: data.kpis.engagementRate, icon: TrendingUp, trend: '+5.7%' },
                    { label: 'Top Genre', value: data.kpis.topGenre, icon: Filter, trend: 'N/A' },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] backdrop-blur-md p-6 rounded-[32px] border border-white/5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl">
                                <kpi.icon className="w-5 h-5 text-accent" />
                            </div>
                            {kpi.trend !== 'N/A' && (
                                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                    {kpi.trend}
                                </span>
                            )}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1">
                            {kpi.label}
                        </div>
                        <div className="text-3xl font-heading font-black text-white">
                            {kpi.value}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-white/[0.03] backdrop-blur-md p-8 rounded-[40px] border border-white/5 flex flex-col h-[400px]"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-heading font-black text-white">Traffic Trends</h3>
                            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Daily Views - Last 30 Days</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <BarChart3 className="w-5 h-5 text-accent" />
                        </div>
                    </div>

                    <div className="flex-1 flex items-end gap-1 px-2 h-full">
                        {data.traffic.map((day, i) => (
                            <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(8, (day.views / maxViews) * 100)}%` }}
                                    transition={{ duration: 1, delay: i * 0.02, ease: "easeOut" }}
                                    className="w-full rounded-t-md group-hover:bg-[#D4AF37] transition-all duration-300 relative shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.4)' }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-2xl">
                                        {day.views} views
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Geographic Data */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.03] backdrop-blur-md p-8 rounded-[40px] border border-white/5"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-heading font-black text-white">Cinematic Reach</h3>
                            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Top Territories</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <Globe className="w-5 h-5 text-accent" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {data.geo.map((country, i) => (
                            <div key={country.country}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-white font-bold">{country.country}</span>
                                    <span className="text-white/40">{country.percentage}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${country.percentage}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full bg-accent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Popular Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.03] backdrop-blur-md p-8 rounded-[40px] border border-white/5"
            >
                <h3 className="text-xl font-heading font-black text-white mb-8">Most Engaging Masterpieces</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Movie Title</th>
                                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold text-center">Views</th>
                                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Avg. Time on Page</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.content.map((movie) => (
                                <tr key={movie.slug} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 font-bold text-white group-hover:text-accent transition-colors">
                                        {movie.title}
                                    </td>
                                    <td className="py-4 text-center text-white/60 font-mono">
                                        {movie.views.toLocaleString()}
                                    </td>
                                    <td className="py-4 text-right text-white/60">
                                        {movie.avgTime}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
