'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminStats } from '@/types';
import Link from 'next/link';
import { FiMusic, FiCalendar, FiImage, FiMessageSquare, FiActivity, FiServer, FiShield } from 'react-icons/fi';

interface SystemStatus {
  database: string;
  version: string;
  environment: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminStats, systemStatus] = await Promise.all([
          api.get<AdminStats>('/admin/stats'),
          api.get<SystemStatus>('/status').catch(() => ({ database: 'Offline', version: '2.0.0', environment: 'production' }))
        ]);

        setStats(adminStats);
        setStatus(systemStatus);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
        title: 'Pistas Totales', 
        value: stats?.tracks.total || 0, 
        detail: `${stats?.tracks.published || 0} Publicadas`,
        icon: <FiMusic size={24} />, 
        href: '/admin/tracks', 
        gradient: 'from-df-purple/40 to-df-purple/10',
        iconBg: 'bg-df-purple',
        border: 'border-df-purple/20' 
    },
    { 
        title: 'Eventos', 
        value: stats?.events.total || 0, 
        detail: `${stats?.events.upcoming || 0} Próximos`,
        icon: <FiCalendar size={24} />, 
        href: '/admin/events', 
        gradient: 'from-df-blue/40 to-df-blue/10',
        iconBg: 'bg-df-blue',
        border: 'border-df-blue/20' 
    },
    { 
        title: 'Galería', 
        value: stats?.gallery.total || 0, 
        detail: `${stats?.gallery.images || 0} Fotos, ${stats?.gallery.videos || 0} Videos`,
        icon: <FiImage size={24} />, 
        href: '/admin/gallery', 
        gradient: 'from-df-green/40 to-df-green/10',
        iconBg: 'bg-df-green',
        border: 'border-df-green/20' 
    },
    { 
        title: 'Mensajes', 
        value: stats?.messages.total || 0, 
        detail: `${stats?.messages.unread || 0} Sin leer`,
        icon: <FiMessageSquare size={24} />, 
        href: '/admin/messages', 
        gradient: 'from-df-magenta/40 to-df-magenta/10',
        iconBg: 'bg-df-magenta',
        border: 'border-df-magenta/20' 
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center -mt-20">
        <div className="w-10 h-10 border-2 border-df-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Vista General del Sistema</h1>
        <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em] font-bold opacity-60 italic">Inteligencia de Plataforma en Tiempo Real</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {statCards.map((stat, i) => (
          <Link 
            key={i} 
            href={stat.href}
            className={`glass p-8 rounded-4xl flex flex-col gap-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 border ${stat.border}`}
          >
            {/* Corner Brackets */}
            <div className="corner-bracket corner-bracket-tl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="corner-bracket corner-bracket-tr opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="corner-bracket corner-bracket-bl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="corner-bracket corner-bracket-br opacity-20 group-hover:opacity-40 transition-opacity" />

            {/* Background Grain/Deco */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-bl ${stat.gradient} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            
            <div className="flex justify-between items-center relative z-10">
              <div className={`p-4 rounded-2xl ${stat.iconBg} text-white shadow-xl shadow-${stat.iconBg.split('-')[1]}/30 group-hover:rotate-6 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <span className="text-4xl font-black tracking-tighter text-white group-hover:translate-x-[-4px] transition-transform font-mono">{stat.value}</span>
            </div>
            
            <div className="relative z-10 flex flex-col gap-1">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black group-hover:text-white transition-colors leading-none">
                {stat.title}
              </h3>
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 group-hover:text-white/60 transition-colors">
                {stat.detail}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recently Added Section */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-3">
          Actividad Reciente
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Latest Track */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <p className="text-[9px] uppercase tracking-widest font-black text-df-purple">Última Pista</p>
            {stats?.tracks.latest ? (
              <div>
                <p className="text-white font-bold truncate">{stats.tracks.latest.title}</p>
                <p className="text-xs text-gray-500 uppercase tracking-tighter">{new Date(stats.tracks.latest.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">No hay pistas</p>
            )}
          </div>

          {/* Latest Event */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <p className="text-[9px] uppercase tracking-widest font-black text-df-blue">Último Evento</p>
            {stats?.events.latest ? (
              <div>
                <p className="text-white font-bold truncate">{stats.events.latest.title}</p>
                <p className="text-xs text-gray-500 uppercase tracking-tighter">{new Date(stats.events.latest.date).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">No hay eventos</p>
            )}
          </div>

          {/* Latest Message */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <p className="text-[9px] uppercase tracking-widest font-black text-df-magenta">Último Mensaje</p>
            {stats?.messages.latest ? (
              <div>
                <p className="text-white font-bold truncate">De: {stats.messages.latest.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-tighter">{new Date(stats.messages.latest.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">No hay mensajes</p>
            )}
          </div>
        </div>
      </div>

      {/* Synchronized System Health Section */}
      <div className="glass p-10 rounded-4xl border border-white/5 space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-df-purple/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
         
        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-df-purple flex items-center gap-3 relative z-10">
          <FiActivity className="animate-pulse" /> Infrastructure Status
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center group/item pb-4 border-b border-white/5">
              <div className="flex items-center gap-4 text-gray-400 group-hover/item:text-white transition-colors">
                <FiServer size={16} className="opacity-50" />
                <span className="text-[11px] uppercase tracking-widest font-black">Database Node</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${status?.database === 'Online' ? 'text-df-green bg-df-green/10 border-df-green/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                {status?.database || 'Syncing...'}
              </span>
            </div>

            <div className="flex justify-between items-center group/item pt-2">
              <div className="flex items-center gap-4 text-gray-400 group-hover/item:text-white transition-colors">
                <FiShield size={16} className="opacity-50" />
                <span className="text-[11px] uppercase tracking-widest font-black">Gateway Environment</span>
              </div>
              <span className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full text-df-blue bg-df-blue/10 border border-df-blue/20">
                {status?.environment || 'Detection...'}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-end bg-white/5 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
             <div className="corner-bracket corner-bracket-tl opacity-10" />
             <div className="corner-bracket corner-bracket-br opacity-10" />
             <p className="text-[10px] uppercase tracking-[0.3em] font-black text-df-magenta mb-2 relative z-10">Build Kernel</p>
             <p className="text-2xl font-black text-white font-mono relative z-10">v{status?.version || '0.0.0'}</p>
             <p className="text-[9px] text-gray-500 font-bold mt-4 uppercase tracking-widest relative z-10">Active & Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
