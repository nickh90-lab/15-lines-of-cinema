import { getMovies } from '@/lib/data';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminLibraryClient } from '@/components/admin/AdminLibraryClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const movies = await getMovies();

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black text-white mb-2 tracking-tighter">
                        Movie Library
                    </h1>
                    <p className="text-white/40 flex items-center gap-2 text-sm font-medium">
                        Manage your collection of cinematic masterpieces.
                    </p>
                </div>
                <Link
                    href="/admin/add"
                    className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-accent/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Movie
                </Link>
            </div>

            <AdminLibraryClient initialMovies={movies} />
        </div>
    );
}
