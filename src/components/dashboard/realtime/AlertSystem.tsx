/**
 * Alert System for Real-time Dashboards
 * Feature 41: Real-time Dashboards
 */

'use client';

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react';

// ============================================================
// ALERT TYPES
// ============================================================

export type AlertSeverity = 'info' | 'warning' | 'error' | 'success';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  timestamp: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface AlertRule {
  id: string;
  name: string;
  metricId: string;
  condition: 'gt' | 'lt' | 'eq' | 'threshold' | 'change';
  threshold: number;
  severity: AlertSeverity;
  enabled: boolean;
  cooldownMinutes: number;
}

interface AlertContextValue {
  alerts: Alert[];
  activeAlerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'status'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
}

// ============================================================
// ALERT CONTEXT
// ============================================================

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback(
    (alertData: Omit<Alert, 'id' | 'timestamp' | 'status'>) => {
      const alert: Alert = {
        ...alertData,
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        status: 'active',
      };
      setAlerts((prev) => [alert, ...prev].slice(0, 100)); // Keep last 100 alerts
    },
    []
  );

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date() }
          : alert
      )
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: 'resolved', resolvedAt: new Date() }
          : alert
      )
    );
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <AlertContext.Provider
      value={{
        alerts,
        activeAlerts,
        addAlert,
        acknowledgeAlert,
        resolveAlert,
        dismissAlert,
        clearAllAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}

// ============================================================
// ALERT BANNER COMPONENT
// ============================================================

export function AlertBanner() {
  const { activeAlerts, acknowledgeAlert, dismissAlert } = useAlerts();
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const currentAlert = activeAlerts[currentAlertIndex];

  useEffect(() => {
    if (currentAlertIndex >= activeAlerts.length) {
      setCurrentAlertIndex(0);
    }
  }, [activeAlerts.length, currentAlertIndex]);

  if (!currentAlert) return null;

  const severityStyles = {
    info: 'bg-blue-600 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-600 text-white',
    success: 'bg-green-600 text-white',
  };

  const severityIcons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '🚨',
    success: '✅',
  };

  return (
    <div
      className={`${severityStyles[currentAlert.severity]} px-4 py-2 flex items-center justify-between`}
    >
      <div className='flex items-center gap-3'>
        <span>{severityIcons[currentAlert.severity]}</span>
        <div>
          <span className='font-medium'>{currentAlert.title}</span>
          <span className='mx-2'>•</span>
          <span className='text-sm opacity-90'>{currentAlert.message}</span>
        </div>
        {activeAlerts.length > 1 && (
          <span className='text-xs opacity-75'>
            ({currentAlertIndex + 1}/{activeAlerts.length})
          </span>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {activeAlerts.length > 1 && (
          <button
            onClick={() =>
              setCurrentAlertIndex((i) => (i + 1) % activeAlerts.length)
            }
            className='px-2 py-1 text-sm hover:bg-white/20 rounded'
          >
            Sledeći
          </button>
        )}
        <button
          onClick={() => acknowledgeAlert(currentAlert.id)}
          className='px-2 py-1 text-sm hover:bg-white/20 rounded'
        >
          Potvrdi
        </button>
        <button
          onClick={() => dismissAlert(currentAlert.id)}
          className='px-2 py-1 text-sm hover:bg-white/20 rounded'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ALERT LIST COMPONENT
// ============================================================

interface AlertListProps {
  maxItems?: number;
  showAcknowledged?: boolean;
  locale?: 'en' | 'sr' | 'srLat';
}

export function AlertList({
  maxItems = 10,
  showAcknowledged = false,
  locale = 'srLat',
}: AlertListProps) {
  const { alerts, acknowledgeAlert, resolveAlert, dismissAlert } = useAlerts();

  const filteredAlerts = showAcknowledged
    ? alerts
    : alerts.filter((a) => a.status === 'active');

  const displayedAlerts = filteredAlerts.slice(0, maxItems);

  const formatTime = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return locale === 'en' ? 'Just now' : 'Upravo';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    return date.toLocaleDateString();
  };

  const severityColors = {
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  };

  if (displayedAlerts.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
        {locale === 'en' ? 'No active alerts' : 'Nema aktivnih obaveštenja'}
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {displayedAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded-lg border-l-4 ${severityColors[alert.severity]} ${
            alert.status !== 'active' ? 'opacity-60' : ''
          }`}
        >
          <div className='flex items-start justify-between'>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>
                {alert.title}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                {alert.message}
              </p>
              <p className='text-xs text-gray-400 mt-2'>
                {formatTime(alert.timestamp)} • {alert.source}
              </p>
            </div>
            <div className='flex gap-1'>
              {alert.status === 'active' && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className='px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Potvrdi
                </button>
              )}
              {alert.status === 'acknowledged' && (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className='px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Reši
                </button>
              )}
              <button
                onClick={() => dismissAlert(alert.id)}
                className='px-2 py-1 text-xs text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
          </div>
          {alert.status !== 'active' && (
            <span className='inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700'>
              {alert.status === 'acknowledged'
                ? locale === 'en'
                  ? 'Acknowledged'
                  : 'Potvrđeno'
                : locale === 'en'
                  ? 'Resolved'
                  : 'Rešeno'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ALERT NOTIFICATION TOAST
// ============================================================

export function AlertToast() {
  const { activeAlerts } = useAlerts();
  const [visibleAlert, setVisibleAlert] = useState<Alert | null>(null);

  useEffect(() => {
    if (activeAlerts.length > 0) {
      // Show the most recent alert
      const latestAlert = activeAlerts[0];
      if (latestAlert.id !== visibleAlert?.id) {
        setVisibleAlert(latestAlert);

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setVisibleAlert(null);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [activeAlerts, visibleAlert?.id]);

  if (!visibleAlert) return null;

  const severityStyles = {
    info: 'bg-blue-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
    success: 'bg-green-600',
  };

  return (
    <div className='fixed bottom-4 right-4 z-50 animate-slide-up'>
      <div
        className={`${severityStyles[visibleAlert.severity]} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm`}
      >
        <p className='font-medium'>{visibleAlert.title}</p>
        <p className='text-sm opacity-90 mt-1'>{visibleAlert.message}</p>
      </div>
    </div>
  );
}

export default AlertProvider;
