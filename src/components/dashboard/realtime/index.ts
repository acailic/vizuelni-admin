/**
 * Real-time Dashboard Components Index
 * Feature 41: Real-time Dashboards
 */

// Hooks
export { useWebSocket, useWebSocketChannel } from '@/lib/realtime/useWebSocket';
export type {
  WebSocketHookReturn,
  ConnectionStatus,
  WebSocketMessage,
} from '@/lib/realtime/useWebSocket';

export {
  useRealtimeMetric,
  useRealtimeMetrics,
} from '@/lib/realtime/useRealtimeData';
export type {
  RealtimeMetric,
  RealtimeDataPoint,
  RealtimeConfig,
} from '@/lib/realtime/useRealtimeData';

// Widgets
export {
  MetricCardWidget,
  SparklineWidget,
  LineChartWidget,
  GaugeWidget,
  ProgressWidget,
  MetricWithSparklineWidget,
} from './DashboardWidgets';
export type { DashboardWidgetProps, WidgetType } from './DashboardWidgets';

// Alerts
export {
  AlertProvider,
  useAlerts,
  AlertBanner,
  AlertList,
  AlertToast,
} from './AlertSystem';
export type {
  Alert,
  AlertRule,
  AlertSeverity,
  AlertStatus,
} from './AlertSystem';
