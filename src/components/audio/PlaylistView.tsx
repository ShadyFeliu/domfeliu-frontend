'use client';

import { useAudioStore } from '@/store/audioStore';
import { Track } from '@/types';
import { FiPlay, FiSpeaker } from 'react-icons/fi';

export default function PlaylistView({ tracks }: { tracks: Track[] }) {
  const { setTracks, playTrack, currentTrackIndex, isPlaying, tracks: currentStoreTracks } = useAudioStore();

  const isCurrentPlaylist = currentStoreTracks.length > 0 && currentStoreTracks[0].id === tracks[0].id;

  const handlePlay = (idx: number) => {
    // If not already this playlist, set it.
    if (!isCurrentPlaylist) {
      setTracks(tracks);
    }
    playTrack(idx);
  };

  if (tracks.length === 0) {
    return (
      <div className="w-full max-w-3xl glass rounded-3xl p-12 text-center border-dashed border-2 border-white/10">
        <p className="text-gray-400 text-lg">Las pistas se están actualizando actualmente.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-df-blue/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
         <div className="flex flex-col text-center sm:text-left">
           <h3 className="text-lg font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">Playlist Oficial</h3>
           <p className="text-[10px] text-df-green font-mono uppercase tracking-widest mt-0.5">Originales de Dom Feliu</p>
         </div>
         <button 
           onClick={() => handlePlay(0)} 
           className="px-4 py-2 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
         >
           <FiPlay className="fill-current" size={12} /> Reproducir Todo
         </button>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        {tracks.map((track, idx) => {
          const isActive = isCurrentPlaylist && currentTrackIndex === idx;
          return (
            <div 
              key={track.id} 
              className={`flex justify-between items-center rounded-xl p-4 transition-all group/item ${
                isActive ? 'bg-white/10 border border-white/20' : 'bg-black/40 border border-transparent hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                 <span className={`font-mono text-sm w-4 ${isActive ? 'text-df-magenta' : 'text-gray-600'}`}>
                   {isActive && isPlaying ? <FiSpeaker className="animate-pulse text-df-magenta" /> : idx + 1}
                 </span>
                 <div className="flex flex-col">
                   <span className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover/item:text-white'}`}>
                     {track.title}
                   </span>
                   <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">{track.artist}</span>
                 </div>
              </div>
              <button 
                onClick={() => handlePlay(idx)} 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-df-magenta text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white hover:text-black hover:scale-110'
                }`}
              >
                 <FiPlay className="ml-1 fill-current" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
