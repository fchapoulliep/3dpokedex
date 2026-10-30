// PokemonLayout.tsx
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import Pokemon from "./Pokemon";
import { useParams } from "react-router-dom";
import pokemonList from "../data/pokemons.json";

// Read from the data rather than hardcoded, so the right arrow stays correct if Pokémon are added.
const lastId = String(Math.max(...pokemonList.map((p) => p.id)));

/**
 * `PokemonLayout` is a React functional component that renders the layout for displaying a Pokémon.
 * It uses the `useParams` hook to extract the `pokemonId` from the URL parameters.
 *
 * The component includes:
 * - A `NavBar` component at the top.
 * - A `Slider` component with direction "left" if the Pokémon exists and the `pokemonId` is not "1".
 * - A `Pokemon` component that displays the Pokémon based on the `pokemonId` or a default ID if `pokemonId` is not available.
 * - A `Slider` component with direction "right" if the Pokémon exists and is not the last one.
 *
 * @returns {JSX.Element} The rendered layout for the Pokémon page.
 */
const PokemonLayout: React.FC = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const pokemon = pokemonList.find((p) => p.id === Number(pokemonId));

  // The tab title follows in-app navigation; the built page of each Pokémon already has it.
  useEffect(() => {
    document.title = pokemon ? `${pokemon.name.english} | 3D Pokédex` : "3D Pokédex";
  }, [pokemon]);

  // No arrows on an unknown id: they would lead to other unknown ids.
  return (
    <>
      <NavBar />
      {pokemon && pokemonId !== "1" && <Slider direction="left" />}
      <Pokemon pokemonId={pokemonId || "defaultId"} />
      {pokemon && pokemonId !== lastId && <Slider direction="right" />}
    </>
  );
};

export default PokemonLayout;
