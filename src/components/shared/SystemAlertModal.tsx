import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface SystemAlertModalProps {
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function SystemAlertModal({
  type,
  title,
  message,
  onClose,
  actionLabel,
  onAction,
}: SystemAlertModalProps) {
  const icons = {
    info: <Info className="w-8 h-8 text-blue-500" />,
    success: <CheckCircle className="w-8 h-8 text-emerald-500" />,
    warning: <AlertTriangle className="w-8 h-8 text-amber-500" />,
    error: <AlertCircle className="w-8 h-8 text-destructive" />,
  };

  const bgColors = {
    info: 'bg-blue-500/10',
    success: 'bg-emerald-500/10',
    warning: 'bg-amber-500/10',
    error: 'bg-destructive/10',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center">
          <div className={`w-16 h-16 rounded-2xl ${bgColors[type]} flex items-center justify-center mx-auto mb-6`}>
            {icons[type]}
          </div>
          
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            {actionLabel && (
              <button
                onClick={onAction}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95"
              >
                {actionLabel}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
