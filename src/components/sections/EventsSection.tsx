import SectionWrapper from '@/components/shared/SectionWrapper';
import EventCard from '@/components/shared/EventCard';
import { Event } from '@/types';
import { API_URL } from '@/lib/api';
import { FiMapPin } from 'react-icons/fi';

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/events`, { next: { revalidate: 60 } }).catch(() => null);
    
    if (!res || !res.ok) {
      console.warn('Failed to fetch events');
      return [];
    }
    
    // Sort events by date ascending, keeping only future events
    const events = await res.json() as Event[];
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsSection() {
  const upcomingEvents = await getEvents();

  return (
    <SectionWrapper id="events" className="bg-[#050505] relative min-h-screen py-32 overflow-hidden">
      {/* Mesh Gradient Aura */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[40%] h-[40%] bg-df-blue/5 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-1/4 right-0 w-[40%] h-[40%] bg-df-purple/5 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="flex flex-col max-w-3xl">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-df-blue mb-4 opacity-70 italic">Protocolo Sincronizado</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-[-0.02em] text-white">
              Próximos <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Eventos</span>
            </h2>
            <div className="w-16 h-1 bg-linear-to-r from-df-blue to-transparent mt-8 rounded-full"></div>
            <p className="mt-8 text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl opacity-80">
              Manifestaciones sonoras en vivo. Únete a la frecuencia en las siguientes coordenadas.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="w-full glass rounded-4xl p-24 text-center border border-white/5 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                <FiMapPin className="text-zinc-700" size={32} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600 mb-2">No hay coordenadas de objetivos activos</p>
                <p className="text-xs text-zinc-400 font-medium italic opacity-60">Sigue el perímetro en redes sociales para próximas transmisiones.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
