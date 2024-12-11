// PokemonLayout.tsx
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import Pokemon from "./Pokemon";
import { useParams } from "react-router-dom";

/**
 * `PokemonLayout` is a React functional component that renders the layout for displaying a Pokémon.
 * It uses the `useParams` hook to extract the `pokemonId` from the URL parameters.
 *
 * The component includes:
 * - A `NavBar` component at the top.
 * - A `Slider` component with direction "left" if the `pokemonId` is not "1".
 * - A `Pokemon` component that displays the Pokémon based on the `pokemonId` or a default ID if `pokemonId` is not available.
 * - A `Slider` component with direction "right" if the `pokemonId` is not "151".
 *
 * @returns {JSX.Element} The rendered layout for the Pokémon page.
 */
const PokemonLayout: React.FC = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();

  return (
    <>
      <NavBar />
      {pokemonId !== "1" && <Slider direction="left" />}
      <Pokemon pokemonId={pokemonId || "defaultId"} />
      {pokemonId !== "151" && <Slider direction="right" />}
    </>
  );
};

export default PokemonLayout;
