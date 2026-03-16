'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../shared/SectionWrapper';
import { FiMapPin } from 'react-icons/fi';
import { api } from '@/lib/api';
import { Venue } from '@/types';

export default function VenuesSection() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await api.get<Venue[]>('/venues');
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <SectionWrapper id="venues" className="py-24 bg-black relative overflow-hidden">
      {/* Aesthetic Accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-df-blue/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-20 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-black uppercase tracking-[0.6em] text-df-blue mb-4 opacity-70"
            >
              Historial de Despliegue
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white"
            >
              Clubs & <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-700">Residencias</span>
            </motion.h2>
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: '80px' }}
               viewport={{ once: true }}
               className="h-1 bg-df-blue mt-8 rounded-full"
            ></motion.div>
        </div>

        {!loading ? (
          venues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {venues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex flex-col">
                    <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                       <FiMapPin size={10} className="text-df-blue" />
                       <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">
                         {venue.city}
                       </span>
                    </div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-df-blue/20 group-hover:bg-df-blue group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="w-full glass rounded-4xl p-20 text-center border border-white/5">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600 italic">No hay registros de despliegue actualmente.</p>
            </div>
          )
        ) : (
          <div className="w-full flex justify-center py-20">
             <div className="w-8 h-8 rounded-full border-2 border-df-blue border-t-transparent animate-spin"></div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Protocolo de actuación verificado</p>
          <div className="flex gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-8 h-[2px] bg-zinc-800 rounded-full"></div>
             ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
