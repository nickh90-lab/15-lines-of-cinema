import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '15 Lines of Cinema',
    template: '%s | 15 Lines of Cinema',
  },
  description: 'A curated collection of cinematic masterpieces reviewed in exactly 15 lines.',
  keywords: ['film reviews', 'cinema', 'movies', 'curated films', 'movie ratings', '15 lines of cinema'],
  authors: [{ name: 'Nick Hospers' }],
  creator: 'Nick Hospers',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: '15 Lines of Cinema',
    description: 'A curated collection of cinematic masterpieces reviewed in exactly 15 lines.',
    siteName: '15 Lines of Cinema',
  },
  twitter: {
    card: 'summary_large_image',
    title: '15 Lines of Cinema',
    description: 'A curated collection of cinematic masterpieces reviewed in exactly 15 lines.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-white transition-colors duration-700",
        outfit.variable,
        plusJakartaSans.variable
      )}>
        {/* Global Gradient Background */}
        <div className="fixed inset-0 z-[-1] bg-background transition-colors duration-700" />
        {/* Optional: subtle noise or gradient overlay if desired, but solid color is cleaner for switching */}

        <Navbar />
        {children}
        <Analytics />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
