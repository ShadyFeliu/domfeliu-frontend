'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, getMediaUrl } from '@/lib/api';
import { GalleryItem } from '@/types';
import { FiPlus, FiTrash2, FiImage, FiVideo, FiEdit } from 'react-icons/fi';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [type, setType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const fetchGallery = async () => {
    try {
      const data = await api.get<GalleryItem[]>('/gallery');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch gallery', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/gallery/${id}`);
      setItems(items.filter(i => i.id !== id));
      setDeleteModal({ isOpen: false, id: null }); // Close modal after successful delete
    } catch {
      alert('Error al eliminar el medio');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Por favor selecciona un archivo');

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await api.post<{ url: string }>('/admin/upload/image', formData);
      const url = uploadRes.url;

      await api.post('/admin/gallery', {
        type,
        caption: caption || undefined,
        url,
        order: items.length
      });

      setCaption('');
      setFile(null);
      setIsAdding(false);
      await fetchGallery();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al añadir el medio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await api.put(`/admin/gallery/${editingItem.id}`, {
        type,
        caption: caption || undefined,
        url: editingItem.url // Reuse existing URL for now
      });

      setEditingItem(null);
      setCaption('');
      setIsAdding(false);
      await fetchGallery();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar el medio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setCaption(item.caption || '');
    setType(item.type);
    setIsAdding(true);
  };

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center -mt-20">
      <div className="w-10 h-10 border-2 border-df-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Galería Visual</h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em] font-bold opacity-60 italic">Gestión de Activos Multimedia</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (editingItem) {
              setEditingItem(null);
              setCaption('');
              setType('image');
            }
          }}
          className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl ${isAdding ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-black hover:bg-df-green hover:text-white hover:scale-105 active:scale-95 shadow-white/5'}`}
        >
          {isAdding ? 'Cerrar Terminal' : <><FiPlus className="group-hover:rotate-90 transition-transform" /> Inyectar Fragmento Visual</>}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-10 rounded-4xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500 border border-df-green/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-df-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-4 relative z-10">
            <div className="w-2 h-2 rounded-full bg-df-green shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>
            {editingItem ? 'Modificar Activo Multimedia' : 'Especificación de Medio'}
          </h2>

          <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Identidad del Medio</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as 'image' | 'video')}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-green/50 focus:outline-none appearance-none transition-all cursor-pointer font-bold uppercase text-[11px] tracking-widest"
              >
                <option value="image">Estático (Componente de Imagen)</option>
                <option value="video">Movimiento (Transmisión MP4)</option>
              </select>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Descripción Descriptiva</label>
               <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Descripción del momento..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-green/50 focus:ring-1 focus:ring-df-green/20 focus:outline-none transition-all placeholder:text-zinc-700" />
            </div>

            {!editingItem && (
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Unidad de Archivo Primaria</label>
                <div className="relative group/file">
                  <input 
                    type="file" 
                    accept={type === 'image' ? 'image/*' : 'video/mp4'}
                    required 
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-black/40 border-2 border-dashed border-white/10 rounded-3xl px-8 py-10 transition-all hover:border-df-green/30 group-hover/file:bg-black/60 cursor-pointer file:hidden text-center text-sm font-bold text-gray-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] uppercase tracking-widest font-black text-gray-500 group-hover/file:text-df-green">
                    {file ? file.name : `Selecciona componente de transmisión ${type === 'image' ? 'de imagen' : 'de vídeo'}`}
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-df-green text-black font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 disabled:opacity-50 flex justify-center items-center gap-4 shadow-2xl shadow-df-green/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  editingItem ? 'Actualizar Activo Multimedia' : 'Sincronizar Activo Multimedia'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        <h2 className="text-[10px] filter saturate-0 opacity-50 uppercase tracking-[0.5em] font-black">Almacenamiento Visual ({items.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full glass p-20 rounded-4xl border border-white/5 text-center">
               <FiImage size={40} className="mx-auto text-gray-700 mb-6 opacity-20" />
               <p className="text-[11px] uppercase tracking-[0.3em] font-black text-gray-500">Estado de Vacío: No se detectaron datos visuales</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="glass rounded-4xl border border-white/5 overflow-hidden group hover:scale-[1.03] transition-all duration-700 relative aspect-square"
              >
                {item.type === 'video' ? (
                  <video src={getMediaUrl(item.url)} className="w-full h-full object-cover transition-all duration-700" controls={false} muted />
                ) : (
                  <Image src={getMediaUrl(item.url)} alt={item.caption || ''} width={600} height={600} className="w-full h-full object-cover transition-all duration-700" />
                )}
                
                {/* Overlay Component */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-df-green shadow-lg translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-500">
                      {item.type === 'video' ? <FiVideo /> : <FiImage />}
                    </div>
                    <div className="flex items-center gap-2 translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-500">
                      <button 
                        onClick={() => startEdit(item)}
                        className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-df-green hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
                        title="Editar Activo"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: item.id })}
                        className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-red-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
                        title="Eliminar Activo"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="translate-y-[20px] group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] uppercase tracking-widest font-black text-df-green mb-1">{item.type}</p>
                    <p className="text-sm font-black text-white uppercase tracking-tight line-clamp-2">{item.caption || 'Fragmento sin etiqueta'}</p>
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
        title="¿Eliminar Fragmento Visual?"
        message="¿Estás seguro de que quieres purgar este activo de la galería visual? Esta operación no se puede revertir."
        confirmText="Purgar activo multimedia"
      />
    </div>
  );
}
