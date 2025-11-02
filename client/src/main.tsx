import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./App.css";
import { WSProvider } from "./context/WSContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WSProvider>
      <App />
    </WSProvider>
  </StrictMode>
);
