import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200
              ${isSuccess ? 'bg-studio-900/95 border-emerald-500/30 text-studio-100' : ''}
              ${isError ? 'bg-studio-900/95 border-red-500/40 text-studio-100' : ''}
              ${!isSuccess && !isError ? 'bg-studio-900/95 border-indigo-500/30 text-studio-100' : ''}
            `}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${
                isSuccess ? 'text-emerald-400' : isError ? 'text-red-400' : 'text-indigo-400'
              }`}
            />
            <p className="text-xs font-medium leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-studio-500 hover:text-studio-300 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
