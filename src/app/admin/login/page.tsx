'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post<{ message: string }>('/auth/login', { email, password });
      router.push('/admin');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-df-purple/10 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-df-blue/10 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-df-magenta/5 blur-[150px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md glass p-10 md:p-12 rounded-4xl relative z-10 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-df-purple to-df-blue flex items-center justify-center p-0.5 mb-6 glow-purple rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-black rounded-[1.4rem] flex items-center justify-center">
              <span className="font-black text-3xl text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 tracking-tighter">DF</span>
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Acceso al Sistema</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-df-purple mt-3 opacity-60">Entorno de Administración Restringido</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Vector de Identidad</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 transition-all placeholder:text-zinc-700"
              placeholder="example@example.com"
            />
          </div>

          <div className="space-y-2">
             <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Clave de Seguridad</label>
             <input 
               type="password" 
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 transition-all placeholder:text-zinc-700"
               placeholder="••••••••"
             />
          </div>

          {error && <p className="text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-5 rounded-2xl bg-linear-to-r from-df-purple to-df-blue text-white font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center shadow-xl shadow-df-purple/20"
          >
             {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Autorizar Transmisión'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-600">Sesión Encriptada &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
