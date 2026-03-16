'use client';

import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: <FiAlertTriangle size={24} className="text-red-500" />,
      button: 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20',
      iconBg: 'bg-red-500/10'
    },
    info: {
      icon: <FiAlertTriangle size={24} className="text-df-blue" />,
      button: 'bg-df-blue text-white hover:bg-df-blue/80 shadow-df-blue/20',
      iconBg: 'bg-df-blue/10'
    }
  };

  const theme = themes[variant];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md glass p-8 rounded-4xl border border-white/10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <FiX size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl ${theme.iconBg} mb-6`}>
            {theme.icon}
          </div>
          
          <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 rounded-2xl ${theme.button} font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
