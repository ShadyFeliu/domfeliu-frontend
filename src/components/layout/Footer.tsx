'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  const socialLinks = [
    { icon: <FaSpotify size={20} />, href: 'https://spotify.com' },
    { icon: <FaSoundcloud size={20} />, href: 'https://soundcloud.com/DomFeliu' },
    { icon: <FiInstagram size={20} />, href: 'https://instagram.com/DomFeliu' },
    { icon: <FiTwitter size={20} />, href: 'https://twitter.com/DomFeliu' },
    { icon: <FiYoutube size={20} />, href: 'https://youtube.com/DomFeliu' },
  ];

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-32 pb-12 relative overflow-hidden">
      {/* Mesh Gradient Accents */}
      <div className="absolute top-0 left-1/4 w-[40%] h-px bg-linear-to-r from-transparent via-df-purple/50 to-transparent"></div>
      <div className="absolute bottom-0 left-[-10%] w-[40%] h-[40%] bg-df-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center gap-16">
            
            {/* Massive Branding */}
            <div className="flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-df-purple to-df-blue flex items-center justify-center p-0.5 glow-purple group-hover:rotate-12 transition-transform duration-700">
                    <div className="w-full h-full bg-black rounded-[1.4rem] flex items-center justify-center">
                        <span className="font-black text-3xl tracking-tighter text-white">DF</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.04em] text-white">
                        Dom <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Feliu</span>
                    </h2>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-df-purple mt-4 opacity-60 italic">Open Format / Urbano / Commercial / Electronica</p>
                </div>
            </div>

            {/* Social Matrix */}
            <div className="flex flex-wrap justify-center items-center gap-6">
                {socialLinks.map((link, i) => (
                    <a 
                    key={i} 
                    href={link.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-df-purple/20 hover:border-df-purple/20 hover:scale-110 active:scale-95 transition-all duration-500 backdrop-blur-md relative group"
                    >
                    <div className="absolute inset-0 bg-df-purple/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">{link.icon}</span>
                    </a>
                ))}
            </div>

            {/* Legal & Meta */}
            <div className="w-full pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-700">
                        &copy; {currentYear} Dom Feliu. Urbano · Commercial · Electrónica.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8">
                    {[
                        { name: 'Privacidad', href: '/privacy' },
                        { name: 'Términos', href: '/terms' },
                        { name: 'Encriptación', href: '/admin/login' }
                    ].map(link => (
                        <Link 
                            key={link.name}
                            href={link.href} 
                            className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
