// Provides a singleton WebSocket connection shared by the entire client.
// Exposes connect(), send(), and subscribe to message types.
// Includes message buffering to handle race conditions.

import React, { createContext, useRef, useContext, useCallback } from "react";

// set to localhost for local dev, will eventually implement a getServerURL() that will return the server URL
const serverURL = "ws://localhost:8080/ws";

interface WSMessage {
  type: string;
  args: Record<string, string>;
}

type MessageHandler = (msg: WSMessage) => void;

interface WSContextType {
  connect: () => Promise<void>;
  send: (msg: WSMessage) => void;
  subscribe: (messageType: string, handler: MessageHandler) => () => void;
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
  const messageHandlers = useRef<Record<string, MessageHandler>>({});
  const messageBuffer = useRef<WSMessage[]>([]);

  /* Subscribe to a specific message type */
  const subscribe = useCallback(
    (messageType: string, handler: MessageHandler) => {
      messageHandlers.current[messageType] = handler;
      console.log(`[DEBUG]: Subscribed to ${messageType}`);

      // Check buffer for any messages that arrived before subscription
      const bufferedMessages = messageBuffer.current.filter(
        (msg) => msg.type === messageType
      );

      if (bufferedMessages.length > 0) {
        console.log(
          `[DEBUG]: Processing ${bufferedMessages.length} buffered message(s) for ${messageType}`
        );

        // Process each buffered message
        bufferedMessages.forEach((msg) => {
          handler(msg);
        });

        // Remove processed messages from buffer
        messageBuffer.current = messageBuffer.current.filter(
          (msg) => msg.type !== messageType
        );
      }

      // Return unsubscribe function
      return () => {
        delete messageHandlers.current[messageType];
        console.log(`[DEBUG]: Unsubscribed from ${messageType}`);
      };
    },
    []
  );

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
        console.error("[ERROR]: Connection timed out");
        socket.close();
        reject(new Error("Connection timed out"));
      }, 5000);

      socket.onopen = () => {
        clearTimeout(timeout);
        console.log("[DEBUG]: Successfully connected to server");
        resolve();
      };

      socket.onerror = (err) => {
        clearTimeout(timeout);
        console.error("[ERROR]: Connection failed");
        reject(err);
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as WSMessage;
          console.log(`[DEBUG]: Received message:`, msg);

          // Call the handler for this specific message type
          const handler = messageHandlers.current[msg.type];
          if (handler) {
            handler(msg);
            console.log("[DEBUG]: Handler found and called");
          } else {
            // Buffer the message if no handler is registered yet
            messageBuffer.current.push(msg);
            console.warn(
              `[WARN]: No handler registered for message type: ${msg.type}, buffering message`
            );
          }
        } catch (err) {
          console.error("[ERROR]: Failed to parse message", err);
        }
      };

      socket.onclose = () => {
        ws.current = null;
        console.log("[DEBUG]: Connection closed");
        // Clear buffer on disconnect
        messageBuffer.current = [];
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
    <WSContext.Provider value={{ connect, send, subscribe }}>
      {children}
    </WSContext.Provider>
  );
}
