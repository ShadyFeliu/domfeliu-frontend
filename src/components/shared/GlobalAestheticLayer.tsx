'use client';

import { useEffect, useState } from 'react';

export default function GlobalAestheticLayer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="scanline-overlay text-transparent select-none pointer-events-none" />
      <div className="noise-overlay text-transparent select-none pointer-events-none" />
      <div className="pointer-events-none fixed inset-0 z-9997 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-df-purple/5 blur-[120px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-df-blue/5 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
      </div>
    </>
  );
}
