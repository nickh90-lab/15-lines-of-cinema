// Force Deployment v2 - Ensuring latest fixes are live
import { getMovies } from '@/lib/data';
import { VaultDashboard } from '@/components/VaultDashboard';

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen bg-black text-white">
      <VaultDashboard allMovies={movies} />
      {/* 3. Minimal Footer (Can remain here or be inside Dashboard) */}
      <footer className="mt-20 py-12 border-t border-white/5 text-center">
        <p className="font-heading font-semibold text-lg mb-2 tracking-tight text-white/90">15 Lines of Cinema</p>

      </footer>
    </main>
  );
}
