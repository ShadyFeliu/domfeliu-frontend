import { create } from 'zustand';
import { Track } from '@/types';

interface AudioState {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  playbackRate: number;
  isExpanded: boolean;
  setTracks: (tracks: Track[]) => void;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  tracks: [],
  currentTrackIndex: 0,
  isPlaying: false,
  isMuted: false,
  playbackRate: 1,
  isExpanded: false, // Starts minimized or hidden if no tracks
  
  setTracks: (tracks) => set({ tracks }),
  
  playTrack: (index) => set({ 
    currentTrackIndex: index, 
    isPlaying: true,
    isExpanded: true 
  }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  nextTrack: () => set((state) => ({ 
    currentTrackIndex: state.tracks.length > 0 ? (state.currentTrackIndex + 1) % state.tracks.length : 0 
  })),
  
  prevTrack: () => set((state) => ({ 
    currentTrackIndex: state.tracks.length > 0 ? (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length : 0 
  })),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  
  setExpanded: (expanded) => set({ isExpanded: expanded }),
}));
