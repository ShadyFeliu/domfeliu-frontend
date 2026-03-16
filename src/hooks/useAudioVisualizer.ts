'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function useAudioVisualizer(audioRef: React.RefObject<HTMLAudioElement | null>, isPlaying: boolean) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!audioRef.current || !isPlaying || isInitialized.current) return;

    const initAudio = () => {
      try {
        // Create AudioContext only on user interaction (handled by isPlaying check)
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyserNode = ctx.createAnalyser();
        
        // Connect source to analyser and destination
        const source = ctx.createMediaElementSource(audioRef.current!);
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
        
        // Configure analyser
        analyserNode.fftSize = 256;
        
        audioContextRef.current = ctx;
        sourceRef.current = source;
        setAnalyser(analyserNode);
        isInitialized.current = true;
      } catch (err) {
        console.error("Audio Visualizer Init Error:", err);
      }
    };

    initAudio();

    return () => {
      // Cleanup usually happens on component unmount, but since this is a global player,
      // we might want to keep the context alive.
    };
  }, [audioRef, isPlaying]);

  return analyser;
}
