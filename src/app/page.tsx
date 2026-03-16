export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import MusicSection from '@/components/sections/MusicSection';
import VenuesSection from '@/components/sections/VenuesSection';
import EventsSection from '@/components/sections/EventsSection';
import GallerySection from '@/components/sections/GallerySection';
import ContactSection from '@/components/sections/ContactSection';
import { MusicSkeleton, EventSkeleton } from '@/components/sections/SectionSkeletons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <VenuesSection />
      
      <Suspense fallback={
        <section className="py-32 bg-[#050505]">
          <div className="container mx-auto px-6">
            <MusicSkeleton />
          </div>
        </section>
      }>
        <MusicSection />
      </Suspense>

      <Suspense fallback={
        <section className="py-32 bg-[#050505]">
          <div className="container mx-auto px-6">
            <EventSkeleton />
          </div>
        </section>
      }>
        <EventsSection />
      </Suspense>

      <GallerySection />
      <ContactSection />
    </div>
  );
}
