/* Importint React and Link from react-router-dom */
import React from "react";
import { Link } from "react-router-dom";

/* Importing the CSS file */
import "../css/pokedex.css";

/* Importing the list of Pokémon */
import pokemonList from "../data/pokemons.json";

/**
 * Pokedex component that displays a list of Pokémon as links.
 * Each Pokémon name is converted to lowercase and used as the URL path.
 *
 * @component
 * @example
 * return (
 *   <Pokedex />
 * )
 */
const Pokedex: React.FC = () => {
  const [pokemonToShow, setPokemonToShow] = React.useState(pokemonList);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredPokemon = pokemonList.filter((pokemon) =>
      pokemon.name.english.toLowerCase().startsWith(searchQuery)
    );
    setPokemonToShow(filteredPokemon);
  };

  return (
    <div id="pokedex">
      <div id="pokedex-navbar">
        <p>3D Pokedex</p>
        <search>
          <input
            type="text"
            placeholder="Search Pokémon"
            onInput={handleInput}
          />
        </search>
      </div>
      <div id="pokedex-container">
        {pokemonToShow.map((pokemon, index) => (
          <Link
            key={index}
            to={`/${pokemon.id}`}
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="pokemon-sprite">
              <img
                src={`/sprites/${pokemon.id}MS.png`}
                alt={pokemon.name.english}
              />
              <p>{pokemon.name.english}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Pokedex;
