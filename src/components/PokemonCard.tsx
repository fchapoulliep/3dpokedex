import React from "react";
import Tilt from "react-parallax-tilt";
import "../css/pokemoncard.css";

import { Link } from "react-router-dom";
import PokemonType from "./PokemonType";

interface PokemonCardProps {
  id: number;
  name: string;
  types: string[];
}

const PokemonCard: React.FC<PokemonCardProps> = (pokemon) => {
  return (
    <Tilt
      className={`background-stripes pokemon-cards ${pokemon.types[0].toLowerCase()}`}
      glareEnable
      glareMaxOpacity={0.3}
      glareColor="white"
      glarePosition="all"
      glareBorderRadius="20px"
      scale={1.1}
    >
      <div className="inner-element">
        <Link to={`/${pokemon.id}`}>
          <div className="pokemon-types">
            {pokemon.types.map((type) => (
              <PokemonType key={type} type={type} />
            ))}
          </div>
          <img src={`/sprites/${pokemon.id}.png`} alt={pokemon.name} />
          <p>
            {pokemon.name} <br />
            <small style={{ fontSize: "10px" }}>#{pokemon.id}</small>
          </p>
        </Link>
      </div>
    </Tilt>
  );
};

export default PokemonCard;
