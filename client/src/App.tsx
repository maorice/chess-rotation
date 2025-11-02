import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Waiting from "./pages/Waiting.tsx";
import Game from "./pages/Game.tsx";

function App() {
  console.log("[DEBUG]: Rendering app");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/game/:gameId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
