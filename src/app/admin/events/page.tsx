'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Event } from '@/types';
import { FiPlus, FiTrash2, FiCalendar, FiMapPin, FiTag, FiClock, FiEdit } from 'react-icons/fi';
import { format } from 'date-fns';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('España');
  const [ticketUrl, setTicketUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const fetchEvents = async () => {
    try {
      const data = await api.get<Event[]>('/events');
      setEvents(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch {
      alert('Error al eliminar el evento');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.post<{ url: string }>('/admin/upload/image', formData);
        imageUrl = uploadRes.url;
      }

      await api.post('/admin/events', {
        title,
        date: new Date(date).toISOString(),
        venue,
        city,
        country,
        ticketUrl: ticketUrl || null,
        imageUrl
      });

      setTitle('');
      setDate('');
      setVenue('');
      setCity('');
      setTicketUrl('');
      setImageFile(null);
      setIsAdding(false);
      await fetchEvents();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al añadir el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsSubmitting(true);
    try {
      let imageUrl = editingEvent.imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.post<{ url: string }>('/admin/upload/image', formData);
        imageUrl = uploadRes.url;
      }

      await api.put(`/admin/events/${editingEvent.id}`, {
        title,
        date: new Date(date).toISOString(),
        venue,
        city,
        country,
        ticketUrl: ticketUrl || null,
        imageUrl
      });

      setEditingEvent(null);
      setTitle('');
      setDate('');
      setVenue('');
      setCity('');
      setTicketUrl('');
      setIsAdding(false);
      await fetchEvents();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const d = new Date(event.date);
    const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setDate(formattedDate);
    setVenue(event.venue);
    setCity(event.city);
    setCountry(event.country);
    setTicketUrl(event.ticketUrl || '');
    setImageFile(null);
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
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Tour de Eventos</h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em] font-bold opacity-60 italic">Programación de Actuaciones en Vivo</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (editingEvent) {
              setEditingEvent(null);
              setTitle('');
              setDate('');
              setVenue('');
              setCity('');
              setTicketUrl('');
              setImageFile(null);
            }
          }}
          className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl ${isAdding ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-black hover:bg-df-blue hover:text-white hover:scale-105 active:scale-95 shadow-white/5'}`}
        >
          {isAdding ? 'Cerrar Expansión' : <><FiPlus className="group-hover:rotate-90 transition-transform" /> Añadir Nuevo Evento</>}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-10 rounded-4xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500 border border-df-blue/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-df-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-4 relative z-10">
            <div className="w-2 h-2 rounded-full bg-df-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            {editingEvent ? 'Modificar Registro de Evento' : 'Configuración del Evento'}
          </h2>

          <form onSubmit={editingEvent ? handleUpdate : handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Título del Evento</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Summer Club Session..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
            </div>
            
            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Fecha y Hora</label>
              <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all font-mono text-sm scheme-dark" />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Nombre del Recinto</label>
              <input type="text" required value={venue} onChange={e => setVenue(e.target.value)} placeholder="Pacha, Razzmatazz..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Ciudad y País</label>
              <div className="flex gap-4">
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Barcelona" className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
                <input type="text" required value={country} onChange={e => setCountry(e.target.value)} placeholder="ES" className="w-32 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Imagen Promocional (Opcional)</label>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={e => setImageFile(e.target.files?.[0] || null)}
                 className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
               />
               {editingEvent?.imageUrl && !imageFile && (
                 <p className="text-[10px] text-zinc-500 italic mt-2">Imagen actual registrada en sistema.</p>
               )}
            </div>
            
            <div className="md:col-span-2 space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Enlace de Entradas (Opcional)</label>
              <input type="url" value={ticketUrl} onChange={e => setTicketUrl(e.target.value)} placeholder="https://tickets.com/..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-df-blue/50 focus:ring-1 focus:ring-df-blue/20 focus:outline-none transition-all placeholder:text-zinc-700" />
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
                  editingEvent ? 'Actualizar Registro de Evento' : 'Confirmar y Desplegar Evento'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-[10px] filter saturate-0 opacity-50 uppercase tracking-[0.5em] font-black">Línea de Tiempo en Vivo ({events.length})</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {events.length === 0 ? (
            <div className="glass p-20 rounded-4xl border border-white/5 text-center">
               <FiCalendar size={40} className="mx-auto text-gray-700 mb-6 opacity-20" />
               <p className="text-[11px] uppercase tracking-[0.3em] font-black text-gray-500">Silencio: No hay futuras transmisiones programadas</p>
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id} 
                className="glass p-6 md:p-8 rounded-4xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-df-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-8 w-full md:w-auto">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-black/50 border border-white/5 min-w-[100px] border-b-2 border-b-df-blue/30 group-hover:scale-105 transition-all duration-500">
                        <span className="text-[10px] uppercase font-black tracking-widest text-df-blue">{format(new Date(event.date), 'MMM')}</span>
                        <span className="text-3xl font-black text-white tracking-tighter">{format(new Date(event.date), 'dd')}</span>
                        <span className="text-[9px] uppercase font-bold text-gray-500 mt-1">{format(new Date(event.date), 'yyyy')}</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-df-blue transition-colors line-clamp-1">{event.title}</h3>
                            {event.ticketUrl && <FiTag className="text-df-green text-sm" title="Tickets Available" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <FiMapPin size={12} className="text-df-blue/60" />
                                <span className="text-[10px] uppercase tracking-widest font-black">{event.venue}, {event.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <FiClock size={12} className="text-gray-600" />
                                <span className="text-[10px] font-mono font-bold tracking-widest">{format(new Date(event.date), 'HH:mm')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <button 
                      onClick={() => startEdit(event)}
                      className="w-12 h-12 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                      title="Editar Evento"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, id: event.id })}
                    className="w-12 h-12 flex items-center justify-center text-red-400/30 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 active:scale-90"
                    title="Eliminar Evento"
                  >
                    <FiTrash2 size={20} />
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
        title="¿Eliminar Evento?"
        message="Esta acción es permanente y no se puede deshacer. El evento se borrará de la base de datos."
        confirmText="Eliminar permanentemente"
      />
    </div>
  );
}
