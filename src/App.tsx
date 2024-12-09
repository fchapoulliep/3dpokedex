import "./css/App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PokemonLayout from "./components/PokemonLayout";
import Pokedex from "./components/Pokedex";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/:pokemonId" element={<PokemonLayout />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
