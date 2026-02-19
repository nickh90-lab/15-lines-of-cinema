'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface RatingProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Rating({ value, max = 10, size = 'md', className }: RatingProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1500; // ms
        const steps = 60;
        const stepTime = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(current);
            }
        }, stepTime);

        // Initial delay for dramatic effect
        return () => clearInterval(timer);
    }, [value]);

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-4xl',
        xl: 'text-6xl font-bold',
    };

    return (
        <div className={clsx('flex items-center gap-1', className)}>
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx('font-heading tabular-nums text-accent', sizeClasses[size])}
            >
                {displayValue.toFixed(1)}
            </motion.span>
            <span className="text-gray-500 text-xs self-end mb-1">/{max}</span>
        </div>
    );
}
