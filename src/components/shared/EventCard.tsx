import { Event } from '@/types';
import { format } from 'date-fns';
import { FiMapPin, FiExternalLink } from 'react-icons/fi';
import { getMediaUrl } from '@/lib/api';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  
  return (
    <div className="w-full glass rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:bg-white/5 transition-all duration-700 border border-white/5 relative overflow-hidden">
      
      {/* Dynamic Aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-df-blue/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-df-blue via-df-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
 
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center flex-1 relative z-10 w-full">
        {/* Event Banner / Date Block */}
        <div className="flex items-center gap-6">
          {/* Holographic Date Block */}
          <div className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 group-hover:border-df-blue/30 transition-all duration-700 relative overflow-hidden group/date shrink-0">
            <div className="absolute inset-0 bg-linear-to-br from-df-blue/20 to-transparent opacity-0 group-hover/date:opacity-100 transition-opacity"></div>
            <span className="text-[9px] font-black text-df-blue uppercase tracking-[0.3em] mb-1">{format(eventDate, 'MMM')}</span>
            <span className="text-3xl font-black text-white leading-none">{format(eventDate, 'dd')}</span>
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">{format(eventDate, 'yyyy')}</span>
          </div>

          {/* Event Mini Image if available */}
          {event.imageUrl && (
            <div className="hidden sm:block w-24 h-24 rounded-2xl overflow-hidden border border-white/5 relative group/img">
               <Image 
                 src={getMediaUrl(event.imageUrl)} 
                 alt={event.title} 
                 fill 
                 className="object-cover transition-transform duration-700 group-hover/img:scale-110"
               />
               <div className="absolute inset-0 bg-df-blue/10 mix-blend-overlay"></div>
            </div>
          )}
        </div>
 
        {/* Transmission Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-zinc-500 transition-all duration-500 tracking-tight">
            {event.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-[9px] md:text-10 font-black uppercase tracking-[0.2em] text-zinc-500">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-df-magenta animate-pulse" />
              <span className="text-zinc-400">{event.venue}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-df-blue">{event.city}</span>
              <span className="opacity-30">/</span>
              <span>{event.country}</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Protocol Actions */}
      <div className="w-full md:w-auto mt-6 md:mt-0 relative z-10">
        {event.ticketUrl ? (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative px-8 py-3 rounded-xl overflow-hidden flex items-center justify-center gap-2.5 transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-df-blue/20"
          >
            <div className="absolute inset-0 bg-white group-hover/btn:bg-df-blue transition-colors duration-500"></div>
            <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.3em] text-black group-hover/btn:text-white transition-colors duration-500 flex items-center gap-2.5">
              Entradas <FiExternalLink className="group-hover/btn:rotate-45 transition-transform" />
            </span>
          </a>
        ) : (
          <div className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-600 font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center min-w-[140px]">
            Protocolo Pendiente
          </div>
        )}
      </div>
    </div>
  );
}
