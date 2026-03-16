import { Metadata, ResolvingMetadata } from 'next';
import { api, getMediaUrl } from '@/lib/api';
import { Event } from '@/types';
import SectionWrapper from '@/components/shared/SectionWrapper';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  
  try {
    const event = await api.get<Event>(`/events/${id}`);
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${event.title} | Dom Feliu`,
      description: `Próximo evento: ${event.title} en ${event.venue}, ${event.city}. Descubre más en Dom Feliu Official.`,
      openGraph: {
        title: event.title,
        description: `Evento oficial de Dom Feliu.`,
        images: event.imageUrl ? [getMediaUrl(event.imageUrl), ...previousImages] : previousImages,
      },
    };
  } catch {
    return {
      title: 'Evento no encontrado | Dom Feliu',
    };
  }
}

export default async function EventPage({ params }: Props) {
  const id = (await params).id;
  let event: Event | null = null;

  try {
    event = await api.get<Event>(`/events/${id}`);
  } catch {
    // Handle error
  }

  if (!event) {
    return (
      <SectionWrapper className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Evento no encontrado</h1>
          <Link href="/" className="text-df-blue hover:underline uppercase text-xs font-black tracking-widest">
            Volver al Inicio
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  const date = new Date(event.date);

  return (
    <SectionWrapper className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors uppercase text-[10px] font-black tracking-widest">
          <FiArrowLeft /> Volver al Inicio
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-4xl overflow-hidden glass border border-white/10 mb-12">
             {event.imageUrl ? (
                <Image 
                  src={getMediaUrl(event.imageUrl)} 
                  alt={event.title}
                  fill
                  className="object-cover"
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <FiCalendar size={80} className="text-zinc-800" />
                </div>
             )}
             <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
             
             <div className="absolute bottom-10 left-10">
                <span className="bg-df-blue text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                   Confirmado
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  {event.title}
                </h1>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="glass p-8 rounded-3xl border border-white/5">
                      <FiCalendar size={24} className="text-df-blue mb-4" />
                      <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-1">Fecha</h3>
                      <p className="text-white font-black uppercase tracking-tight">
                         {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                   </div>
                   
                   <div className="glass p-8 rounded-3xl border border-white/5">
                      <FiMapPin size={24} className="text-df-blue mb-4" />
                      <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-1">Ubicación</h3>
                      <p className="text-white font-black uppercase tracking-tight">
                         {event.venue}, {event.city}
                      </p>
                   </div>
                </div>
             </div>
             
             <div>
                {event.ticketUrl && (
                  <a 
                    href={event.ticketUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white text-black p-8 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-df-blue hover:text-white transition-all flex flex-col items-center justify-center gap-4 text-center group"
                  >
                    <FiExternalLink size={24} className="group-hover:rotate-12 transition-transform" />
                    Adquirir Entradas
                  </a>
                )}
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
