// Provides a singleton WebSocket connection shared by the entire client.
// Exposes connect(), send(), and receive().

import React, { createContext, useRef, useEffect, useContext } from "react";

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
  const connect = () => {
    console.log("[DEBUG]: Connecting to server");

    const socket = new WebSocket(serverURL);
    ws.current = socket;

    const timeout = setTimeout(() => {
      console.log("[ERROR]: Connection timed out");
      socket.close();
    }, 5000);

    socket.onopen = () => {
      clearTimeout(timeout);
      console.log("[DEBUG]: Successfully connected to server");
    };

    socket.onerror = () => {
      clearTimeout(timeout);
      console.log("[ERROR]: Connection failed");
    };

    socket.onclose = () => {
      ws.current = null;
      console.log("[DEBUG]: Connection closed");
    };
  };

  const send = (msg: WSMessage) =>
    console.log(`[DEBUG]: Sending ${JSON.stringify(msg)}`);

  return (
    <WSContext.Provider value={{ connect, send }}>
      {children}
    </WSContext.Provider>
  );
}
