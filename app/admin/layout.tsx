import Link from 'next/link';
import { Film, Plus, LayoutGrid, LogOut, BarChart3 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#050505] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-2xl">
                <div className="p-8">
                    <Link href="/" className="flex flex-col leading-none group">
                        <span className="font-heading font-black text-xl tracking-tighter text-white/90 group-hover:text-accent transition-colors">
                            15 LINES
                        </span>
                        <span className="font-heading font-bold text-[10px] tracking-[0.2em] text-white/60 group-hover:text-accent transition-colors -mt-1 ml-[1px]">
                            OF CINEMA
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-white/50 hover:text-white group border border-transparent hover:border-white/5"
                    >
                        <LayoutGrid className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">Library View</span>
                    </Link>
                    <Link
                        href="/admin/analytics"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-white/50 hover:text-white group border border-transparent hover:border-white/5"
                    >
                        <BarChart3 className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">Analytics</span>
                    </Link>
                    <Link
                        href="/admin/add"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-white/50 hover:text-white group border border-transparent hover:border-white/5"
                    >
                        <Plus className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">Add Movie</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all text-white/30 hover:text-red-400 group">
                        <LogOut className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}
