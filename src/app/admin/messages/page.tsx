'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ContactMessage } from '@/types';
import { FiCheckCircle, FiTrash2, FiMessageSquare, FiUser, FiMail, FiClock, FiShield } from 'react-icons/fi';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { format } from 'date-fns';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await api.get<ContactMessage[]>('/admin/contacts');
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string, isCurrentlyRead: boolean) => {
    try {
      await api.patch(`/admin/contacts/${id}/read`, { isRead: !isCurrentlyRead });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: !isCurrentlyRead } : m));
    } catch {
      alert('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: string) => {
     try {
       await api.delete(`/admin/contacts/${id}`);
       setMessages(messages.filter(m => m.id !== id));
       setDeleteModal({ isOpen: false, id: null });
     } catch {
       alert('Error al eliminar el mensaje');
     }
  }

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center -mt-20">
      <div className="w-10 h-10 border-2 border-df-magenta border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Bandeja de Entrada Central</h1>
          <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.3em] font-bold opacity-60 italic">Comunicaciones Encriptadas</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-df-magenta/5 border border-df-magenta/10 text-df-magenta text-[9px] font-black uppercase tracking-widest">
           <FiShield className="animate-pulse" /> Protocolo de Seguridad Activo
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="¿Purgar Comunicación?"
        message="¿Deseas eliminar permanentemente esta transmisión? Este proceso destruirá todos los fragmentos asociados al mensaje."
        confirmText="Confirmar purga de datos"
      />

      <div className="space-y-6">
        {messages.length === 0 ? (
          <div className="glass p-24 rounded-4xl border border-white/5 text-center flex flex-col items-center gap-6">
            <FiMessageSquare size={48} className="text-df-magenta opacity-20" />
            <p className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-500">Frecuencia Limpia: Sin señales entrantes</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`glass rounded-4xl p-8 border transition-all duration-500 relative overflow-hidden group hover:bg-white/5 ${
                message.isRead 
                  ? 'border-white/5 opacity-80' 
                  : 'border-df-magenta/30 shadow-[0_0_40px_rgba(255,0,255,0.05)] bg-linear-to-br from-df-magenta/5 to-transparent'
              }`}
            >
              {!message.isRead && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-df-magenta/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
              )}
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className={`text-xl font-black uppercase tracking-tighter transition-colors ${message.isRead ? 'text-zinc-400' : 'text-white'}`}>
                      {message.subject}
                    </h3>
                    {!message.isRead && (
                      <span className="bg-df-magenta text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-df-magenta/30 animate-in zoom-in">Nueva Transmisión</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      <FiUser className="text-df-magenta opacity-40" />
                      <span className="text-[10px] uppercase font-black tracking-widest">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      <FiMail className="opacity-40" />
                      <span className="text-[10px] font-mono font-bold">{message.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      <FiClock size={12} className="opacity-40" />
                      <span className="text-[10px] font-mono font-bold uppercase">{format(new Date(message.createdAt), 'MMM dd, yyyy · HH:mm')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleMarkAsRead(message.id, message.isRead)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 active:scale-90 ${
                            message.isRead 
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10' 
                            : 'bg-df-magenta/10 text-df-magenta hover:bg-df-magenta hover:text-white shadow-xl shadow-df-magenta/10'
                        }`}
                        title={message.isRead ? 'Marcar como no leído' : 'Marcar como leído'}
                    >
                        <FiCheckCircle size={20} />
                    </button>
                    <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: message.id })}
                        className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 rounded-2xl transition-all duration-300 active:scale-90"
                        title="Purgar Comunicación"
                    >
                        <FiTrash2 size={20} />
                    </button>
                </div>
              </div>
              
              <div className="mt-8 bg-black/40 p-6 rounded-3xl border border-white/5 relative group-hover:border-white/10 transition-colors">
                <p className={`text-[13px] leading-relaxed font-medium whitespace-pre-wrap transition-colors ${message.isRead ? 'text-zinc-500' : 'text-zinc-300 group-hover:text-white'}`}>
                  {message.message}
                </p>
                <div className="absolute bottom-4 right-4 text-[8px] font-black uppercase text-zinc-800 tracking-widest pointer-events-none">
                  Carga Útil Encriptada 0x{message.id.slice(0, 6)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
