'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api, getMediaUrl } from '@/lib/api';
import { FiMusic, FiCalendar, FiImage, FiMessageSquare, FiLogOut, FiHome, FiUser, FiMapPin } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const adminLinks = [
  { name: 'Panel', href: '/admin', icon: <FiHome size={20} />, color: 'var(--color-df-purple)' },
  { name: 'Pistas', href: '/admin/tracks', icon: <FiMusic size={20} />, color: 'var(--color-df-blue)' },
  { name: 'Eventos', href: '/admin/events', icon: <FiCalendar size={20} />, color: 'var(--color-df-magenta)' },
  { name: 'Clubs', href: '/admin/venues', icon: <FiMapPin size={20} />, color: 'var(--color-df-blue)' },
  { name: 'Galería', href: '/admin/gallery', icon: <FiImage size={20} />, color: 'var(--color-df-green)' },
  { name: 'Mensajes', href: '/admin/messages', icon: <FiMessageSquare size={20} />, color: 'var(--color-df-magenta)' },
  { name: 'Perfil', href: '/admin/profile', icon: <FiUser size={20} />, color: 'var(--color-df-purple)' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ email: string, profileImage: string | null } | null>(null);
  const [systemStatus, setSystemStatus] = useState<{ database: string, uptime: number } | null>(null);
  const [liveUptime, setLiveUptime] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Fetch status every 10 seconds (source of truth)
  useEffect(() => {
    if (!mounted) return;
    
    const fetchStatus = async () => {
      try {
        const data = await api.get<{ database: string, uptime: number }>('/status');
        setSystemStatus(data);
        setLiveUptime(data.uptime);
      } catch (error) {
        console.error('Error fetching system status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Local ticker for live uptime (every second)
  const isUptimeLoaded = liveUptime !== null;
  useEffect(() => {
    if (!isUptimeLoaded) return;
    
    const ticker = setInterval(() => {
      setLiveUptime(prev => (prev !== null ? prev + 1 : null));
    }, 1000);
    
    return () => clearInterval(ticker);
  }, [isUptimeLoaded]);

  useEffect(() => {
    if (!mounted) return;
    if (!pathname.includes('/login')) {
      api.get<{ id: string, email: string, profileImage: string | null }>('/auth/validate')
        .then(data => setUser(data))
        .catch(() => {
          router.push('/admin/login');
        });
    }
  }, [pathname, router, mounted]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    router.push('/admin/login');
  };

  if (!mounted || pathname.includes('/login')) {
    return null;
  }

  return (
    <aside className="w-64 h-screen max-h-screen fixed left-0 top-0 bg-zinc-950 border-r border-white/10 flex flex-col pt-8 pb-4 z-50">
      <div className="px-8 mb-12 flex flex-col items-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-df-purple/5 blur-3xl rounded-full"></div>
        <Link href="/" className="group flex flex-col items-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-df-purple to-df-blue flex items-center justify-center p-0.5 mb-3 hover:rotate-3 transition-transform overflow-hidden relative shadow-2xl shadow-df-purple/20">
            <div className="w-full h-full bg-black rounded-[0.9rem] flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <Image src={getMediaUrl(user.profileImage)} alt="DF" width={56} height={56} className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-xl text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 tracking-tighter">DF</span>
              )}
            </div>
          </div>
          <span className="font-black text-[10px] uppercase tracking-[0.5em] text-df-purple group-hover:text-white transition-colors">Sistema Kernel</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all relative group ${
                isActive 
                  ? 'text-white glass-purple shadow-[inset_0_0_20px_rgba(123,47,242,0.05)]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-df-purple rounded-r-full shadow-[0_0_10px_rgba(123,47,242,0.5)]"
                />
              )}
              <span className={`${isActive ? 'text-df-purple animate-pulse' : 'group-hover:text-df-purple transition-colors'}`}>{link.icon}</span>
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto space-y-6">
        <div className="glass p-4 rounded-2xl border-white/5 space-y-2">
            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-500">
                <span>Estado Nodo</span>
                <span className={`${systemStatus?.database === 'Online' ? 'text-df-green' : 'text-red-500'} animate-pulse uppercase`}>
                  {systemStatus?.database || 'Sincronizando...'}
                </span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-df-purple rounded-full transition-all duration-1000"
                  style={{ width: systemStatus ? '100%' : '33%' }}
                ></div>
            </div>
            <p className="text-[7px] font-mono text-zinc-600 uppercase">
              Uptime: {liveUptime !== null ? formatUptime(liveUptime) : '---'}
            </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-transparent hover:border-red-500/20"
        >
          <FiLogOut /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
