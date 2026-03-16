'use client';

import { useState, useEffect } from 'react';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { GalleryItem } from '@/types';
import Image from 'next/image';
import { api, getMediaUrl } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import { Skeleton } from '@/components/ui/Skeleton';

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.get<GalleryItem[]>('/gallery');
        setItems(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const openLightbox = (index: number) => {
    setSelectedItem(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  const nextItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedItem === null) return;
    setSelectedItem((selectedItem + 1) % items.length);
  };

  const prevItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedItem === null) return;
    setSelectedItem((selectedItem - 1 + items.length) % items.length);
  };

  return (
    <SectionWrapper id="gallery" className="bg-[#050505] relative min-h-screen py-32 overflow-hidden">
        {/* Mesh Gradient Aura */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/3 left-0 w-[50%] h-[50%] bg-df-purple/5 blur-[120px] rounded-full animate-blob"></div>
            <div className="absolute bottom-1/3 right-0 w-[50%] h-[50%] bg-df-blue/5 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
            
            <div className="flex flex-col items-center text-center mb-24">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-df-purple mb-4 opacity-70 italic">Archivos Visuales</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-[-0.02em] text-white">
                    Diario de <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Protocolo</span>
                </h2>
                <div className="w-16 h-1 bg-linear-to-r from-df-purple to-transparent mt-8 rounded-full"></div>
            </div>

            {!loading ? (
              items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  {items.map((item, index) => (
                      <motion.div 
                          key={item.id} 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => openLightbox(index)}
                          className="relative group overflow-hidden rounded-4xl bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-700 hover:scale-[1.02] aspect-square cursor-pointer"
                      >
                          {item.type === 'video' ? (
                              <div className="relative w-full h-full">
                                  <video 
                                      src={getMediaUrl(item.url)} 
                                      className="w-full h-full object-cover transition-all duration-1000"
                                      autoPlay 
                                      muted 
                                      loop 
                                      playsInline
                                  />
                                  <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-10 border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                  </div>
                              </div>
                          ) : (
                              <div className="relative w-full h-full">
                                  <Image
                                      src={getMediaUrl(item.url)}
                                      alt={item.caption || 'Gallery image'}
                                      fill
                                      className="object-cover transition-all duration-1000 group-hover:scale-105"
                                  />
                                  <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                                      <FiMaximize2 className="w-4 h-4" />
                                  </div>
                              </div>
                          )}
                          
                          {/* Interactive Overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                              <div className="w-full transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                  <div className="w-8 h-1 bg-df-purple rounded-full mb-4"></div>
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-df-purple mb-1">Observación</h4>
                                  <p className="text-white text-lg font-bold leading-tight max-w-[80%]">{item.caption || 'Protocolo sin Etiqueta'}</p>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
              ) : (
              <div className="w-full max-w-4xl mx-auto glass rounded-4xl p-20 text-center border border-white/5 flex flex-col items-center gap-6">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600">No hay activos visuales registrados.</p>
              </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-4xl" />
                ))}
              </div>
            )}
        </div>

        {/* Lightbox / Full-screen View */}
        <AnimatePresence>
          {selectedItem !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-200 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              onClick={closeLightbox}
            >
                <button 
                  onClick={closeLightbox}
                  className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-210 p-4"
                >
                  <FiX size={32} />
                </button>

                <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                    {items.length > 1 && (
                      <>
                        <button 
                          onClick={prevItem}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-210 group"
                        >
                          <FiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={nextItem}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-210 group"
                        >
                          <FiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </>
                    )}

                    <motion.div 
                      key={items[selectedItem].id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="relative w-full h-full max-w-6xl max-h-[80vh] flex flex-col items-center gap-8"
                    >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                          {items[selectedItem].type === 'video' ? (
                            <video 
                              src={getMediaUrl(items[selectedItem].url)} 
                              className="w-full h-full object-contain"
                              autoPlay 
                              controls 
                              playsInline
                            />
                          ) : (
                            <Image
                              src={getMediaUrl(items[selectedItem].url)}
                              alt={items[selectedItem].caption || ''}
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                        
                        {items[selectedItem].caption && (
                          <div className="text-center max-w-2xl">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-df-purple mb-3">Especificación</h4>
                             <p className="text-white text-xl md:text-2xl font-black uppercase tracking-tight italic">
                                &quot;{items[selectedItem].caption}&quot;
                             </p>
                          </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
    </SectionWrapper>
  );
}
