'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;

        // Small delay to ensure page is loaded and not just a rapid transition
        const timer = setTimeout(() => {
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: pathname }),
            }).catch(err => console.error('Failed to track analytics:', err));
        }, 1000);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null; // This component doesn't render anything
}
