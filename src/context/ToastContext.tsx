import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Bell, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface Modal {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'info' | 'danger';
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showAlert: (modal: Modal) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const showAlert = useCallback((config: Modal) => {
    setModal(config);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showAlert }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : toast.type === 'error'
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'bg-primary/10 border-primary/20 text-primary'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
              {toast.type === 'warning' && <Bell className="w-5 h-5" />}
              
              <p className="text-sm font-semibold flex-1">{toast.message}</p>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (modal.onCancel) modal.onCancel();
                setModal(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-md p-8 overflow-hidden"
            >
              <div className="text-center">
                {modal.type === 'danger' ? (
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-3">{modal.title}</h3>
                <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                  {modal.message}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (modal.onCancel) modal.onCancel();
                      setModal(null);
                    }}
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-secondary hover:bg-secondary/80 transition-all active:scale-[0.98]"
                  >
                    {modal.cancelText || 'Cancel'}
                  </button>
                  <button
                    onClick={() => {
                      if (modal.onConfirm) modal.onConfirm();
                      setModal(null);
                    }}
                    className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-white transition-all active:scale-[0.98] ${
                      modal.type === 'danger' ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {modal.confirmText || 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
