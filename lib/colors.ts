export const getScoreColor = (value: number) => {
    if (value >= 8.5) return {
        primary: '#D4AF37', // Deep Gold (Prestige)
        bg: 'rgba(212, 175, 55, 0.05)',
        glow: 'rgba(212, 175, 55, 0.4)', // Boosted for masterpiece
        gradient: 'from-[#D4AF37] to-[#B8860B]'
    };
    if (value >= 7.0) return {
        primary: '#F59E0B', // Warm Amber (Golden Hour)
        bg: 'rgba(245, 158, 11, 0.05)',
        glow: 'rgba(245, 158, 11, 0.05)', // Flat
        gradient: 'from-[#F59E0B] to-[#D97706]'
    };
    if (value >= 5.0) return {
        primary: '#4B5563', // Graphite (Neutral)
        bg: 'rgba(75, 85, 99, 0.05)',
        glow: 'rgba(75, 85, 99, 0)', // No glow
        gradient: 'from-[#4B5563] to-[#374151]'
    };
    return {
        primary: '#6E0F1A', // Deep Bordeaux (Dramatic)
        bg: 'rgba(110, 15, 26, 0.05)',
        glow: 'rgba(110, 15, 26, 0.1)', // Subtler
        gradient: 'from-[#6E0F1A] to-[#4A0A11]'
    };
};
