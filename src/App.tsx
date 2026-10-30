import "./css/App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PokemonLayout from "./components/PokemonLayout";
import Pokedex from "./components/Pokedex";

function App() {
  return (
    // Real paths (/3dpokedex/25) rather than a hash: GitHub Pages serves one
    // HTML file per Pokémon, written at build time (see vite.config.ts).
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/:pokemonId" element={<PokemonLayout />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
