'use client';

import { useState, useEffect } from 'react';
import { api, getMediaUrl } from '@/lib/api';
import { FiMail, FiLock, FiCamera, FiCheckCircle, FiActivity, FiServer, FiShield } from 'react-icons/fi';
import Image from 'next/image';
import { AdminUser } from '@/types';

interface SystemStatus {
  database: string;
  version: string;
  environment: string;
}

export default function AdminProfile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [presskitUrl, setPresskitUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, systemStatus] = await Promise.all([
          api.get<AdminUser>('/auth/validate'),
          api.get<SystemStatus>('/status').catch(() => ({ database: 'Offline', version: '2.0.0', environment: 'production' }))
        ]);
        
        if (user.email) {
            setEmail(user.email);
            setProfileImage(user.profileImage);
            setPresskitUrl(user.presskitUrl);
            setBio(user.bio || '');
        }
        setStatus(systemStatus);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') setIsUploading(true);
    else setIsUploadingPDF(true);
    
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const endpoint = type === 'image' ? '/admin/upload/image' : '/admin/upload/document';
      const res = await api.post<{ url: string }>(endpoint, formData);
      
      if (type === 'image') setProfileImage(res.url);
      else setPresskitUrl(res.url);
      
      setMessage({ type: 'success', text: `${type === 'image' ? 'Imagen' : 'Presskit'} subido con éxito` });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: `Error al subir el ${type === 'image' ? 'archivo' : 'PDF'}` });
    } finally {
      setIsUploading(false);
      setIsUploadingPDF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await api.patch('/auth/profile', {
        email,
        password: password || undefined,
        profileImage,
        bio,
        presskitUrl
      });
      setMessage({ type: 'success', text: 'Perfil actualizado con éxito' });
      setPassword('');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Perfil Admin</h1>
          <p className="text-gray-400 mt-1 uppercase text-xs tracking-[0.3em] font-bold opacity-60">Configuración e Identidad del Sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Row: Identity & Health Side-by-Side */}
        <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-df-purple via-df-magenta to-df-blue opacity-50"></div>
          
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 bg-zinc-900 flex items-center justify-center p-1.5 ring-4 ring-df-purple/10 group-hover:ring-df-purple/30 transition-all duration-500">
              {profileImage ? (
                <Image 
                  src={getMediaUrl(profileImage)} 
                  alt="Profile" 
                  width={128} 
                  height={128} 
                  className="w-full h-full object-cover rounded-full select-none" 
                />
              ) : (
                <div className="w-full h-full bg-linear-to-tr from-df-purple via-df-magenta to-df-blue flex items-center justify-center rounded-full text-4xl font-black text-white">
                  DF
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-full">
                  <div className="w-8 h-8 border-2 border-df-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <label className="absolute bottom-1 right-1 p-2.5 bg-df-magenta text-white rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl shadow-df-magenta/40 border border-white/20">
              <FiCamera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={isUploading} />
            </label>
          </div>

          <h3 className="text-xl font-black text-white uppercase tracking-widest">Administrador</h3>
          <div className="mt-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">ID: DOM FELIU</p>
          </div>
          <p className="mt-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic animate-pulse">Imagen Oficial del Artista</p>
        </div>

        {/* Real System Health Section */}
        <div className="glass p-10 rounded-4xl border border-white/5 flex flex-col justify-center space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-df-purple flex items-center gap-3">
            <FiActivity className="animate-pulse" /> System Health
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <FiServer size={14} className="opacity-50" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Database</span>
              </div>
              <div className={`inline-block text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${status?.database === 'Online' ? 'text-df-green bg-df-green/10 border-df-green/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                {status?.database || 'Sincronizando...'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <FiShield size={14} className="opacity-50" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Environment</span>
              </div>
              <div className="inline-block text-[10px] font-black uppercase px-4 py-2 rounded-xl text-df-blue bg-df-blue/10 border border-df-blue/20">
                {status?.environment || 'Detectando...'}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold italic">Kernel Version</span>
            <span className="text-[10px] font-mono text-gray-400">v{status?.version || '0.0.0'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Configuration Form */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-df-blue/5 rounded-full blur-3xl -mb-48 -mr-48"></div>
        
        <form onSubmit={handleSubmit} className="relative space-y-10">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-df-purple/10 border border-df-purple/20 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-df-purple">Seguridad de Credenciales</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black flex items-center gap-2">
                  <FiMail size={12} /> Email de Contacto
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 focus:outline-none transition-all duration-300 placeholder:text-zinc-700"
                  placeholder="admin@domfeliu.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black flex items-center gap-2">
                  <FiLock size={12} /> Contraseña de Acceso
                </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-magenta/50 focus:ring-1 focus:ring-df-magenta/20 focus:outline-none transition-all duration-300 placeholder:text-zinc-700"
                  placeholder="Mantener actual ••••••••"
                  minLength={6}
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Biografía del Artista (Sección About)</label>
                <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)}
                  rows={6}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 focus:outline-none transition-all duration-300 placeholder:text-zinc-700 resize-none"
                  placeholder="Escribe aquí tu biografía profesional..."
                />
                <div className="flex justify-end">
                  <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{bio.length} caracteres</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-df-blue/10 border border-df-blue/20 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-df-blue">Material para Promotores (EPK)</span>
                </div>
                
                <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                      <FiActivity size={24} />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white uppercase italic">Presskit Oficial (PDF)</h5>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {presskitUrl ? 'Documento cargado correctamente' : 'No hay ningún PDF seleccionado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {presskitUrl && (
                      <a 
                        href={getMediaUrl(presskitUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        Ver PDF
                      </a>
                    )}
                    <label className="px-6 py-3 bg-df-blue hover:bg-df-blue/80 text-white rounded-xl cursor-pointer transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      {isUploadingPDF ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>{presskitUrl ? 'Reemplazar PDF' : 'Subir Presskit'}</>
                      )}
                      <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'pdf')} disabled={isUploadingPDF} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-df-green/10 text-df-green border border-df-green/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              <div className={`p-2 rounded-lg ${message.type === 'success' ? 'bg-df-green/20' : 'bg-red-500/20'}`}>
                {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiActivity size={20} />}
              </div>
              <p className="text-sm font-bold uppercase tracking-wide">{message.text}</p>
            </div>
          )}

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full md:w-auto min-w-[200px] py-5 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-df-purple hover:text-white hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-50 flex justify-center items-center gap-3 group shadow-xl shadow-white/5"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Actualizar Control de Dominio <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
