/**
 * Importing react and the Tilt component. As long as the css
 */
import React, { useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import "../css/pokemoncard.css";

import { Link } from "react-router-dom";
import PokemonType from "./PokemonType";

/**
 * Props for the PokemonCard component.
 *
 * @interface PokemonCardProps
 * @property {number} id - The unique identifier for the Pokémon.
 * @property {string} name - The name of the Pokémon.
 * @property {string[]} types - An array of types associated with the Pokémon.
 */
interface PokemonCardProps {
  id: number;
  name: string;
  types: string[];
}

/**
 * The tilt library sizes its glare once, when the pointer enters the card.
 * The active card keeps growing after that (a 0.3 s height transition), so a
 * pointer arriving during the growth got a glare sized on the smaller card,
 * which left the corners bare until it came back. The card is measured again
 * whenever its layout size changes. setSize is internal to the library (not in
 * its types): it is called only if present.
 */
function useGlareFollowsSize() {
  const ref = useRef<Tilt>(null);
  useEffect(() => {
    const tilt = ref.current as unknown as {
      setSize?: () => void;
      wrapperEl?: { node: HTMLElement | null };
    } | null;
    const node = tilt?.wrapperEl?.node;
    if (!tilt || !node || typeof tilt.setSize !== "function" || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(() => tilt.setSize?.());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * PokemonCard component that displays a Pokémon card with its name, ID, types, and image.
 */
const PokemonCard: React.FC<PokemonCardProps> = (pokemon) => {
  const glareRef = useGlareFollowsSize();
  return (
    <Tilt
      ref={glareRef}
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
          <img
            src={`${import.meta.env.BASE_URL}/sprites/${pokemon.id}.png`}
            alt={pokemon.name}
          />
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
