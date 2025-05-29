interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
}

interface WebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export class NetworkWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private options: WebSocketOptions;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private isConnecting: boolean = false;
  private isManualClose: boolean = false;

  constructor(options: WebSocketOptions = {}) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.url = `${protocol}//${window.location.host}/ws`;
    this.options = options;
    this.maxReconnectAttempts = options.reconnectAttempts || 5;
    this.reconnectDelay = options.reconnectDelay || 3000;
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    this.isManualClose = false;

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.options.onConnect?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.options.onMessage?.(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      this.isConnecting = false;
      this.options.onDisconnect?.();

      if (!this.isManualClose && !event.wasClean) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.isConnecting = false;
      this.options.onError?.(error);
    };
  }

  private handleReconnect() {
    if (this.isManualClose || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached or manual close");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  disconnect() {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }
  }

  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance for global use
let globalWebSocket: NetworkWebSocket | null = null;

export function useWebSocket(options?: WebSocketOptions): NetworkWebSocket {
  if (!globalWebSocket) {
    globalWebSocket = new NetworkWebSocket(options);
  }
  return globalWebSocket;
}

// React hook for WebSocket integration
import { useEffect, useState, useCallback } from "react";

export function useNetworkWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Event | null>(null);

  const ws = useWebSocket({
    onConnect: () => {
      setIsConnected(true);
      setError(null);
    },
    onDisconnect: () => {
      setIsConnected(false);
    },
    onMessage: (message) => {
      setLastMessage(message);
    },
    onError: (error) => {
      setError(error);
      setIsConnected(false);
    },
  });

  useEffect(() => {
    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, []);

  const sendMessage = useCallback((message: any) => {
    ws.send(message);
  }, [ws]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect: () => ws.connect(),
    disconnect: () => ws.disconnect(),
  };
}
