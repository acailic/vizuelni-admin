/**
 * WebSocket Hook for Real-time Data
 * Feature 41: Real-time Dashboards
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface WebSocketHookOptions {
  url: string;
  onMessage?: (data: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface WebSocketHookReturn {
  status: ConnectionStatus;
  lastMessage: WebSocketMessage | null;
  send: (data: unknown) => void;
  disconnect: () => void;
  reconnect: () => void;
}

/**
 * Hook for WebSocket connections
 * Provides real-time data streaming capabilities
 */
export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnect = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  heartbeatInterval = 30000,
}: WebSocketHookOptions): WebSocketHookReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  // Clear heartbeat interval
  const clearHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Start heartbeat to keep connection alive
  const startHeartbeat = useCallback(() => {
    clearHeartbeat();
    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, clearHeartbeat]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    setStatus('connecting');

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        reconnectCountRef.current = 0;
        startHeartbeat();
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          // Ignore pong messages
          if (message.type === 'pong') return;

          setLastMessage(message);
          onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        clearHeartbeat();
        onDisconnect?.();

        // Attempt reconnection
        if (reconnect && reconnectCountRef.current < maxReconnectAttempts) {
          reconnectCountRef.current++;
          setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        setStatus('error');
        onError?.(error);
      };
    } catch (error) {
      setStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnect,
    reconnectInterval,
    maxReconnectAttempts,
    startHeartbeat,
    clearHeartbeat,
  ]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    clearHeartbeat();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, [clearHeartbeat]);

  // Send data through WebSocket
  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    lastMessage,
    send,
    disconnect,
    reconnect: connect,
  };
}

/**
 * Hook for subscribing to specific data channels
 */
export function useWebSocketChannel<T>(
  channelName: string,
  options: Omit<WebSocketHookOptions, 'onMessage'>
): {
  data: T | null;
  status: ConnectionStatus;
  send: (data: T) => void;
} {
  const [data, setData] = useState<T | null>(null);

  const { status, send: wsSend } = useWebSocket({
    ...options,
    onMessage: (message) => {
      if (message.type === channelName) {
        setData(message.payload as T);
      }
    },
    onConnect: () => {
      // Subscribe to channel on connect
      wsSend({ type: 'subscribe', channel: channelName });
      options.onConnect?.();
    },
  });

  const send = useCallback(
    (payload: T) => {
      wsSend({ type: channelName, payload });
    },
    [wsSend, channelName]
  );

  return { data, status, send };
}

export default useWebSocket;
