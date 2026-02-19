'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AmbientBackgroundProps {
    color?: string;
    imageUrl?: string;
}

export function AmbientBackground({ color, imageUrl }: AmbientBackgroundProps) {
    // Default to a dark cinema color if nothing provided
    const activeColor = color || '#0a0a0a';

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={imageUrl || 'default-bg'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                        backgroundColor: activeColor
                    }}
                />
            </AnimatePresence>

            {/* Overlay to darken and blur slightly for readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[50px]" />

            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, -50, 0],
                    y: [0, 40, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[150px]"
            />
        </div>
    );
}
