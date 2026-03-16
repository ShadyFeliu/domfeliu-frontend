'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-df-purple/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass p-12 md:p-20 rounded-4xl border border-white/5 relative overflow-hidden shadow-3xl"
        >
          {/* Tactical Brackets */}
          <div className="corner-bracket corner-bracket-tl opacity-20" />
          <div className="corner-bracket corner-bracket-br opacity-20" />

          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-df-purple mx-auto mb-10 shadow-2xl">
            <FiAlertCircle size={48} className="animate-pulse" />
          </div>

          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-df-purple mb-6 opacity-70 italic block">
            Error 404: Señal Perdida
          </span>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8">
            Sector <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Inexistente</span>
          </h1>

          <p className="text-zinc-500 text-base md:text-lg font-medium leading-relaxed mb-12 max-w-sm mx-auto opacity-80">
            El protocolo de búsqueda de esta coordenada ha fallado. El sector solicitado no responde o ha sido deslocalizado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="group relative px-10 py-5 bg-white text-black rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
            >
              <div className="absolute inset-0 bg-df-purple opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                <FiHome size={16} /> Reanudar Protocolo
              </span>
            </Link>
          </div>

          {/* Data packet visual */}
          <div className="mt-16 pt-10 border-t border-white/5 flex justify-center gap-4 opacity-20">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="w-8 h-[2px] bg-zinc-800 rounded-full"></div>
             ))}
          </div>
        </motion.div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
           <span className="text-[120px] font-black uppercase tracking-tighter text-white select-none whitespace-nowrap">
             KERNEL_PANIC
           </span>
        </div>
      </div>
    </div>
  );
}
