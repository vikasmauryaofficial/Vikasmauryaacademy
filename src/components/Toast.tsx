import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slideUp flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white max-w-md ${
            toast.type === 'success'
              ? 'bg-dark'
              : toast.type === 'error'
                ? 'bg-red'
                : 'bg-amber'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-green" />}
          {toast.type === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
