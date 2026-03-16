'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '../shared/SectionWrapper';
import { useState, useEffect } from 'react';
import { api, getMediaUrl } from '@/lib/api';
import { Venue, ArtistProfile } from '@/types';
import Image from 'next/image';

export default function AboutSection() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesData, artistData] = await Promise.all([
           api.get<Venue[]>('/venues'),
           api.get<ArtistProfile>('/auth/artist')
        ]);
        setVenues(venuesData);
        setArtist(artistData);
      } catch (error) {
        console.error('Error fetching about section data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <SectionWrapper id="about" className="relative py-24 overflow-hidden bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-df-green border-t-transparent animate-spin"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600">Sincronizando Archivo del Artista...</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="about" className="relative py-24 overflow-hidden bg-[#050505]">
      {/* Background Aesthetic */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-df-blue/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-df-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-square rounded-4xl bg-linear-to-br from-white/10 to-transparent border border-white/5 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-tr from-df-purple/20 via-transparent to-df-blue/10 mix-blend-overlay"></div>
              
              {artist?.profileImage ? (
                <Image 
                  src={getMediaUrl(artist.profileImage)} 
                  alt="Dom Feliu" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-zinc-800 font-black text-9xl uppercase select-none opacity-20 tracking-tighter">DOM</span>
                </div>
              )}
              <div className="absolute inset-0 border-20 border-black/50"></div>
            </div>
            {/* Tactical Decor */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-df-magenta/10 blur-[60px] rounded-full animate-pulse"></div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-df-green mb-4 opacity-70 italic block">Protocolo de Biografía</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-[-0.02em] text-white">
              El <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Arquitecto</span>
            </h2>
            <div className="w-16 h-1 bg-linear-to-r from-df-green to-transparent mt-8 rounded-full"></div>

            <div className="mt-12 space-y-6 text-zinc-400 text-base md:text-lg font-medium leading-relaxed">
              {artist?.bio ? (
                artist.bio.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                  <p key={idx}>
                    {idx === 0 ? (
                      <>
                        <span className="text-white font-bold">Dom Feliu</span> {paragraph.startsWith('Dom Feliu') ? paragraph.replace('Dom Feliu', '').trim() : paragraph}
                      </>
                    ) : paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p>
                    <span className="text-white font-bold">Dom Feliu</span> es un DJ y productor Open Format nacido en Valencia con una sólida presencia en los géneros de música urbana y electrónica. Su versatilidad detrás de las mesas de mezclas le ha permitido conquistar diferentes estilos musicales, fusionando los ritmos vibrantes de la música urbana y la electrónica más innovadora.
                  </p>
                  <p>
                    A lo largo de su carrera, ha compartido cabina con grandes nombres de la escena electrónica como <span className="text-zinc-300">Wally Lopez, RENDHER, Reelow, Andruss, Guille Placencia, George Privatti</span>, así como destacados artistas del panorama urbano, incluyendo a <span className="text-zinc-300">Ballesteros, Alex Martini, Juanjo García, Albert González, Del Puerto, Selecta, Fuego y Aissa Aslani</span>.
                  </p>
                </>
              )}
            </div>

            {/* Micro Estadísticas */}
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
               <div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black mb-1">Origen</h4>
                  <p className="text-white font-bold tracking-tight">Valencia, ES</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black mb-1">Protocolo de Estilo</h4>
                  <p className="text-white font-bold tracking-tight text-sm">Urbano / Commercial / Electronica</p>
               </div>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Venues Archive */}
        {venues.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-32 pt-20 border-t border-white/5"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-df-blue mb-2 block opacity-50">Localización de Despliegues</span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Archivo de Recintos</h3>
              </div>
              <div className="hidden md:block w-32 h-px bg-linear-to-r from-df-blue to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {venues.map((venue, idx) => (
                <div 
                  key={venue.id} 
                  className="glass p-4 rounded-2xl border border-white/5 hover:border-df-blue/30 transition-all group overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-df-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-xs font-black text-white uppercase truncate tracking-wide">{venue.name}</p>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-1">{venue.city}</p>
                  <span className="absolute bottom-2 right-3 text-[7px] font-mono text-zinc-800 group-hover:text-df-blue/30 transition-colors uppercase font-black">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
