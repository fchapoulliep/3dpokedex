/**
 * Importing React and the PokemonType CSS.
 */
import React from "react";
import "../css/pokemontype.css";

/**
 * Interface for the PokemonTypeProps type, which includes the Pokémon type.
 */
interface PokemonTypeProps {
  type: string;
}

/**
 * A React functional component that displays a Pokémon type icon and its name.
 *
 * @component
 * @param {PokemonTypeProps} props - The properties object.
 * @param {string} props.type - The type of the Pokémon.
 * @returns {JSX.Element} A div containing an image of the Pokémon type and its name.
 */
const PokemonType: React.FC<PokemonTypeProps> = ({ type }) => {
  return (
    <div className={`type-div`}>
      <img
        className="pokemon-type" id={type.toLowerCase()}
        src={`/type_icons/${type.toLowerCase()}.svg`}
        alt={type}
      />
      <p>{type}</p>
    </div>
  );
};

export default PokemonType;
