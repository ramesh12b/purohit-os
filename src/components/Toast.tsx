import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-slideUp ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500 text-white'
              : toast.type === 'warning'
              ? 'bg-amber-950/95 border-amber-500 text-white'
              : 'bg-neutral-900/95 border-amber-500/50 text-white'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
          </div>

          <div className="flex-1 min-w-0 text-xs">
            <h5 className="font-black text-sm text-white tracking-tight">{toast.title}</h5>
            <p className="text-neutral-200 mt-0.5 leading-relaxed">{toast.description}</p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white shrink-0 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
