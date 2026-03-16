'use client';

import { useState, useEffect } from 'react';
import { api, getMediaUrl } from '@/lib/api';
import { ArtistProfile, Track, Venue } from '@/types';
import { motion } from 'framer-motion';
import { FiDownload, FiMusic, FiMapPin, FiExternalLink, FiMail, FiInstagram } from 'react-icons/fi';
import Image from 'next/image';
import SectionWrapper from '@/components/shared/SectionWrapper';

export default function EPKPage() {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistData, tracksData, venuesData] = await Promise.all([
          api.get<ArtistProfile>('/auth/artist'),
          api.get<Track[]>('/tracks'),
          api.get<Venue[]>('/venues')
        ]);
        setArtist(artistData);
        setTracks(tracksData.filter(t => t.isPublished).slice(0, 3));
        setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching EPK data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-df-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 overflow-hidden selection:bg-df-purple/30">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-df-purple/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-df-blue/5 blur-[150px] rounded-full"></div>
      </div>

      <SectionWrapper className="relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-linear-to-r from-df-purple/20 to-df-blue/20 blur-2xl rounded-full opacity-50"></div>
              <div className="relative aspect-4/5 w-full max-w-md mx-auto rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                {artist?.profileImage ? (
                  <Image 
                    src={getMediaUrl(artist.profileImage)}
                    alt="Dom Feliu"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr from-df-purple via-df-magenta to-df-blue flex items-center justify-center text-8xl font-black text-white">
                    DF
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-df-purple">EPK // Electronic Press Kit</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none">
                Dom <span className="text-transparent bg-clip-text bg-linear-to-r from-df-purple via-df-magenta to-df-blue">Feliu</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                {artist?.bio || "Artista Open Format con una propuesta sonora que fusiona lo urbano, lo comercial y la electrónica más vanguardista."}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {artist?.presskitUrl && (
                  <a 
                    href={getMediaUrl(artist.presskitUrl)}
                    download
                    className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-df-purple hover:text-white transition-all flex items-center gap-3 shadow-xl shadow-white/5 group"
                  >
                    <FiDownload className="group-hover:animate-bounce" /> Descargar Presskit PDF
                  </a>
                )}
                <a 
                  href="#gallery"
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  <FiExternalLink /> Fotos Alta Res
                </a>
              </div>
            </motion.div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass p-10 rounded-[2.5rem] border border-white/5"
            >
              <FiMusic className="text-df-purple mb-6" size={32} />
              <h3 className="text-xl font-black text-white uppercase mb-4">Música</h3>
              <ul className="space-y-4">
                {tracks.map(track => (
                  <li key={track.id} className="flex items-center justify-between group">
                    <span className="text-xs text-gray-400 font-bold uppercase truncate pr-4">{track.title}</span>
                    <FiExternalLink size={14} className="text-df-purple opacity-0 group-hover:opacity-100 transition-all" />
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-10 rounded-[2.5rem] border border-white/5"
            >
              <FiMapPin className="text-df-magenta mb-6" size={32} />
              <h3 className="text-xl font-black text-white uppercase mb-4">Clubs & Residencias</h3>
              <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                Presencia constante en {venues.length} de las salas más prestigiosas, definiendo el sonido de la noche.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {venues.slice(0, 5).map(v => (
                  <span key={v.id} className="text-[9px] px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-500 font-mono">
                    {v.name}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between"
            >
              <div>
                <FiMail className="text-df-blue mb-6" size={32} />
                <h3 className="text-xl font-black text-white uppercase mb-2">Booking</h3>
                <p className="text-xs text-df-blue font-black uppercase tracking-[0.2em] mb-6">booking@domfeliu.com</p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                <a href="https://instagram.com/domfeliu" target="_blank" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                  <FiInstagram className="text-white" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
