// Provides a singleton WebSocket connection shared by the entire client.
// Exposes connect(), send(), and receive().

import React, {
  createContext,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";

// set to localhost for local dev, will eventually implement a getServerURL() that will return the server URL
const serverURL = "ws://localhost:8080/ws";

interface WSProviderProps {
  children: React.ReactNode;
}

interface WSMessage {
  type: string;
  args: Record<string, string>;
}

interface WSContextType {
  connect: () => void;
  send: (msg: WSMessage) => void;
}

export const WSContext = createContext<null | WSContextType>(null);

// custom hook to return context
export function useWS() {
  const ctx = useContext(WSContext);
  if (!ctx) throw new Error("[ERROR]: Context is null");
  return ctx;
}

export function WSProvider({ children }: { children: React.ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const connect = useCallback((): Promise<void> => {
    console.log("[DEBUG]: Connecting to server");

    return new Promise((resolve, reject) => {
      // if already connected, resolve immediately
      if (ws.current?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const socket = new WebSocket(serverURL);
      ws.current = socket;

      const timeout = setTimeout(() => {
        console.log("[ERROR]: Connection timed out");
        socket.close();
        reject(new Error("Connection timed out"));
      }, 5000);

      socket.onopen = () => {
        clearTimeout(timeout);
        console.log("[DEBUG]: Successfully connected to server");
        resolve(); // resolve the promise when open
      };

      socket.onerror = (err) => {
        clearTimeout(timeout);
        console.log("[ERROR]: Connection failed");
        reject(err); // reject the promise on error
      };

      socket.onclose = () => {
        ws.current = null;
        console.log("[DEBUG]: Connection closed");
      };
    });
  }, []);

  const send = useCallback((payload: WSMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
      console.log(`[DEBUG]: Sending ${JSON.stringify(payload)}`);
    } else {
      console.log("[DEBUG]: Socket not ready for sending");
    }
  }, []);

  return (
    <WSContext.Provider value={{ connect, send }}>
      {children}
    </WSContext.Provider>
  );
}
