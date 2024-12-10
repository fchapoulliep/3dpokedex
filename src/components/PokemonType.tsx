import React from "react";
import "../css/pokemontype.css";

interface PokemonTypeProps {
  type: string;
}

const PokemonType: React.FC<PokemonTypeProps> = ({ type }) => {
  return (
    <div className={`type-div`}>
      <img
        className="pokemon-type" id={type.toLowerCase()}
        src={`/type_icons/${type.toLowerCase()}.svg`}
        alt={type}
      />
      {type}
    </div>
  );
};

export default PokemonType;
