import SectionWrapper from '@/components/shared/SectionWrapper';
import PlaylistView from '@/components/audio/PlaylistView';
import { Track } from '@/types';
import { API_URL } from '@/lib/api';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';

async function getTracks(): Promise<Track[]> {
  try {
    const res = await fetch(`${API_URL}/tracks`, { 
      next: { revalidate: 60 },
      // Allow fallback if backend is down during dev
    }).catch(() => null);
    
    if (!res || !res.ok) {
      console.warn('Failed to fetch tracks, returning empty array');
      return [];
    }
    
    return await res.json() as Track[];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
}

export default async function MusicSection() {
  const tracks = await getTracks();
  const latestTrack = tracks.length > 0 ? tracks[0] : null;

  return (
    <SectionWrapper id="music" className="bg-[#050505] relative min-h-screen flex items-center py-32 overflow-hidden">
      {/* Mesh Gradient Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[40%] h-[40%] bg-df-magenta/5 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-1/4 left-0 w-[40%] h-[40%] bg-df-purple/5 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col mb-20 max-w-3xl">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-df-magenta mb-4 opacity-70 italic">Archivo Sonoro</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-[-0.02em] text-white">
            Transmisiones <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">de Audio</span>
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-df-magenta to-transparent mt-8 rounded-full"></div>
          <p className="mt-8 text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl opacity-80">
            Selecciones Open Format: Urbano, Comercial y Electrónica. Escucha el catálogo completo en todas las plataformas de audio.
          </p>
        </div>

        {/* Audio Player Infrastructure */}
        <div className="w-full my-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {tracks.length > 0 ? (
            <PlaylistView tracks={tracks} />
          ) : (
            <div className="w-full glass rounded-4xl p-24 text-center border border-white/5 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 rounded-full border-2 border-df-magenta border-t-transparent animate-spin"></div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600">Señal Perdida: Sincronizando Archivo...</p>
            </div>
          )}
        </div>

        {/* Tactical Streaming Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-32">
          <div className="glass p-10 rounded-4xl flex flex-col gap-8 group hover:bg-white/5 transition-all duration-700 border border-white/5 relative overflow-hidden">
            <div className="corner-bracket corner-bracket-tl opacity-20 group-hover:opacity-40" />
            <div className="corner-bracket corner-bracket-br opacity-20 group-hover:opacity-40" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1DB954]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#1DB954]/10 transition-colors"></div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] shadow-lg shadow-[#1DB954]/10 group-hover:scale-110 transition-transform duration-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Sector Spotify</h3>
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700 bg-white/5 px-3 py-1 rounded-full font-mono">NODE_P_01</span>
            </div>
            {/* Streaming Platform Nodes */}
            <div className="flex gap-4 mt-8">
              {latestTrack?.spotifyUrl && (
                <a 
                  href={latestTrack.spotifyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-df-green hover:border-df-green/30 transition-all hover:scale-110 shadow-xl"
                  title="Stream on Spotify"
                >
                  <FaSpotify size={20} />
                </a>
              )}
              {latestTrack?.soundcloudUrl && (
                <a 
                  href={latestTrack.soundcloudUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-df-orange hover:border-df-orange/30 transition-all hover:scale-110 shadow-xl"
                  title="Stream on SoundCloud"
                >
                  <FaSoundcloud size={20} />
                </a>
              )}
            </div>
            
            <div className="w-full h-40 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-white/10 transition-colors">
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-[#1DB954]/5"></div>
                <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Sincronizando Metadatos de Spotify API...</p>
            </div>
          </div>

          <div className="glass p-10 rounded-4xl flex flex-col gap-8 group hover:bg-white/5 transition-all duration-700 border border-white/5 relative overflow-hidden">
            <div className="corner-bracket corner-bracket-tr opacity-20 group-hover:opacity-40" />
            <div className="corner-bracket corner-bracket-bl opacity-20 group-hover:opacity-40" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5500]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#ff5500]/10 transition-colors"></div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-[#ff5500]/10 flex items-center justify-center text-[#ff5500] shadow-lg shadow-[#ff5500]/10 group-hover:scale-110 transition-transform duration-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.59 13.911V5.048c0-.361-.282-.644-.643-.644-.361 0-.644.283-.644.644v8.863c0 .362.283.644.644.644.361 0 .643-.282.643-.644zm-2.827-.643V6.26c0-.361-.282-.643-.643-.643-.362 0-.645.282-.645.643v7.008c0 .362.283.644.645.644.361 0 .643-.282.643-.644zm-2.827-.122v-5.26c0-.36-.282-.643-.644-.643-.361 0-.643.283-.643.643v5.26c0 .362.282.645.643.645.362 0 .644-.283.644-.645zm-2.827-.122v-3.763c0-.361-.282-.643-.643-.643-.362 0-.645.282-.645.643v3.763c0 .362.283.644.645.644.361 0 .643-.282.643-.644zM.282 11.516v-1.267C.127 10.25 0 10.378 0 10.534v1.748c0 .157.127.284.282.284.156 0 .282-.127.282-.284zm11.95 2.395V3.834c0-.362.283-.645.644-.645.362 0 .645.283.645.645v10.077c0 .362-.283.644-.645.644-.361 0-.644-.282-.644-.644zm2.827-1.008V4.843c0-.362.282-.645.644-.645.36 0 .643.283.643.645v8.06c0 .362-.283.644-.643.644-.362 0-.644-.282-.644-.644zm2.828-.644V5.852c0-.362.282-.645.644-.645.362 0 .645.283.645.645v6.407c0 .361-.283.643-.645.643-.362 0-.644-.282-.644-.643zM23.012 8.78c-1.465 0-2.651.986-2.651 2.203v2.885c0 .361-.283.643-.645.643h3.582c.421 0 .702-.34.702-.763v-2.765c0-1.217-1.186-2.203-2.65-2.203h-1.353l1.109-1.291c.218-.255.45-.487.45-.889 0-.698-.567-1.265-1.266-1.265-.457 0-.909.281-1.107.69l-.791 1.637h2.62z"/></svg>
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Celda SoundCloud</h3>
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700 bg-white/5 px-3 py-1 rounded-full font-mono">LINK_S_02</span>
            </div>
            
            <div className="w-full h-40 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-white/10 transition-colors">
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-[#ff5500]/5"></div>
                <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Iniciando Transmisión de Forma de Onda...</p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
