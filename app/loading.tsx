export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            {/* Minimalist Cinematic Loading Animation */}
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Ring Spinner */}
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    <div className="absolute inset-0 rounded-full border-t border-accent animate-spin" style={{ animationDuration: '1.5s' }} />

                    {/* Flashing Inner Dot */}
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                </div>
                <span className="font-heading font-bold text-[10px] tracking-[0.3em] text-white/40 uppercase animate-pulse">
                    Rolling...
                </span>
            </div>
        </div>
    );
}
