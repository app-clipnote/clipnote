import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { SystemAlertModal, type AlertType } from '../components/shared/SystemAlertModal';

interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface AlertContextType {
  showAlert: (
    type: AlertType,
    title: string,
    message: string,
    options?: { actionLabel?: string; onAction?: () => void }
  ) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback(
    (
      type: AlertType,
      title: string,
      message: string,
      options?: { actionLabel?: string; onAction?: () => void }
    ) => {
      const id = `alert_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setAlerts((prev) => [
        ...prev,
        { id, type, title, message, ...options },
      ]);
    },
    []
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Render stacked alerts */}
      {alerts.length > 0 && (
        <SystemAlertModal
          type={alerts[0].type}
          title={alerts[0].title}
          message={alerts[0].message}
          actionLabel={alerts[0].actionLabel}
          onAction={() => {
            alerts[0].onAction?.();
            dismissAlert(alerts[0].id);
          }}
          onClose={() => dismissAlert(alerts[0].id)}
        />
      )}
    </AlertContext.Provider>
  );
}

/** Hook — call this anywhere inside <AlertProvider> to trigger a system alert */
export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}
