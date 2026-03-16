'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-svh flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-df-purple/10 blur-[150px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-df-blue/10 blur-[150px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] bg-df-magenta/5 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-2 mix-blend-overlay"></div>
      </div>

      {/* Hero HUD Brackets */}
      <div className="absolute inset-6 md:inset-10 pointer-events-none opacity-20 transition-all duration-700">
        <div className="corner-bracket corner-bracket-tl w-12 h-12 md:w-32 md:h-32" />
        <div className="corner-bracket corner-bracket-tr w-12 h-12 md:w-32 md:h-32" />
        <div className="corner-bracket corner-bracket-bl w-12 h-12 md:w-32 md:h-32" />
        <div className="corner-bracket corner-bracket-br w-12 h-12 md:w-32 md:h-32" />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-32 flex flex-col items-center justify-center text-center">
        {/* Main Title Architecture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-10 bg-linear-to-r from-df-purple/20 via-df-magenta/10 to-df-blue/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-df-purple mb-6 opacity-80 flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-df-purple rounded-full animate-pulse"></span>
               Artista Open Format
               <span className="w-1.5 h-1.5 bg-df-purple rounded-full animate-pulse"></span>
            </span>
            <div className="relative group/logo">
              <div className="absolute -inset-8 bg-linear-to-r from-df-purple/20 via-df-magenta/10 to-df-blue/20 blur-[50px] opacity-100 -z-10 group-hover/logo:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative flex items-center justify-center py-2">
                <span className="absolute -top-1 -left-2 text-[8px] font-mono text-df-purple opacity-40">01</span>
                <span className="absolute -bottom-1 -right-2 text-[8px] font-mono text-df-magenta opacity-40">02</span>
                
                <Image 
                  src="/logo-domfeliu.png" 
                  alt="Dom Feliu Logo" 
                  width={300} 
                  height={150} 
                  className="w-[140px] md:w-[200px] lg:w-[260px] h-auto drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subtitle & Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-4 flex flex-col items-center gap-3"
        >
          <p className="text-xs md:text-base font-bold text-zinc-400 uppercase tracking-[0.2em] max-w-2xl">
            Urbano <span className="text-white">Commercial</span> & Electrónica
          </p>
          
          <div className="inline-flex items-center gap-3 px-5 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-df-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-df-green"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Protocolo en Vivo: <span className="text-df-green animate-pulse">En Gira 2026</span>
            </span>
          </div>
        </motion.div>


        {/* Action Systems - Tactical HUD Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-8 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-0 relative"
        >
          {/* Module 01: Audio Transmission */}
          <div className="flex-1 flex justify-center sm:justify-end sm:pr-16">
            <div className="relative group">
              {/* Module Brackets */}
              <div className="absolute -inset-2 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                 <div className="corner-bracket corner-bracket-tl w-3 h-3 border-df-purple" />
                 <div className="corner-bracket corner-bracket-br w-3 h-3 border-df-purple" />
              </div>
              
              <div className="absolute -top-6 left-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                 <span className="text-[7px] font-mono text-df-purple uppercase tracking-widest">Status</span>
                 <span className="text-[7px] font-mono text-white uppercase tracking-widest animate-pulse">Link_Active</span>
              </div>

              <Link 
                href="/#music" 
                className="relative px-10 py-5 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500 hover:border-df-purple/50 group/btn shadow-2xl"
              >
                {/* Internal Scanline Effect */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-df-purple/5 to-transparent -translate-y-full group-hover/btn:animate-scanline pointer-events-none"></div>
                
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-white group-hover:text-df-purple transition-colors duration-500">
                  Escuchar
                </span>
                
                <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-df-purple to-transparent scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-700"></div>
              </Link>

              <div className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-40 transition-opacity text-[6px] font-mono text-zinc-500 tracking-[0.2em]">
                 SEC_AUDIO_01
              </div>
            </div>
          </div>

          {/* Central Data Packet Terminal - Regular Flex Item */}
          <div 
            className="hidden sm:flex flex-col items-center justify-center relative cursor-pointer group/scroll pt-8"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-[8px] uppercase tracking-[0.6em] text-zinc-600 font-black group-hover/scroll:text-df-purple transition-colors mb-4 text-center">
              Scroll
            </span>
            <div className="relative w-px h-24 bg-zinc-800/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-4 bg-df-purple/40 blur-[2px] animate-data-packet"></div>
                <div className="absolute top-1/2 left-0 w-full h-1/2 bg-linear-to-b from-df-purple/20 to-transparent animate-infinite-scroll opacity-20"></div>
            </div>
          </div>

          {/* Module 02: Booking Protocol */}
          <div className="flex-1 flex justify-center sm:justify-start sm:pl-16">
            <div className="relative group">
              {/* Module Brackets */}
              <div className="absolute -inset-2 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                 <div className="corner-bracket corner-bracket-tr w-3 h-3 border-df-magenta" />
                 <div className="corner-bracket corner-bracket-bl w-3 h-3 border-df-magenta" />
              </div>

              <div className="absolute -top-6 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 text-right">
                 <span className="text-[7px] font-mono text-white uppercase tracking-widest animate-pulse">Sys_Ready</span>
                 <span className="text-[7px] font-mono text-df-magenta uppercase tracking-widest">Protocol</span>
              </div>

              <Link 
                href="/#contact" 
                className="relative px-10 py-5 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500 hover:border-df-magenta/50 group/btn shadow-2xl glass"
              >
                <div className="absolute inset-0 bg-linear-to-r from-df-magenta/0 via-df-magenta/5 to-df-magenta/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-white group-hover:text-df-magenta transition-colors duration-500">
                  Contratación
                </span>

                <div className="absolute top-0 right-0 w-full h-px bg-linear-to-l from-transparent via-df-magenta to-transparent scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-700"></div>
              </Link>

              <div className="absolute -bottom-5 left-0 opacity-0 group-hover:opacity-40 transition-opacity text-[6px] font-mono text-zinc-500 tracking-[0.2em]">
                 SEC_BOOK_02
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
