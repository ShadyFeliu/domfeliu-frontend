import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalAudioPlayer from '@/components/audio/GlobalAudioPlayer';
import GlobalAestheticLayer from '@/components/shared/GlobalAestheticLayer';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://domfeliu.com'),
  title: 'Dom Feliu | Artista Open Format',
  description: 'Web oficial de Dom Feliu, Artista Open Format. Urbano, Comercial y Electrónica. Descubre las últimas pistas, próximos eventos y contenido exclusivo.',
  keywords: ['Dom Feliu', 'DJ', 'Productor', 'Open Format', 'Urbano', 'Comercial', 'Electrónica', 'Música Electrónica'],
  authors: [{ name: 'Dom Feliu' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://domfeliu.com',
    title: 'Dom Feliu | Artista Open Format',
    description: 'Explora el universo musical de Dom Feliu. Pistas, eventos y contenido exclusivo.',
    siteName: 'Dom Feliu Official',
    images: [
      {
        url: '/logo-domfeliu.png',
        width: 1200,
        height: 630,
        alt: 'Dom Feliu Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dom Feliu | Artista Open Format',
    description: 'Explora el universo musical de Dom Feliu.',
    images: ['/logo-domfeliu.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <GlobalAudioPlayer />
        <GlobalAestheticLayer />
      </body>
    </html>
  );
}
