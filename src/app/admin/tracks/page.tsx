'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Track } from '@/types';
import { FiMusic, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('Dom Feliu');
  const [file, setFile] = useState<File | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [soundcloudUrl, setSoundcloudUrl] = useState('');
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const fetchTracks = async () => {
    try {
      const data = await api.get<Track[]>('/tracks');
      setTracks(data);
    } catch (error) {
      console.error('Failed to fetch tracks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/tracks/${id}`);
      setTracks(tracks.filter(t => t.id !== id));
      setDeleteModal({ isOpen: false, id: null }); // Close modal after successful deletion
    } catch {
      alert('Error al eliminar la pista');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Por favor selecciona un archivo de audio');

    setIsSubmitting(true);
    try {
      // 1. Upload audio file
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await api.post<{ url: string }>('/admin/upload/audio', formData);
      const audioUrl = uploadRes.url;

      // 2. Create track
      await api.post('/admin/tracks', {
        artist,
        audioUrl,
        spotifyUrl: spotifyUrl || null,
        soundcloudUrl: soundcloudUrl || null,
        order: tracks.length
      });

      // 3. Reset and refresh
      setTitle('');
      setFile(null);
      setSpotifyUrl('');
      setSoundcloudUrl('');
      setIsAdding(false);
      await fetchTracks();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al añadir la pista');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    setIsSubmitting(true);
    try {
      await api.put(`/admin/tracks/${editingTrack.id}`, {
        title,
        artist,
        audioUrl: editingTrack.audioUrl, // Keeping the same file for now as per simple edit requirements
        spotifyUrl: spotifyUrl || null,
        soundcloudUrl: soundcloudUrl || null,
      });
      setEditingTrack(null);
      setTitle('');
      setArtist('Dom Feliu');
      setSpotifyUrl('');
      setSoundcloudUrl('');
      setIsAdding(false); // Close the form after update
      await fetchTracks();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar la pista');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (track: Track) => {
    setEditingTrack(track);
    setTitle(track.title);
    setArtist(track.artist);
    setSpotifyUrl(track.spotifyUrl || '');
    setSoundcloudUrl(track.soundcloudUrl || '');
    setIsAdding(true); // Reuse the form area
  };

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center -mt-20">
      <div className="w-10 h-10 border-2 border-df-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Catálogo de Pistas</h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em] font-bold opacity-60 italic">Gestión de Activos de Audio</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (editingTrack) {
              setEditingTrack(null);
              setTitle('');
              setArtist('Dom Feliu');
              setSpotifyUrl('');
              setSoundcloudUrl('');
            }
          }}
          className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl ${isAdding ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-black hover:bg-df-purple hover:text-white hover:scale-105 active:scale-95 shadow-white/5'}`}
        >
          {isAdding ? 'Cerrar Terminal' : <><FiPlus className="group-hover:rotate-90 transition-transform" /> Inyectar Nueva Pista</>}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-10 rounded-4xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500 border border-df-purple/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-df-purple/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-4 relative z-10">
            <div className="w-2 h-2 rounded-full bg-df-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            {editingTrack ? 'Modificar Registro de Pista' : 'Especificación de Pista'}
          </h2>

          <form onSubmit={editingTrack ? handleUpdate : handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Título de la Pista</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Introduce el título..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 focus:outline-none transition-all placeholder:text-zinc-700"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Identidad del Artista</label>
              <input 
                type="text" 
                required 
                value={artist} 
                onChange={e => setArtist(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Enlace Spotify (Opcional)</label>
              <input 
                type="url" 
                value={spotifyUrl} 
                onChange={e => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 focus:outline-none transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Enlace SoundCloud (Opcional)</label>
              <input 
                type="url" 
                value={soundcloudUrl} 
                onChange={e => setSoundcloudUrl(e.target.value)}
                placeholder="https://soundcloud.com/..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-purple/50 focus:ring-1 focus:ring-df-purple/20 focus:outline-none transition-all placeholder:text-zinc-700"
              />
            </div>

            {!editingTrack && (
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Componente de Audio Primario</label>
                <div className="relative group/file">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    required 
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-black/40 border-2 border-dashed border-white/10 rounded-3xl px-8 py-10 transition-all hover:border-df-purple/30 group-hover/file:bg-black/60 cursor-pointer file:hidden text-center text-sm font-bold text-gray-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] uppercase tracking-widest font-black text-gray-500 group-hover/file:text-df-purple">
                    {file ? file.name : 'Suelta o busca componentes de audio'}
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-df-purple text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-df-magenta hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 disabled:opacity-50 flex justify-center items-center gap-4 shadow-2xl shadow-df-purple/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  editingTrack ? 'Actualizar Registro de Pista' : 'Subir y Autorizar Pista'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-[10px] filter saturate-0 opacity-50 uppercase tracking-[0.5em] font-black mb-6">Registros de Base de Datos ({tracks.length})</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {tracks.length === 0 ? (
            <div className="glass p-20 rounded-4xl border border-white/5 text-center">
               <FiMusic size={40} className="mx-auto text-gray-700 mb-6 opacity-20" />
               <p className="text-[11px] uppercase tracking-[0.3em] font-black text-gray-500">Estado Neutral: No se encontraron clústeres de datos</p>
            </div>
          ) : (
            tracks.map((track) => (
              <div 
                key={track.id} 
                className="glass p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-df-purple to-df-magenta opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-14 h-14 rounded-2xl bg-black/50 flex items-center justify-center text-df-purple group-hover:text-white border border-white/5 group-hover:border-df-purple/30 group-hover:scale-110 transition-all duration-500">
                      <FiMusic size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider group-hover:text-df-purple transition-colors">{track.title}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{track.artist}</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="hidden lg:block px-6 py-2 rounded-full bg-white/5 border border-white/5 max-w-[200px]">
                    <p className="text-[9px] font-mono text-gray-600 truncate">{track.audioUrl}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => startEdit(track)}
                      className="w-12 h-12 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                      title="Editar Pista"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, id: track.id })}
                      className="w-12 h-12 flex items-center justify-center text-red-400/50 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 active:scale-90"
                      title="Purgar Pista"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="¿Eliminar Pista?"
        message="Esta acción es irreversible. Se eliminarán permanentemente el archivo de audio y los registros asociados."
        confirmText="Confirmar purga de datos"
      />
    </div>
  );
}
