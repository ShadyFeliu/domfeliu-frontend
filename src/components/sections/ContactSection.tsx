'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMail, FiMapPin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { api } from '@/lib/api';
import SectionWrapper from '@/components/shared/SectionWrapper';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.post('/contacts', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: unknown) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Algo salió mal');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SectionWrapper id="contact" className="relative py-24 overflow-hidden bg-[#050505]">
      {/* Deep Mesh Atmos */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-b from-df-magenta/5 via-transparent to-df-blue/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-24 xl:gap-32">
            
            {/* Left Side: Intelligence Briefing */}
            <div className="lg:w-2/5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-df-green mb-6 opacity-70 italic block">Canal Establecido</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-[-0.02em] text-white">
                  Conexión <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">Segura</span>
                </h2>
                <div className="w-16 h-1 bg-linear-to-r from-df-green to-transparent mt-8 rounded-full"></div>
                
                <p className="mt-8 text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-lg opacity-80">
                  Pasarela directa para contrataciones, sincronización de management y colaboraciones tácticas de audio.
                </p>

                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-df-purple group-hover:bg-df-purple/20 group-hover:border-df-purple/20 group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-df-purple/10">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black mb-1">Comunicaciones Directas</h4>
                      <p className="text-white font-bold tracking-tight text-sm">booking@domfeliu.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-df-blue group-hover:bg-df-blue/20 group-hover:border-df-blue/20 group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-df-blue/10">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black mb-1">Protocolo de Base</h4>
                      <p className="text-white font-bold tracking-tight text-sm">Valencia, España</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-df-green group-hover:bg-df-green/20 group-hover:border-df-green/20 group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-df-green/10">
                      <FiCheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black mb-1">Estado</h4>
                      <p className="text-df-green font-black uppercase tracking-widest text-xs animate-pulse">Operativo</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Data Input Matrix */}
            <div className="lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="glass p-10 md:p-16 rounded-4xl border border-white/5 relative overflow-hidden group/card shadow-3xl shadow-black/50"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent opacity-50 pointer-events-none"></div>
                
                {/* Success Protocol Overlay */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-10"
                    >
                      <div className="w-24 h-24 bg-df-green rounded-full flex items-center justify-center text-black mb-8 shadow-3xl shadow-df-green/40">
                        <FiCheckCircle size={48} className="animate-in zoom-in-50 duration-500" />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-[0.3em] text-white mb-6">Transmisión Recibida</h3>
                      <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-sm">Los datos se han sincronizado correctamente. Se contactará en un plazo de 48 horas.</p>
                      <button 
                        onClick={() => setStatus('idle')} 
                        className="mt-12 text-[10px] text-df-green font-black uppercase tracking-[0.6em] hover:text-white transition-colors border-b border-df-green/20 pb-2"
                      >
                        Iniciar Nuevo Protocolo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-16 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="relative group/input">
                            <input
                                type="text"
                                name="name"
                                id="form-name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent border-b border-white/5 py-4 text-white text-lg font-bold focus:outline-none focus:border-df-purple transition-all peer placeholder-transparent"
                                placeholder="Name"
                            />
                            <label htmlFor="form-name" className="absolute left-0 top-4 text-[10px] font-black tracking-[0.4em] text-zinc-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-widest peer-placeholder-shown:text-zinc-500 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:tracking-[0.4em] peer-focus:text-df-purple peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.4em] uppercase">
                                Identificador del Sujeto
                            </label>
                        </div>

                        <div className="relative group/input">
                            <input
                                type="email"
                                name="email"
                                id="form-email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent border-b border-white/5 py-4 text-white text-lg font-bold focus:outline-none focus:border-df-blue transition-all peer placeholder-transparent"
                                placeholder="Email"
                            />
                            <label htmlFor="form-email" className="absolute left-0 top-4 text-[10px] font-black tracking-[0.4em] text-zinc-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-widest peer-placeholder-shown:text-zinc-500 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:tracking-[0.4em] peer-focus:text-df-blue peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.4em] uppercase">
                                Frecuencia de Comunicación
                            </label>
                        </div>
                    </div>

                    <div className="relative group/input">
                        <input
                            type="text"
                            name="subject"
                            id="form-subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-white/5 py-4 text-white text-lg font-bold focus:outline-none focus:border-df-magenta transition-all peer placeholder-transparent"
                            placeholder="Subject"
                        />
                        <label htmlFor="form-subject" className="absolute left-0 top-4 text-[10px] font-black tracking-[0.4em] text-zinc-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-widest peer-placeholder-shown:text-zinc-500 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:tracking-[0.4em] peer-focus:text-df-magenta peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.4em] uppercase">
                            Tipo de Protocolo
                        </label>
                    </div>

                    <div className="relative group/input">
                        <textarea
                            name="message"
                            id="form-message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-transparent border-b border-white/5 py-4 text-white text-lg font-bold focus:outline-none focus:border-white transition-all peer placeholder-transparent resize-none"
                            placeholder="Message"
                        />
                        <label htmlFor="form-message" className="absolute left-0 top-4 text-[10px] font-black tracking-[0.4em] text-zinc-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-widest peer-placeholder-shown:text-zinc-500 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:tracking-[0.4em] peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.4em] uppercase">
                            Contenido del Mensaje
                        </label>
                    </div>

                    {status === 'error' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                            <FiAlertCircle size={18} /> {errorMessage}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="group relative w-full py-6 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] shadow-3xl shadow-df-purple/20 disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-white group-hover:bg-df-purple transition-colors duration-500"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-df-purple to-df-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                        <span className="relative z-10 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-black group-hover:text-white transition-colors duration-500">
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <><FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Sincronizar Datos</>
                            )}
                        </span>
                    </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
