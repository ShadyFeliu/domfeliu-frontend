export const dynamic = 'force-dynamic';
import { Metadata, ResolvingMetadata } from 'next';
import { api, getMediaUrl } from '@/lib/api';
import { Track } from '@/types';
import SectionWrapper from '@/components/shared/SectionWrapper';
import Link from 'next/link';
import { FiArrowLeft, FiPlay, FiMusic } from 'react-icons/fi';
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
    const track = await api.get<Track>(`/tracks/${id}`);
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${track.title} | Dom Feliu`,
      description: `Escucha "${track.title}" de ${track.artist} en Dom Feliu Official.`,
      openGraph: {
        title: track.title,
        description: `Track oficial de Dom Feliu.`,
        images: track.coverUrl ? [getMediaUrl(track.coverUrl), ...previousImages] : previousImages,
      },
    };
  } catch {
    return {
      title: 'Track no encontrado | Dom Feliu',
    };
  }
}

export default async function TrackPage({ params }: Props) {
  const id = (await params).id;
  let track: Track | null = null;

  try {
    track = await api.get<Track>(`/tracks/${id}`);
  } catch {
    // Handle error or let Next.js show 404
  }

  if (!track) {
    return (
      <SectionWrapper className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Pista no encontrada</h1>
          <Link href="/" className="text-df-blue hover:underline uppercase text-xs font-black tracking-widest">
            Volver al Inicio
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors uppercase text-[10px] font-black tracking-widest">
          <FiArrowLeft /> Volver al Inicio
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-4xl overflow-hidden glass border border-white/10 group">
             {track.coverUrl ? (
                <Image 
                  src={getMediaUrl(track.coverUrl)} 
                  alt={track.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <FiMusic size={80} className="text-zinc-800" />
                </div>
             )}
             <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          </div>
          
          <div className="space-y-8">
            <div>
              <span className="text-df-blue text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Track Oficial</span>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                {track.title}
              </h1>
              <p className="text-xl text-zinc-400 font-bold uppercase tracking-tight">{track.artist}</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
               <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-df-blue hover:text-white transition-all flex items-center gap-3 active:scale-95">
                  <FiPlay /> Reproducir Ahora
               </button>
               
               {track.spotifyUrl && (
                 <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" className="glass px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest text-white border border-white/5 hover:border-white/20 transition-all flex items-center gap-3">
                   Spotify
                 </a>
               )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
