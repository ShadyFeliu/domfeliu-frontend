'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Música', href: '/#music' },
  { name: 'Eventos', href: '/#events' },
  { name: 'Galería', href: '/#gallery' },
  { name: 'Contacto', href: '/#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Only use smooth scroll on home page
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-6 md:top-10 inset-x-6 md:inset-x-10 transition-all duration-500 mx-auto max-w-5xl ${
          scrolled ? 'glass py-2 rounded-2xl shadow-2xl shadow-black/40 border-white/10' : 'bg-transparent py-4 border-transparent'
        } border ${isOpen ? 'z-40' : 'z-50'}`}
      >
      {/* Corner Brackets for HUD feel - Responsive pinning */}
      <div className="corner-bracket corner-bracket-tl w-2 h-2 sm:w-4 sm:h-4 opacity-30 transition-all duration-500" />
      <div className="corner-bracket corner-bracket-tr w-2 h-2 sm:w-4 sm:h-4 opacity-30 transition-all duration-500" />
      <div className="corner-bracket corner-bracket-bl w-2 h-2 sm:w-4 sm:h-4 opacity-30 transition-all duration-500" />
      <div className="corner-bracket corner-bracket-br w-2 h-2 sm:w-4 sm:h-4 opacity-30 transition-all duration-500" />
        
        <div className="w-full px-4 sm:px-6 flex justify-between items-center relative">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-df-purple to-df-blue flex items-center justify-center p-0.5 glow-purple transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <span className="font-bold text-base tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">DF</span>
              </div>
            </div>
            <span className="font-bold text-lg tracking-wider uppercase hidden sm:block">Dom Feliu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-white transition-all relative group py-2"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-df-purple to-df-magenta scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="absolute -top-1 -right-1 w-1 h-1 bg-df-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></span>
              </Link>
            ))}
            <Link 
              href="/#contact"
              onClick={(e) => handleLinkClick(e, '/#contact')}
              className="group relative px-6 py-2 rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl shadow-df-purple/10 border border-white/5 hover:border-df-purple/30"
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-df-purple/10 transition-colors duration-500"></div>
              <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.3em] text-white group-hover:text-df-purple transition-colors duration-500">
                Contratación
              </span>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden relative z-50 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white active:scale-90 transition-transform"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation - Full Screen HUD Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/98 md:hidden overflow-hidden"
          >
              <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent z-20"></div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent z-20"></div>
              
              {/* Internal HUD Brackets */}
              <div className="absolute inset-8 pointer-events-none opacity-20">
                <div className="corner-bracket corner-bracket-tl w-16 h-16" />
                <div className="corner-bracket corner-bracket-tr w-16 h-16" />
                <div className="corner-bracket corner-bracket-bl w-16 h-16" />
                <div className="corner-bracket corner-bracket-br w-16 h-16" />
              </div>

              {/* Decorative Scanline inside Menu */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-df-purple/5 to-transparent h-1/2 animate-scanline pointer-events-none opacity-40"></div>

              {/* Tactical Close Button - Sitting inside the main HUD Brackets with margin */}
              <button 
                className="absolute top-14 right-14 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white active:scale-90 transition-transform z-50 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <FiX size={20} />
              </button>

              <div className="flex flex-col items-center justify-center h-full gap-10 relative z-10 px-6">
                  {/* Tactical Status Tag */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[8px] font-mono text-df-purple uppercase tracking-[0.4em]">Nav_Protocol_v4.0</span>
                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-df-purple animate-pulse"></div>
                    </div>
                  </div>

                  {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <Link 
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className="text-2xl font-black uppercase tracking-[0.5em] text-zinc-500 hover:text-white transition-all relative group flex items-center gap-4"
                        >
                          <span className="text-[10px] font-mono text-df-purple opacity-40">0{i+1}</span>
                          <span className="group-hover:translate-x-2 transition-transform">{link.name}</span>
                        </Link>
                      </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-[280px]"
                  >
                    <Link 
                        href="/#contact"
                        onClick={(e) => handleLinkClick(e, '/#contact')}
                        className="w-full block py-6 rounded-2xl bg-zinc-950 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-xs text-center relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-df-purple/0 via-df-purple/10 to-df-purple/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10 group-hover:text-df-purple transition-colors">Contratación</span>
                    </Link>
                  </motion.div>
                  
                  {/* Bottom Build Indicator */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[7px] font-mono text-zinc-700 uppercase tracking-widest">
                    Kernel_System_Active // 2026
                  </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
