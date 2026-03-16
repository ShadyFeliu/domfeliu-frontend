'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability
    console.error('[FRONTEND_KERNEL_ERROR]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-df-magenta/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass p-12 md:p-20 rounded-4xl border border-red-500/10 relative overflow-hidden shadow-3xl"
        >
          {/* Tactical Brackets */}
          <div className="corner-bracket corner-bracket-tl border-red-500/20" />
          <div className="corner-bracket corner-bracket-br border-red-500/20" />

          <div className="w-24 h-24 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-df-magenta mx-auto mb-10 shadow-2xl">
            <FiAlertTriangle size={48} className="animate-pulse" />
          </div>

          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-df-magenta mb-6 opacity-70 italic block">
            Error Crítico de Kernel
          </span>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8">
            Sistema <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Comprometido</span>
          </h1>

          <p className="text-zinc-500 text-base md:text-lg font-medium leading-relaxed mb-12 max-w-sm mx-auto opacity-80">
            Se ha detectado una anomalía crítica en el flujo de ejecución. El protocolo de datos no ha podido completarse.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => reset()}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest"
            >
              <FiRefreshCw size={16} /> Reintentar Protocolo
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest"
            >
              <FiArrowLeft size={16} /> Salir
            </Link>
          </div>

          {/* Technical Meta info */}
          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center gap-4 opacity-40">
             <div className="flex gap-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-[2px] bg-zinc-800 rounded-full"></div>
                ))}
             </div>
             {error.digest && (
                <span className="text-[8px] font-mono text-zinc-600 tracking-widest uppercase mt-2">
                   Digest: {error.digest}
                </span>
             )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
