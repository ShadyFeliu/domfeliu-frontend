'use client';

import { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2, FiVolumeX, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '@/store/audioStore';
import { getMediaUrl } from '@/lib/api';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';

export default function GlobalAudioPlayer() {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    isMuted,
    playbackRate,
    isExpanded,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleMute,
    setPlaybackRate,
    setExpanded,
    playTrack,
  } = useAudioStore();

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyser = useAudioVisualizer(audioRef, isPlaying);
  const activeTrack = tracks[currentTrackIndex];

  // Keep audio hardware synced with Zustand store
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, tracks]);

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) return;
      
      const animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / (bufferLength / 2)) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength / 2; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, 'rgba(123, 47, 242, 0.2)'); // Purple
        gradient.addColorStop(1, 'rgba(0, 242, 255, 0.8)'); // Blue

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
      
      return animationId;
    };

    const id = draw();
    return () => {
      if (id) cancelAnimationFrame(id);
    };
  }, [analyser, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.muted = isMuted;
    }
  }, [playbackRate, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      if (total) {
        setDuration(total);
        setProgress((current / total) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playbackRates = [1, 1.25, 1.5];
  const nextRate = () => {
    const currentIndex = playbackRates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % playbackRates.length;
    setPlaybackRate(playbackRates[nextIndex] as number);
  };

  if (!tracks || tracks.length === 0) {
    return null;
  }

  // Floating Mini Pill
  if (!isExpanded) {
    return (
     <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-100 glass px-4 py-3 rounded-full flex items-center gap-4 shadow-2xl border border-white/10 group cursor-pointer hover:bg-white/5 transition-all"
        onClick={() => setExpanded(true)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg"
        >
          {isPlaying ? <FiPause size={18} className="fill-current" /> : <FiPlay size={18} className="fill-current ml-1" />}
        </button>
        <div className="flex flex-col mr-4">
          <span className="text-sm font-bold text-white max-w-[120px] truncate">{activeTrack?.title}</span>
          <span className="text-xs text-df-green font-mono uppercase tracking-wider">{activeTrack?.artist}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          className="text-gray-400 hover:text-white"
        >
          <FiMaximize2 size={18} />
        </button>
      </motion.div>
     </AnimatePresence>
    );
  }

  // Expanded Original Player
  return (
    <AnimatePresence>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className="fixed bottom-6 right-6 z-100 w-full max-w-md sm:max-w-lg glass rounded-3xl p-6 shadow-2xl overflow-hidden group border border-white/10"
    >
      {/* Decorative glow */}
      <div className={`absolute -inset-4 bg-linear-to-r from-df-purple/50 to-df-blue/50 opacity-0 ${isPlaying ? 'opacity-20 blur-xl' : ''} transition-opacity duration-1000 -z-10`}></div>
      
      <audio
        ref={audioRef}
        src={getMediaUrl(activeTrack?.audioUrl)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Visualizer Canvas */}
      <canvas 
        ref={canvasRef}
        height={60}
        className="w-full mb-4 opacity-50"
      />

      {/* Top Header */}
      <div className="flex justify-between items-center mb-4">
         <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Sonando Ahora</span>
         <button 
           onClick={() => setExpanded(false)}
           className="text-gray-400 hover:text-white p-1"
         >
           <FiMinimize2 size={18} />
         </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300 tracking-tight">
            {activeTrack?.title}
          </h3>
          <p className="text-df-green mt-1 font-mono text-xs tracking-widest uppercase">
            {activeTrack?.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-df-purple hover:h-1.5 transition-all"
          />
          <div className="flex justify-between text-[10px] font-medium text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-2 px-2">
          {/* Left accessories */}
          <div className="flex items-center w-1/4">
            <button 
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
            </button>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-5 w-1/2">
            <button 
              onClick={prevTrack}
              className="text-gray-300 hover:text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <FiSkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(123,47,242,0.5)]"
            >
              {isPlaying ? <FiPause size={20} className="fill-current" /> : <FiPlay size={20} className="fill-current ml-1" />}
            </button>
            
            <button 
              onClick={nextTrack}
              className="text-gray-300 hover:text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <FiSkipForward size={20} />
            </button>
          </div>

          {/* Right accessories */}
          <div className="flex justify-end w-1/4">
            <button 
              onClick={nextRate}
              className="text-[10px] font-mono font-bold px-2 py-1 rounded-full border border-gray-600 text-gray-300 hover:border-df-purple hover:text-white transition-all"
            >
              {playbackRate}x
            </button>
          </div>
        </div>
      </div>
      
      {/* Track listing quick selector */}
      {tracks.length > 1 && (
        <div className="mt-6 pt-3 border-t border-white/5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
          {tracks.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => playTrack(idx)}
              className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-all ${
                idx === currentTrackIndex 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] opacity-50 w-3">{idx + 1}</span>
                <span className="font-medium text-sm truncate max-w-[200px]">{track.title}</span>
              </div>
              {idx === currentTrackIndex && isPlaying && (
                <div className="flex items-end gap-1 h-2">
                  <motion.div animate={{ height: [2, 8, 2] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-df-magenta rounded-full"></motion.div>
                  <motion.div animate={{ height: [4, 6, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-0.5 bg-df-purple rounded-full"></motion.div>
                  <motion.div animate={{ height: [2, 8, 2] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }} className="w-0.5 bg-df-blue rounded-full"></motion.div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
    </AnimatePresence>
  );
}
