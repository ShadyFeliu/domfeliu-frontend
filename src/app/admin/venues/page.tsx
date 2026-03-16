'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Venue } from '@/types';
import { FiPlus, FiTrash2, FiMapPin, FiEdit } from 'react-icons/fi';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const fetchVenues = async () => {
    try {
      const data = await api.get<Venue[]>('/venues');
      setVenues(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Failed to fetch venues', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/venues/${id}`);
      setVenues(venues.filter(v => v.id !== id));
    } catch {
      alert('Error al eliminar el club');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/venues', {
        name,
        city
      });

      setName('');
      setCity('');
      setIsAdding(false);
      await fetchVenues();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al añadir el club');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/admin/venues/${editingVenue.id}`, {
        name,
        city
      });

      setEditingVenue(null);
      setName('');
      setCity('');
      setIsAdding(false);
      await fetchVenues();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar el club');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setName(venue.name);
    setCity(venue.city);
    setIsAdding(true);
  };

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center -mt-20">
      <div className="w-10 h-10 border-2 border-df-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Clubs & Residencias</h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em] font-bold opacity-60 italic">Gestión del Historial de Despliegue</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (editingVenue) {
              setEditingVenue(null);
              setName('');
              setCity('');
            }
          }}
          className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl ${isAdding ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-black hover:bg-df-blue hover:text-white hover:scale-105 active:scale-95 shadow-white/5'}`}
        >
          {isAdding ? 'Cerrar Expansión' : <><FiPlus className="group-hover:rotate-90 transition-transform" /> Añadir Nuevo Club</>}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-10 rounded-4xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500 border border-df-blue/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-df-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-4 relative z-10">
            <div className="w-2 h-2 rounded-full bg-df-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            {editingVenue ? 'Modificar Registro de Club' : 'Configuración del Club'}
          </h2>

          <form onSubmit={editingVenue ? handleUpdate : handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Nombre del Club</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Sounders, Catedral..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
            </div>
            
            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Ciudad</label>
              <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Valencia, Denia..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-df-blue text-white font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 disabled:opacity-50 flex justify-center items-center gap-4 shadow-2xl shadow-df-blue/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  editingVenue ? 'Actualizar Registro de Club' : 'Confirmar y Registrar Club'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-[10px] filter saturate-0 opacity-50 uppercase tracking-[0.5em] font-black">Archivo de Despliegue ({venues.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {venues.length === 0 ? (
            <div className="col-span-full glass p-20 rounded-4xl border border-white/5 text-center">
               <FiMapPin size={40} className="mx-auto text-gray-700 mb-6 opacity-20" />
               <p className="text-[11px] uppercase tracking-[0.3em] font-black text-gray-500">No hay registros de clubes en la base de datos</p>
            </div>
          ) : (
            venues.map((venue) => (
              <div 
                key={venue.id} 
                className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between group relative overflow-hidden transition-all hover:bg-white/5"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-df-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col">
                  <h3 className="text-sm font-black uppercase tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                     <FiMapPin size={10} className="text-df-blue" />
                     <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">
                       {venue.city}
                     </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEdit(venue)}
                      className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      title="Editar Club"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, id: venue.id })}
                      className="w-10 h-10 flex items-center justify-center text-red-400/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Eliminar Club"
                    >
                      <FiTrash2 size={16} />
                    </button>
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
        title="¿Eliminar Registro de Club?"
        message="Esta acción es permanente y eliminará este club del historial visual del sitio público."
        confirmText="Eliminar permanentemente"
      />
    </div>
  );
}
